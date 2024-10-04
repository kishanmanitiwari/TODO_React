import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

//Instance
const app = express();

//Middlware
app.use(bodyParser.urlencoded({ extended: true }));
// Use cookie-parser middleware
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

//Routes

app.get("/", (req, res) => {
  //Setting a cookie
  res.cookie("UserData", "Mohini Kale", { maxAge: 10000, httpOnly: true });
  res.cookie("remberMe", "Coding Savvy");
  res.send("Cookie has been set");
});

// Reading a cookie
app.get("/get-cookie", (req, res) => {
  let user = req.cookies?.UserData;
  let remberMe = req.cookies?.remberMe;

  res.send(`Cookie Retrieved: ${user} , ${remberMe}`);
});

//Server
app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
