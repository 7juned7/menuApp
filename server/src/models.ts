import {Schema, model, connect} from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DATABASE_URI = process.env.DATABASE as string;

connect("mongodb+srv://ffriction73:JBaTqCffhnGixMhR@cluster0.qpibn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {console.log("DB connected successfully✅")})
    .catch((err) => {console.log("DB did not connect❌\n", err)}) 

interface IMenu extends Document {
    name: string;
    description: string;
    category: string;
    foodType: string;
    price: number;
    availability: boolean;
    image?: string;
}

interface IUser extends Document {
    username: string,
    password: string,
    role: string,
}

interface IOrderItem {
    itemId: string;
    name: string;
    quantity: number;
}

export interface IOrder extends Document {
    tableNumber: number;
    items: IOrderItem[];
    status: "pending" | "preparing" | "ready" | "served";
    createdAt: Date;
}

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true}
});

const User = model<IUser>("user", userSchema);

const menuSchema = new Schema({
    name: {type: String, required:true},
    description: {type: String},  
    category: {type: String, required:true},
    foodType: {type: String},
    price: {type: Number},
    availability: {type: Boolean},
    image: {type: String} 
});

const Menu = model<IMenu>("menu", menuSchema);

const orderSchema = new Schema({
    tableNumber: { type: Number, required: true }, 
    items: [{
        itemId: { type: Schema.Types.ObjectId, ref: Menu, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
    }],
    status: { 
        type: String, 
        enum: ["pending", "preparing", "ready", "served"], 
        default: "pending"
    },
    createdAt: { type: Date, default: Date.now }
});

const Order = model<IOrder>("Order", orderSchema);

export {User, Menu, Order};