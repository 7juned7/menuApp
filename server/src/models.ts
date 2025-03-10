import {Schema, model, connect} from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DATABASE_URI = process.env.DATABASE as string;

connect(DATABASE_URI)
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

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true}
});

const menuSchema = new Schema({
    name: {type: String, required:true},
    description: {type: String},  
    category: {type: String, required:true},
    foodType: {type: String},
    price: {type: Number},
    availability: {type: Boolean},
    image: {type: String} 
})

const User = model<IUser>("user", userSchema);
const Menu = model<IMenu>("menu", menuSchema);

export {User, Menu};