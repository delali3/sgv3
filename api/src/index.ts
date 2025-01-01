import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import admin from "./routes/admin";
import general from "./routes/general";
import cors from 'cors';

// Import Supabase config
import { supabase } from "./db/db_config";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6001;

const startServer = async () => {
  try {
    // Middleware
    app.use(express.json());
    app.use(morgan("dev"));
    app.use(helmet({ 
      crossOriginResourcePolicy: { policy: "cross-origin" },
      // Add these to ensure CORS works with helmet
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }));
    app.use(cookieParser());

    // CORS Configuration
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://suggle-frontend.vercel.app',
      'https://sugglec-frontend.vercel.app/login',
      'https://suggle.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean); // Remove undefined values

    app.use(cors({
      origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
    }));

    // Session configuration
    app.use(
      session({
        secret: process.env.AUTH_SESSION_SECRET ?? "secret",
        resave: false,
        saveUninitialized: false,
        cookie: { 
          secure: process.env.NODE_ENV === 'production', // Only use secure in production
          httpOnly: true, 
          maxAge: 1000 * 60 * 60 * 24, // 24 hours
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
        }
      })
    );

    // Passport initialization
    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.use("/", general);
    app.use("/admin", admin);

    // Error handling middleware
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something broke!' });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer().catch(console.error);