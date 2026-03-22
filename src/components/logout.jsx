import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => logout({ returnTo: window.location.origin })}
      className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
    >
      register
    </button>
  );
};

export default LogoutButton; // Correct export
