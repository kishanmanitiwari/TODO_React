import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Hello User</h1>
      <div className="space-x-4">
        <Link className="text-blue-500 hover:underline" to="/about">
          About
        </Link>
        <Link className="text-blue-500 hover:underline" to="/login">
          Login
        </Link>
        <Link className="text-blue-500 hover:underline" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}
