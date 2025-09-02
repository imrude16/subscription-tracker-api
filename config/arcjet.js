import arcjet, { detectBot, tokenBucket, shield } from "@arcjet/node";

import { ARCJET_KEY } from "../config/env.js";

const aj = arcjet({
    key: ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // Shield protects your app from common attacks e.g. SQL injection
        shield({ mode: "LIVE" }),
        // Create a bot detection rule
        detectBot({
            mode: "LIVE", 
            // Blocks requests. Use "DRY_RUN" to log only
            // Block all bots except the following
            allow: ["CATEGORY:SEARCH_ENGINE"], 
            // Google, Bing, etc
            //"CATEGORY:MONITOR", // Uptime monitoring services
            //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
            
        }),
        // Create a token bucket rate limit. Other algorithms are supported.
        tokenBucket({
            mode: "LIVE",
            // Tracked by IP address by default , but this can be customized
            refillRate: 5, // Refill 5 tokens per interval
            interval: 10, // Refill every 10 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),
    ],
});

export default aj;