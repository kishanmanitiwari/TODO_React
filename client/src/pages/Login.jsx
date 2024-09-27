import React from "react";
import Input from "../component/Input";
import SubmitBtn from "../component/SubmitBtn";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <label htmlFor="userEmail" className="block text-gray-700 mb-2">
          Email:
          <Input placeholder="Enter your email" type="email" />
        </label>

        <label htmlFor="userPass" className="block text-gray-700 mb-4">
          Password:
          <Input placeholder="Enter your password" type="password" />
        </label>

        <SubmitBtn value="Log In" />
      </div>
    </div>
  );
}
