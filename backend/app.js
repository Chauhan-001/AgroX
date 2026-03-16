import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {mongoDbConnect} from './config/connection.js';
import farmerRoute from './routes/farmerRoute.js';
import adminRoute from './routes/adminRoute.js';
const app = express();

dotenv.config();


app.use(express.json());
app.use(cors());


mongoDbConnect("mongodb://localhost:27017/AgroX")
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);





app.use("/api/farmer", farmerRoute);
app.use("/api/admin", adminRoute);



app.listen(7000, "0.0.0.0", () => {
  console.log("Server running");
});
