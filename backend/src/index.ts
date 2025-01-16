import express, { Request, Response } from "express";
import "./db/prisma";
import { errorHandler } from "./utility/errorHandler";
import prisma from "./db/prisma";
import rootRouter from "./routes/indexRoute"
import cors from "cors";

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://connector-five.vercel.app',
    "https://connector-sohaibs-projects-1c7baf9c.vercel.app",
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Add request timeout
const timeout = 30000; 
app.use((req, res, next) => {
  req.setTimeout(timeout);
  res.setTimeout(timeout);
  next();
});

app.get("/", async (req: Request, res: Response) => {
  try {
    console.log("Root route hit at:", new Date().toISOString());
    res.send("Hello world");
  } catch (err) {
    console.error("Error in root route:", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/ping", (req: Request, res: Response) => {
  try {
    console.log("Ping received at:", new Date().toISOString());
    res.json({ 
      time: new Date().toISOString(),
      message: "Server is responsive"
    });
  } catch (err) {
    console.error("Error in ping route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/api/v1", rootRouter);

app.all("*", (req: Request, res: Response) => {
    console.log("404 route hit for:", req.url);
    res.status(404).json({
        message: "Page Not Found",
    });
});

app.use(errorHandler);

app.listen(PORT, "0.0.0.0", (): void => {
  console.log(`Server is running on port ${PORT}`);
});