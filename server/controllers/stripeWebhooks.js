import Stripe from "stripe";
import Booking from "../models/booking.js";
import { inngest } from "../Inngest/index.js";

export const stripeWebhooks = async (req, res) => {
  const StripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // ⚠️ تأكد أن req.body هو "raw body" وليس JSON
    event = StripeInstance.webhooks.constructEvent(
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
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await StripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });
        const session = sessionList.data[0];

        const { bookingId } = session.metadata;

        if (!bookingId) {
          console.warn("⚠️ No bookingId found in session metadata.");
          break;
        }

        // ✅ تحديث الحجز في قاعدة البيانات
        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: "",
        });

        //send confarmition email
        await inngest.send({
          name: "app/show.booked",
          data: { bookingId },
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
