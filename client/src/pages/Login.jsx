import React, { useState } from "react";
import Input from "../component/Input";
import SubmitBtn from "../component/SubmitBtn";
import { API_LINK } from "../utils";
import axios from "axios";
import { Hourglass } from "react-loader-spinner"; // Ensure this is the correct import for your loader
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify
import { useNavigate } from "react-router-dom"; // If using React Router for navigation

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userId: "",
    userPass: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLoginBtn(event) {
    // userId, userPass
    setIsLoading(true);
    const { userId, userPass } = user;

    try {
      const response = await axios.post(API_LINK + "/api/auth/login", {
        userId,
        userPass,
      });
      console.log(response.data);
      localStorage.setItem("userId", response.data.userId);

      // Show success toast
      toast.success("User Login successfully!"); // Toast notification
      // Navigate to dashboard after successful login
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error.message);
      // Show error toast
      toast.error("Login failed. Please try again."); // Toast notification for error
    } finally {
      setIsLoading(false);
      setUser({
        userId: "",
        userPass: "",
      });
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
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

            <label htmlFor="userEmail" className="block text-gray-700 mb-2">
              Email:
              <Input
                placeholder="Enter your email"
                type="email"
                value={user.userId}
                onChange={handleChange}
                name="userId"
              />
            </label>

            <label htmlFor="userPass" className="block text-gray-700 mb-4">
              Password:
              <Input
                placeholder="Enter your password"
                type="password"
                value={user.userPass}
                onChange={handleChange}
                name="userPass"
              />
            </label>

            <SubmitBtn value="Log In" onClick={handleLoginBtn} />
          </div>
        </div>
      )}
    </>
  );
}
