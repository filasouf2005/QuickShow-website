import axios from "axios";
import Movie from "../models/movie.js";
import Show from "../models/Show.js";
import Booking from "../models/booking.js";
import { clerkClient } from "@clerk/express";

//API Controller Function to Get User Booking

export const getUserBooking = async (req, res) => {
  try {
    const user = req.auth().userId;
    const bookings = await Booking.find({ user })
      .populate({ path: "show", populate: { path: "movie" } })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to Update Favorite Movie in Clerk User MetaData

export const updateFvorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;
    const user = await clerkClient.users.getUser(userId);
    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [];
    }
    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId);
    } else {
      user.privateMetadata.favorites = user.privateMetadata.favorites.filter(
        (item) => item !== movieId
      );
    }
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata,
    });

    res.json({ success: true, message: "Favorite Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to Get Favorites Movies

export const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);
    const favorites = user.privateMetadata.favorites;

    //Getting movies from database
    const movies = await Movie.find({ _id: { $in: favorites } });
    res.json({ success: true, movies });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
