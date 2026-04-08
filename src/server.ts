import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import schoolRoutes from "./routes/schoolRoutes";

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/schools", schoolRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is Live");
});
// Start server
app.listen(PORT, () => {
  console.log(`
  serve running on localhost${PORT}
  `);
});

export default app;
