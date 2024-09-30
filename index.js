import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

//Instance

const app = express();
dotenv.config();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

function setId(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  // Split the header to get the token
  const token = authHeader.split(" ")[1]; // This assumes the header is in the format "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  // Optionally, you can verify the token here if needed
  req.userId = Number(token); // You can set req.userId or another property as needed
  next();
}

//Routes

app.post("/api/auth/login", async (req, res) => {
  const { userId, userPass } = req.body;

  //Check - if the user exist and the check the password
  //User exist - password
  //User exxist

  try {
    const user = await prisma.users.findFirst({
      where: { email: userId },
    });

    if (user) {
      if (user.password === userPass) {
        return res.status(200).json({
          status: "Authenticated",
          userId: user.u_id,
          userName: user.name,
        });
      } else {
        return res.status(404).json({ status: "Invalid Password" });
      }
    } else {
      return res.status(404).json({ error: "No user exist, Please register" });
    }
  } catch (error) {}
});

app.post("/api/auth/register", async (req, res) => {
  const { userName, userId, userPass } = req.body;

  try {
    const newUser = await prisma.users.create({
      data: {
        name: userName,
        email: userId,
        password: userPass,
      },
    });
    return res.status(201).json({ user: newUser });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//Create a todo

app.post("/api/todo", async (req, res) => {
  const { content, userId } = req.body; // Assuming userId is sent in the request body

  try {
    const newTodo = await prisma.todo.create({
      data: {
        content: content,
        u_id: Number(userId), // Ensure that u_id refers to the correct user in your database schema
      },
    });

    return res.status(201).json({ todo: newTodo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Fetch all todos for the logged-in user
app.get("/api/todos",setId, async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: {
        u_id: req.userId, // Fetch todos for the authenticated user
      },
    });

    return res.status(200).json({ todos });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update a specific todo for the logged-in user
app.put("/api/todo/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { content, completed, userId } = req.body;

  try {
    // Find the todo to ensure it belongs to the logged-in user
    const todo = await prisma.todo.findUnique({
      where: {
        t_id: Number(todoId), // Use t_id for the where clause
      },
    });

    // Ensure that the userId is a number for comparison
    if (!todo || todo.u_id !== Number(userId)) {
      return res.status(403).json({ message: "Forbidden: Not your TODO" });
    }

    // Update the todo if it's owned by the logged-in user
    const updatedTodo = await prisma.todo.update({
      where: {
        t_id: Number(todoId), // Use t_id for the where clause
      },
      data: {
        content,
        completed: completed === "true" || completed === true, // Convert to boolean
      },
    });

    return res.status(200).json({ todo: updatedTodo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/api/todo/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { userId } = req.body; // userId from body (as per your original approach)

  try {
    // Find the todo to ensure it belongs to the logged-in user
    const todo = await prisma.todo.findUnique({
      where: {
        t_id: Number(todoId),
      },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Check if the logged-in user is the owner of the todo
    if (todo.u_id !== Number(userId)) {
      return res.status(403).json({ message: "Forbidden: Not your TODO" });
    }

    // Delete the todo if it's owned by the logged-in user
    await prisma.todo.delete({
      where: {
        t_id: Number(todoId),
      },
    });

    return res.status(204).json({ status: "User deleted sucessfully!" }); // No content to send back after successful deletion
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
