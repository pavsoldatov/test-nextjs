import express from "express";
import cors from "cors";
import { promises as fs } from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001",
  "http://localhost:5002",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (valid origins)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }
      callback(new Error(`CORS policy violation: ${origin} not allowed`));
    },
    methods: ["GET"],
  })
);

app.use(express.json());

// Route to get menu items
app.get("/api/menu-items", async (_, res) => {
  try {
    const dataPath = path.join(process.cwd(), "api", "menu-items.json");
    const fileData = await fs.readFile(dataPath, "utf8");
    const menuItems = JSON.parse(fileData);

    // artificial delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// app.get("/test", (_, res) => {
//   res.status(200).json({ status: "ok" });
// });

app.listen(PORT, () => {
  console.log(`Menu items server running on port ${PORT}`);
});
