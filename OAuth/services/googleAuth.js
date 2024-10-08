import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from "dotenv";
dotenv.config();


// Configure Passport to use Google Strategy
const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
};

const verify = (accessToken, refreshToken, profile, done) => {
  // In a real-world app, you would save the user data to the database here.
  // This example simply returns the profile data.
  return done(null, profile);
};

// Initialize Google OAuth strategy
passport.use(new GoogleStrategy(googleConfig, verify));

// Serialize and deserialize user`
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;
