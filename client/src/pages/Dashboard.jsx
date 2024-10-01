import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../utils";
import useStore from "../store/UserStore";
import { useNavigate } from "react-router-dom";
import { Hourglass } from "react-loader-spinner"; // Ensure this is the correct import for your loader
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify

const TodoDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For toggling dropdown

  const {
    userId,
    setIsAuthenticated,
    userName,
    isLoading,
    setIsLoading,
    setUserName,
    setUserId,
  } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchTodo();
  }, []);

  async function fetchTodo() {
    setIsLoading(true);
    const token = `Bearer ${userId}`; // Construct the Bearer token

    try {
      const { data } = await axios.get(`${API_LINK}/api/todos`, {
        headers: {
          Authorization: token, // Set the Authorization header
        },
      });

      setIsAuthenticated(true);
      setTodos(data.todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      // Optionally handle the error (e.g., show a notification)
    } finally {
      setIsLoading(false);
    }
  }

  // Handle adding a new todo
  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        { id: Date.now(), content: newTodo, isEditing: false },
      ]);
      setNewTodo("");
    }
  };

  // Handle editing a todo
  const editTodo = (id, updatedTask) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, content: updatedTask, isEditing: false }
          : todo
      )
    );
  };

  // Handle deleting a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  function handleLogout() {
    try {
      setIsLoading(true);
      setIsAuthenticated(false);
      setUserName(null);
      setUserId(null);
      localStorage.clear();
      toast.success("User logged out successfully!"); // Toast notification
      setTimeout(() => {
        navigate("/");
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error(error.message);
      // Show error toast
      toast.error("Log-out failed. Please try again."); // Toast notification for error
    }
  }

  return (
    <>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
      {isLoading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <Hourglass
            visible={true}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            colors={["#306cce", "#72a1ed"]}
          />
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
          {/* Top-right user button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 flex items-center justify-center w-10 h-10"
            >
              {userName?.charAt(0).toUpperCase()} {/* Display first letter */}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white"
                >
                  Log-Out
                </button>
              </div>
            )}
          </div>

          {/* Todo dashboard content */}
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-4 text-center">
              Hello, {userName}
            </h1>

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
                  key={todo.t_id} // Make sure to use the correct key value
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
                            t.id === todo.id
                              ? { ...t, isEditing: !t.isEditing }
                              : t
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
      )}
    </>
  );
};

export default TodoDashboard;
