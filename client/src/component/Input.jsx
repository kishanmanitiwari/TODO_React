import React from "react";

export default function Input(props) {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={props.value}
      onChange={props.onChange}
      name={props.name}
    />
  );
}
