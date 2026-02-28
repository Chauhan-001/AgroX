import express from 'express';
import {verifyOtp, sendOtp} from '../controllers/farmerController.js';

const farmerRoute = express.Router();

farmerRoute.post("/auth/send-otp", sendOtp);
farmerRoute.post("/auth/verify-otp", verifyOtp);

export default farmerRoute;