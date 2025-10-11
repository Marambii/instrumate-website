import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-between border-b border-[#e6edf4] px-10 py-3"
    >
      <div className="flex items-center gap-4 text-[#0c151d]">
        <div className="size-4">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0)">
              <path
                d="M8.578 8.578c-3.05 3.05-5.127 6.936-5.969 11.167C1.767 23.976 2.2 28.361 3.85 32.346c1.65 3.985 4.446 7.392 8.033 9.788 3.587 2.397 7.803 3.676 12.117 3.676s8.53-1.279 12.117-3.676c3.587-2.396 6.383-5.803 8.033-9.788 1.65-3.985 2.082-8.37 1.24-12.6-.842-4.23-2.919-8.117-5.97-11.167L24 24 8.578 8.578Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <h2 className="text-lg font-bold tracking-[-0.015em]">Instrumate</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <nav className="flex items-center gap-9 text-sm font-medium text-[#0c151d]">
          <Link to="/home">Home</Link>
          <Link to="/sign-detection">Sign Detection</Link>
          <Link to="/translation">Translation</Link>
          <Link to="/Learn">Learn</Link>
          <Link to="#">Community</Link>
        </nav>
        <div className="flex gap-2">
          <button
            className="h-10 px-4 rounded-full bg-[#359dff] font-bold text-sm"
            onClick={() => navigate("/")}
          >
            Sign Up
          </button>
          <button
            className="h-10 px-4 rounded-full bg-[#e6edf4] font-bold text-sm"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </div>
      </div>
    </motion.header>
  );
}
