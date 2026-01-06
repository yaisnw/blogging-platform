import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100,
    message: { error: "Too many requests, please try again later." },
    skip: (req) => req.method === 'OPTIONS', 
});

export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    limit: 5, 
    message: { error: "Too many login attempts. Please try again later." },
    skip: (req) => req.method === 'OPTIONS', 
});