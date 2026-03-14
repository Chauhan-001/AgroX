import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {mongoDbConnect} from './config/connection.js';
import farmerRoute from './routes/farmerRoute.js';
import adminRoute from './routes/adminRoute.js';
import Admin from './models/adminModel.js';
import bcrypt from "bcrypt";
const app = express();

dotenv.config();


app.use(express.json());
app.use(cors());


mongoDbConnect("mongodb://localhost:27017/AgroX")
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);




const createDefaultAdmin = async () => {
  const adminExists = await Admin.findOne({ id: process.env.ADMIN_ID });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({
      id: process.env.ADMIN_ID,
      password: hashedPassword
    });
    console.log("Default admin created");
  }};createDefaultAdmin();


app.use("/api/farmer", farmerRoute);
app.use("/api/admin", adminRoute);



app.listen(7000, "0.0.0.0", () => {
  console.log("Server running");
});
