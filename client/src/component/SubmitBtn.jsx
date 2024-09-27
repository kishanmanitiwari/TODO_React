import React from "react";

export default function SubmitBtn(props) {
  return (
    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
