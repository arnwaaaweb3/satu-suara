// src/backend/server.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { sendVotingTransaction } from "./algorand";

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Healthcheck
app.get("/", (req, res) => {
  res.send("SatuSuara backend is running 🚀");
});

// Voting endpoint
app.post("/vote", async (req, res) => {
  try {
    const { candidate } = req.body;
    if (!candidate) {
      return res.status(400).json({ error: "Candidate is required" });
    }

    const txId = await sendVotingTransaction(candidate);
    res.json({ message: "Vote recorded successfully! Thanks for voting!", txId });
  } catch (error) {
    console.error("Error in /vote:", error);
    res.status(500).json({ error: "Failed to record vote. Please try again!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
