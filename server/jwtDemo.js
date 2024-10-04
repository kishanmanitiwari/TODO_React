import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

//Instance
const app = express();

// Secret key for JWT
const SECRET_KEY = "mysecretkey";

//Middlware

app.use(bodyParser.urlencoded({ extended: true }));
// Use cookie-parser middleware
app.use(cookieParser());

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(403).send("Token is required");

  try {
    jwt.verify(token, SECRET_KEY);
    console.log(res);
    next();
  } catch (error) {
    console.log(error.message);

    throw error;
  }
};

const PORT = process.env.PORT || 3000;

//Routes

app.get("/login", (req, res) => {
  //JWT TOken
  const user = { id: 1, username: "wicked_sunny" }; // Simulated user data
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
  res.cookie("jwt", token, { httpOnly: true });
  res.send("Token sent sucessfully");
});

app.get("/dashboard", verifyToken, (req, res) => {
  res.send("Dashboard page");
});

//Server
app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
