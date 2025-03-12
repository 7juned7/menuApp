import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import {User, Menu, Order} from "./models";
import jwt from "jsonwebtoken";
import { authenticate, authorizeAdmin } from "./authorize";
import multer from "multer";
import cors from "cors";

const PORT = 5000;
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
app.get("/api/getmenu", async (req: Request, res: Response): Promise<any> => {
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

app.get("/api/getitem/:id", async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid item ID" });
        }

        const item = await Menu.findById(id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ item });
    } catch (err) {
        console.error("Error in /getitem:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


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


app.post("/api/order", async (req: Request, res: Response): Promise<any> => {
    try {
        const { tableNumber, items } = req.body;

        // ✅ Validate Request
        if (!tableNumber || !items || items.length === 0) {
            return res.status(400).json({ message: "Table number and items are required" });
        }

        // ✅ Create and Save Order
        const newOrder = new Order({ tableNumber, items });
        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (err) {
        console.error("Error in /order:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/api/orders", authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    try {
        const orders = await Order.find().populate("items.itemId");

        res.status(200).json({ orders });
    } catch (err) {
        console.error("Error in /orders:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put("/api/order/:id/status", authenticate, authorizeAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "preparing", "ready", "served"].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Order status updated", order });
    } catch (err) {
        console.error("Error in /order/status:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/api/order-status/:tableNumber", async (req: Request, res: Response): Promise<any> => {
    try {
        const { tableNumber } = req.params;

        // Validate table number
        if (isNaN(Number(tableNumber))) {
            return res.status(400).json({ message: "Invalid table number" });
        }

        // Find the latest order for the given table
        const order = await Order.findOne({ tableNumber })
            .sort({ createdAt: -1 }) // Get the latest order
            .select("items status createdAt");

        if (!order) {
            return res.status(404).json({ message: "No order found for this table" });
        }

        res.status(200).json({
            tableNumber,
            status: order.status,
            items: order.items,
            createdAt: order.createdAt,
        });
    } catch (err) {
        console.error("Error in fetching order status:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}✅`);
});
