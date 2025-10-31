import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/booking.js";
import Show from "../models/Show.js";
import { populate } from "dotenv";
import sendEmail from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest functions to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.create(userData);
  }
);
// Inngest functions to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);
// Inngest functions to Update user Data indatabase
const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  }
);

//
const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

    await step.run("check-payment-status", async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);

      //
      if (!booking.isPaid) {
        const show = await Show.findById(booking.show);
        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat];
        });
        show.markModified("occupiedSeats");
        await Show.save();
        await Booking.findByIdAndDelete(booking._id);
      }
    });
  }
);

//send Email
const sendBookingConfirmationEmail = inngest.createFunction(
  {
    id: "send-booking-confirmation-email",
  },
  { event: "app/show.bookrd" },
  async ({ event, step }) => {
    const { bookingId } = event.data;
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "show",
        populate: { path: "movie", model: "Movie" },
      })
      .populate("user");
    await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation: "${booking.show.movie.title}" booked`,
      body: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
    <h2 style="color: #4CAF50;">🎟️ Payment Confirmed!</h2>
    
    <p>Dear <strong>${booking.user.name}</strong>,</p>
    
    <p>We’re excited to let you know that your payment for the movie 
    <strong>"${
      booking.show.movie.title
    }"</strong> has been successfully received.</p>
    
    <h3 style="margin-top: 20px;">Booking Details:</h3>
    <ul style="background: #f9f9f9; padding: 10px; border-radius: 6px;">
      <li><strong>Movie:</strong> ${booking.show.movie.title}</li>
      <li><strong>Date:</strong> ${booking.show.date}</li>
      <li><strong>Time:</strong> ${booking.show.time}</li>
      <li><strong>Seats:</strong> ${booking.seats.join(", ")}</li>
      <li><strong>Total Paid:</strong> $${booking.amount}</li>
    </ul>

    <p>✅ Your booking is now confirmed. Please arrive at the venue at least 15 minutes before the showtime.</p>
    
    <p>If you have any questions, feel free to contact our support team.</p>
    
    <br/>
    <p>Best regards,<br/>
    <strong>The QuickShow Team</strong></p>

    <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
    <p style="font-size: 12px; color: #777;">
      This is an automated message. Please do not reply directly to this email.
    </p>
  </div>
  `,
    });
  }
);
// Create an empty array where we'll export future Inngest functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
];
