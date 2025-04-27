import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config();

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"], 
  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR", // Uptime monitoring services
        "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 250, // Refills 1 token per interval
      interval: 24 * 3600, // Refill every 24 hours
      capacity: 250, // Bucket capacity of 1 token
    }),
  ],
});

export default aj;
