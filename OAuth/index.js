import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import googleAuth from "./services/googleAuth.js"; // Import the Google OAuth service

const app = express();
dotenv.config();

const sessionConfig = {
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
};

// Setup session handling
app.use(session(sessionConfig));

// Initialize Passport
app.use(googleAuth.initialize());
app.use(googleAuth.session());

// Routes
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get(
  "/auth/google",
  googleAuth.authenticate("google", { scope: ["profile", "email"] }) //Middleware
);

app.get(
  "/auth/google/callback",
  googleAuth.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  // Send user info to dashboard page
  res.send(
    `<h1>Welcome ${req.user.displayName}</h1><a href="/logout">Logout</a>`
  );
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on <http://localhost:3000>");
});
