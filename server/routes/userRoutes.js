import express from "express";
import {
  getFavorites,
  getUserBooking,
  updateFvorite,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/bookings", getUserBooking);
userRouter.post("/update-favorite", updateFvorite);
userRouter.get("/favorites", getFavorites);

export default userRouter;
