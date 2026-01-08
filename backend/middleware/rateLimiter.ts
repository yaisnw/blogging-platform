import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100,
    message: { error: "Too many requests, please try again later." },
    skip: (req) => req.method === 'OPTIONS', 
});

export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    limit: 10,
    message: { error: "Too many login attempts. Please try again later." },
    keyGenerator: (req) => {
        return req.headers['x-forwarded-for'] as string || req.ip || 'global';
    },
    skip: (req) => req.method === 'OPTIONS', 
});