import React, { useState } from "react";

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "login") {
      console.log("Logging in with:", { username, password });
      // TODO: Call your backend login API
    } else if (authMode === "signup") {
      console.log("Signing up with:", { username, password });
      // TODO: Call your backend signup API
    }
  };

  const closeForm = () => {
    setAuthMode(null);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 font-['Lexend'] p-4">
      
      <h1 className="text-2xl font-bold mb-6">Welcome to Instrumate</h1>


      {/* Auth Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-full"
          onClick={() => setAuthMode("login")}
        >
          Log In
        </button>
        <button
          className="px-6 py-2 bg-green-500 text-white rounded-full"
          onClick={() => setAuthMode("signup")}
        >
          Sign Up
        </button>
      </div>

      {/* Auth Form */}
      {authMode && (
        <form
          onSubmit={handleAuthSubmit}
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
        >
          <h2 className="text-xl font-bold mb-4 capitalize">{authMode}</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {authMode === "login" ? "Log In" : "Sign Up"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AuthPage;
