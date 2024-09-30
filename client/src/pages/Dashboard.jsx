import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../utils";

const TodoDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(()=>{
    fetchTodo();
  },[])

  async function fetchTodo() {
    const userId = localStorage.getItem("userId");
    
    // Ensure userId is a string and not converted to a number
    const token = `Bearer ${userId}`; // Construct the Bearer token

    try {
        const { data } = await axios.get(`${API_LINK}/api/todos`, {
            headers: {
                Authorization: token // Set the Authorization header
            }
        });

        console.log(data);
        setTodos(data.todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        // Optionally handle the error (e.g., show a notification)
    }
}


  // Handle adding a new todo
  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), content: newTodo, isEditing: false }]);
      setNewTodo("");
    }
  };

  // Handle editing a todo
  const editTodo = (id, updatedTask) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, content: updatedTask, isEditing: false } : todo
      )
    );
  };

  // Handle deleting a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Todo Dashboard</h1>

        {/* New Todo Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add new todo"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.t_id}
              className="flex justify-between items-center p-3 bg-gray-100 rounded-md shadow-sm"
            >
              {todo.isEditing ? (
                <input
                  type="text"
                  className="flex-1 mr-3 p-2 border rounded-md"
                  defaultValue={todo.content}
                  onBlur={(e) => editTodo(todo.id, e.target.value)}
                />
              ) : (
                <span>{todo.content}</span>
              )}

              <div className="flex gap-2">
                {/* Edit Button */}
                <button
                  onClick={() =>
                    setTodos(
                      todos.map((t) =>
                        t.id === todo.id ? { ...t, isEditing: !t.isEditing } : t
                      )
                    )
                  }
                  className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                >
                  {todo.isEditing ? "Save" : "Edit"}
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoDashboard;
