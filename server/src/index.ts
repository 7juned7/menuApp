import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import {User, Menu} from "./models";
import jwt from "jsonwebtoken";
import { authenticate, authorizeAdmin } from "./authorize";
import multer from "multer";

const PORT = 5000;
const app = express();

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

// Register Route
app.post("/api/register", async (req: Request, res: Response): Promise<any> => {
    try{
        const {username, password, role} = req.body;
        const existingUser = await User.findOne({username});

        if(existingUser){
            return res.status(400).json({message: "Username already exist"});
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    } catch(err){
        console.error("Registration error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login route
app.post("/api/login", async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error("Error in /login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// add item route 
app.put("/api/additem", authenticate, authorizeAdmin, upload.single("image"), async (req: Request, res: Response): Promise<any> => {
    try{
        const {name, description, category, foodType, price, availability} = req.body;
        const image = req.file ? req.file.buffer.toString("base64") : undefined;
        if (!name || !description || !category || !foodType || !price || availability === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (req.file && req.file.size > 2 * 1024 * 1024) {
            return res.status(400).json({ message: "Image size should be less than 2MB" });
        }
        const newItem = new Menu({
            name,
            description,
            category,
            foodType,
            price,
            availability,
            image
        })

        await newItem.save();
        res.status(200).json({message: "Item added successfully"});
    } catch(err){
        console.error("Error in /additem:", err);
        res.status(500).json({message: "Internal Server Error"});
    }
})

// get all items
app.get("/api/getmenu", async(req: Request, res: Response): Promise<any> => {
    try{
        const menu = await Menu.find();
        if(menu.length === 0){
            return res.status(200).json({message: "Menu is empty"});
        }
        res.status(200).json({menu});
    } catch(err){
        console.error("Error in getmenu: ", err)
        res.status(500).json({message: "Internal Server Error"});
    }
})

// modify an item in menu
app.put("/api/changeitem/:id", authenticate, authorizeAdmin, upload.single("image"), async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid item ID" });
        }

        const item = await Menu.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (req.file) {
            updates.image = req.file.buffer.toString("base64");
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Provide at least one field to update" });
        }

        const updatedItem = await Menu.findByIdAndUpdate(id, updates, { new: true });

        res.status(200).json({ message: "Item updated successfully", updatedItem });
    } catch (err) {
        console.error("Error in change item: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}✅`);
});
