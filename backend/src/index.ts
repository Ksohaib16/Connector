import express, { Request, Response } from "express";
import "./db/prisma"; // Explicitly import the file to execute top-level code
import { errorHandler } from "./utility/errorHandler";
import prisma from "./db/prisma";
import rootRouter from "./routes/indexRoute"
import cors from "cors";
import { error } from "console";

const app = express();
app.use(cors({
  origin: [
    'https://connector-five.vercel.app/',
    "https://connector-sohaibs-projects-1c7baf9c.vercel.app/",
    'http://localhost:5173',  // for local development
  ],
  credentials: true  // if you're using cookies/sessions
}));
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.get("/", async (req: Request, res: Response): Promise<void> => {
  res.send("Hello world");
});

app.use("/api/v1", rootRouter)

app.all("*", (req: Request, res: Response) => {
    res.status(404).json({
        message: "Page Not Found",
    });
})

app.use(errorHandler);

app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`);
});