import React, { useState } from "react";
import api from "../api/axios"; // Import our config

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Needed for Signup
  const [password, setPassword] = useState("");
  const [isTeacher, setIsTeacher] = useState(false); // Needed for Signup role logic

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (authMode === "login") {
        // Handshake: Sending credentials for Login
        const response = await api.post("login/", {
          username,
          password,
        });
        console.log("Login Success:", response.data);
        alert("Logged in successfully!");
        // window.location.href = "/dashboard"; // Redirect after login
        
      } else if (authMode === "signup") {
        // Handshake: Sending data for Registration
        const response = await api.post("register/", {
          username,
          email,
          password,
          is_student: !isTeacher, // Logic: if not teacher, then student
          is_teacher: isTeacher,
        });
        console.log("Signup Success:", response.data);
        alert("Account created! Now please log in.");
        setAuthMode("login"); // Switch to login mode
      }
    } catch (error: any) {
      // If Django throws an error (like "One must be a student or teacher")
      if (error.response && error.response.status === 400) {
    // This catches the "Username already exists" error from Django
    const serverErrors = error.response.data;
    alert(JSON.stringify(serverErrors)); 
  } else {
    console.error("Auth Error:", error);
    alert("An unexpected error occurred.");
  }}
};

  const closeForm = () => {
    setAuthMode(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setIsTeacher(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 font-['Lexend'] p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome to Instrumate</h1>

      <div className="flex gap-4 mb-6">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-full" onClick={() => setAuthMode("login")}>Log In</button>
        <button className="px-6 py-2 bg-green-500 text-white rounded-full" onClick={() => setAuthMode("signup")}>Sign Up</button>
      </div>

      {authMode && (
        <form onSubmit={handleAuthSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 capitalize">{authMode}</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>

          {/* Email field only shows during Signup */}
          {authMode === "signup" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>

          {/* Role selection only shows during Signup */}
          {authMode === "signup" && (
            <div className="mb-4 flex items-center gap-2">
              <input type="checkbox" checked={isTeacher} onChange={(e) => setIsTeacher(e.target.checked)} id="teacher-check" />
              <label htmlFor="teacher-check" className="text-sm">I am a Teacher</label>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {authMode === "login" ? "Log In" : "Sign Up"}
            </button>
            <button type="button" onClick={closeForm} className="text-sm text-gray-500">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AuthPage;