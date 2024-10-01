import React, { useState } from "react";
import Input from "../component/Input";
import SubmitBtn from "../component/SubmitBtn";
import { API_LINK } from "../utils";
import axios from "axios";
import { Hourglass } from "react-loader-spinner"; // Ensure this is the correct import for your loader
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify
import useStore from "../store/UserStore.jsx";


export default function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const {isLoading,setIsLoading} = useStore();

  async function handleClick() {
    setIsLoading(true);
    const { name: userName, email: userId, password: userPass } = user;

    try {
      const response = await axios.post(API_LINK + "/api/auth/register", {
        userName,
        userId,
        userPass,
      });
      console.log(response.data);
  
      // Show success toast
      toast.success("User registered successfully!"); // Toast notification
    } catch (error) {
      console.error(error);
      // Show error toast
      toast.error("Registration failed. Please try again."); // Toast notification for error
    } finally {
      setIsLoading(false);
      setUser({
        name: "",
        email: "",
        password: "",
      });
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            <h2 className="text-2xl font-semibold text-center mb-6">
              Register
            </h2>

            <p className="text-center text-gray-700 mb-4 font-semibold">
              Hello {user.name}
            </p>

            <label htmlFor="userName" className="block text-gray-700 mb-2">
              Name:
              <Input
                placeholder="Enter your name"
                type="text"
                value={user.name}
                onChange={handleChange}
                name="name"
              />
            </label>

            <label htmlFor="userEmail" className="block text-gray-700 mb-2">
              Email:
              <Input
                placeholder="Enter your email"
                type="email"
                value={user.email}
                onChange={handleChange}
                name="email"
              />
            </label>

            <label htmlFor="userPass" className="block text-gray-700 mb-4">
              Password:
              <Input
                placeholder="Enter your password"
                type="password"
                onChange={handleChange}
                value={user.password}
                name="password"
              />
            </label>

            <SubmitBtn value="Register" onClick={handleClick} />
          </div>
        </div>
      )}
    </>
  );
}
