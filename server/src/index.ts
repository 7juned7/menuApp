import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Menu, Restaurant } from "./models";
import jwt from "jsonwebtoken";
import { authenticate } from "./authorize";
import multer from "multer";
import cors from "cors";
import { config } from "dotenv";

config();
const PORT = 5001;
const app = express();
app.use(cors());

// Configure Multer for image upload (store in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

interface UserPayload {
    id: string;
    role: string;
    username: string;
}

declare module "express" {
    interface Request {
        user?: UserPayload;
    }
}

// Simple test route
app.get("/api/", (req: Request, res: Response) => {
    res.json("hello!");
});


// Register Restaurant
app.post("/api/register", async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        // Check if restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            return res.status(400).json({ message: "Restaurant already registered!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new restaurant
        const newRestaurant = new Restaurant({
            email,
            password: hashedPassword,
        });

        await newRestaurant.save();

        // Generate JWT token
        const token = jwt.sign({ id: newRestaurant._id, email }, process.env.JWT_SECRET as string, {
            expiresIn: "7d",
        });

        res.status(201).json({ message: "Restaurant registered successfully", token });

    } catch (error) {
        res.status(500).json({ message: "Server error❌", error });
    }
});

// Login Restaurant
app.post("/api/login", async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        // Check if restaurant exists
        const restaurant = await Restaurant.findOne({ email });
        if (!restaurant) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, restaurant.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: restaurant._id, name: restaurant.name },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ message: "Server error❌", error });
    }
});

// Update restaurant profile (excluding email, password, and menu)
app.put(
    "/api/update",
    authenticate,
    upload.fields([
        { name: "profilePicture", maxCount: 1 },
        { name: "bannerPicture", maxCount: 1 },
    ]),
    async (req: Request, res: Response): Promise<any> => {
        try {
            const restaurantId = (req as any).restaurant.id;
            let { name, description, phone, instagram } = req.body;
            // Extract colors into an object with explicit typing
            const colors: Record<string, string> = Object.keys(req.body)
            .filter(key => key.startsWith('colors.'))
            .reduce((acc: Record<string, string>, key) => {
            const colorKey = key.split('.')[1]; // Extract 'dark', 'medium', 'light'
            acc[colorKey] = req.body[key];
            return acc;
            }, {} as Record<string, string>);

            // Remove original color properties from req.body
            Object.keys(colors).forEach(key => delete req.body[`colors.${key}`]);

            // Add the transformed colors object to req.body
            req.body.colors = colors;

            // console.log(req.body); // Debugging: Check incoming data
            // console.log(colors);

            // ✅ Handle image uploads
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            const profilePicture = files?.profilePicture?.[0]?.buffer.toString("base64");
            const bannerPicture = files?.bannerPicture?.[0]?.buffer.toString("base64");

            // ✅ Update restaurant profile
            const updatedRestaurant = await Restaurant.findByIdAndUpdate(
                restaurantId,
                {
                    name,
                    description,
                    phone,
                    instagram,
                    colors, // Now properly formatted as an object
                    ...(profilePicture && { profilePicture }), // Update only if new image is provided
                    ...(bannerPicture && { bannerPicture }),
                },
                { new: true, runValidators: true }
            );

            if (!updatedRestaurant) {
                return res.status(404).json({ message: "Restaurant not found" });
            }

            res.status(200).json({ message: "Profile updated successfully", updatedRestaurant });

        } catch (error) {
            console.error("Update Error:", error);
            res.status(500).json({ message: "Server error❌", error });
        }
    }
);


// Add menu item to restaurant
app.put("/api/additem", authenticate, upload.single("image"), async (req: Request, res: Response): Promise<any> => {
    try {
        const restaurantId = (req as any).restaurant.id; // Extract restaurant ID from authenticated user
        const { name, description, category, foodType, price, availability } = req.body;
        const image = req.file ? req.file.buffer.toString("base64") : undefined;

        // Validate required fields
        if (!name || !category || !price || availability === undefined) {
            return res.status(400).json({ message: "Name, category, price, and availability are required" });
        }

        // Validate image size
        if (req.file && req.file.size > 2 * 1024 * 1024) {
            return res.status(400).json({ message: "Image size should be less than 2MB" });
        }

        // Find the restaurant
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Create a new menu item
        const newItem = new Menu({
            name,
            description,
            category,
            foodType,
            price,
            availability,
            image
        });

        // Save menu item
        await newItem.save();
        
        // Add menu item to restaurant's menu array
        if(restaurant.menu != undefined){
            restaurant.menu.push(newItem._id);
            await restaurant.save();
        }

        res.status(200).json({ message: "Item added successfully", newItem });

    } catch (err) {
        console.error("Error in /api/additem:", err);
        res.status(500).json({ message: "Internal Server Error❌", error: err });
    }
});

// Get restaurant details without menu
app.get("/api/restaurant/:id", async (req:Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        
        // Find the restaurant and exclude 'menu' field
        const restaurant = await Restaurant.findById(id).select("-menu -password");

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        console.error("Error fetching restaurant:", error);
        res.status(500).json({ message: "Internal Server Error❌" });
    }
});

// Get menu of a restaurant by restaurant ID
app.get("/api/restaurant/:id/menu", async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        
        // Find the restaurant and populate the menu field
        const restaurant = await Restaurant.findById(id).populate("menu");

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(200).json(restaurant.menu); // Send only the menu
    } catch (error) {
        console.error("Error fetching restaurant menu:", error);
        res.status(500).json({ message: "Internal Server Error❌" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}✅`);
});
