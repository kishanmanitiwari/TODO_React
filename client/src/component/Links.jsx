import React from "react";

export default function Link({ address, name }) {
  return (
    <Link to={address} className="text-blue-500 hover:underline">
      {name}
    </Link>
  );
}
