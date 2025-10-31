import Stripe from "stripe";
import Booking from "../models/booking.js";

export const stripeWebhooks = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // ⚠️ تأكد أن req.body هو "raw body" وليس JSON
    event = stripe.webhooks.constructEvent(
      req.body, // raw buffer (وليس object)
      sig,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (error) {
    console.error("❌ Error verifying Stripe webhook:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // ✅ التعامل مع الحدث الصحيح
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { bookingId } = session.metadata || {};

        if (!bookingId) {
          console.warn("⚠️ No bookingId found in session metadata.");
          break;
        }

        // ✅ تحديث الحجز في قاعدة البيانات
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

    res.json({ received: true });
  } catch (error) {
    console.error("🔥 Webhook processing error:", error);
    res.status(500).send("Server Internal Error");
  }
};
