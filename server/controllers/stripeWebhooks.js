import Stripe from "stripe";
import Booking from "../models/booking.js";

export const stripeWebhooks = async (request, reseponse) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (error) {
    return reseponse.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { bookingId } = session.metadata || {};

        if (!bookingId) {
          console.warn("⚠️ No bookingId found in session metadata.");
          break;
        }

        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: "",
        });

        console.log(`✅ Booking ${bookingId} marked as paid.`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    reseponse.json({ received: true });
  } catch (error) {
    console.error("🔥 Webhook processing error:", error);
    reseponse.status(500).send("Server Internal Error");
  }
};
