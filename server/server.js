import express from "express";
import cors from "cors";
import "dotenv/config";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./Inngest/index.js";
import showRouter from "./routes/showRoute.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { requireAuth } from "@clerk/express";

const app = express();

const port = 3000;

await connectDB();

//Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use((req, res, next) => {
  console.log("Auth header:", req.headers.authorization);
  next();
});
//API Routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
