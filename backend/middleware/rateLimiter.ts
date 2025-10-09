import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    message: { error: "Too many requests, please try again later." },
});

export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 5, 
    message: { error: "Too many login attempts. Please try again later." },
});
