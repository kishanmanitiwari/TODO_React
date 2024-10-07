import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from './routes/auth.js';


//Instance
const app = express();
dotenv.config();

//Middleware

app.use(bodyParser.json());


// Routes
app.use('/auth', authRoutes);

// Error handling for unrecognized routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
