// src/back-end/server.ts

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  deployVotingApp,
  callVotingApp,
  getVotingResults,
  setAppId,
} from "./algorand";

// Load .env file
dotenv.config();

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const initialCandidates = ["Alice", "Bob", "Charlie"];
let appIsDeployed = false;
const ADMIN_SECRET = process.env.ADMIN_SECRET || "satu-suara-secret";

// Deploy on server start
deployVotingApp(initialCandidates)
  .then((appId) => {
    console.log(`Smart contract deployed with ID: ${appId}`);
    setAppId(appId);
    appIsDeployed = true;
  })
  .catch((err) => {
    console.error("Failed to deploy smart contract:", err.message);
    appIsDeployed = false;
  });

// Healthcheck
app.get("/", (req, res) => {
  res.send("SatuSuara backend is running and ready! 🚀");
});

// Voting endpoint
app.post("/vote", async (req, res) => {
  if (!appIsDeployed) {
    return res.status(503).json({ error: "Voting application is not ready yet." });
  }

  try {
    const { candidate } = req.body;
    if (!candidate) {
      return res.status(400).json({ error: "Candidate is required" });
    }

    const txId = await callVotingApp(candidate);
    res.json({ message: "Vote recorded successfully!", txId });
  } catch (error) {
    console.error("Error in /vote:", error);
    res.status(500).json({ error: "Failed to record vote. Please try again!" });
  }
});

// Results endpoint
app.get("/results", async (req, res) => {
  if (!appIsDeployed) {
    return res.status(503).json({ error: "Voting application is not ready yet." });
  }

  try {
    const results = await getVotingResults();
    res.json({ results });
  } catch (error) {
    console.error("Error in /results:", error);
    res.status(500).json({ error: "Failed to fetch voting results." });
  }
});

// Candidates endpoint
app.get("/candidates", async (req, res) => {
  if (!appIsDeployed) {
    return res.json({ candidates: initialCandidates });
  }
  try {
    const results = await getVotingResults();
    const candidates = Object.keys(results);
    res.json({ candidates });
  } catch (error) {
    console.error("Error in /candidates:", error);
    res.status(500).json({ error: "Failed to fetch candidates." });
  }
});

// Admin redeploy endpoint
app.post("/deploy", async (req, res) => {
  const { candidates, secret } = req.body;
  if (secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return res.status(400).json({ error: "Candidates array required" });
  }
  try {
    const appId = await deployVotingApp(candidates);
    setAppId(appId);
    appIsDeployed = true;
    res.json({ message: "Deployed new voting app", appId });
  } catch (err) {
    console.error("Deploy error:", err);
    res.status(500).json({ error: "Failed to deploy new voting app" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});