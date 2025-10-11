import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#e6edf4] px-10 py-10 bg-[#f0f6fa] text-[#4574a1]">
      {/* Main content in 3 columns */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-[#4574a1] text-center md:text-left">
        {/* Built for Kenya */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <h4 className="flex items-center font-semibold text-lg">
            <span className="text-[#4574a1] mr-2">💙</span> Built for Kenya
          </h4>
          <p className="leading-relaxed max-w-sm">
            Instrumate is designed to support inclusive education and
            communication for deaf learners in Kenya through AI-powered Kenyan
            Sign Language tools.
          </p>
        </div>

        {/* Quick Links - Centered */}
        <div className="flex flex-col items-center gap-2">
          <h4 className="font-semibold text-lg">Quick Links</h4>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <span>📧</span> <a href="#">Contact Team</a>
            </li>
            <li className="flex items-center gap-2">
              <span>⚠️</span> <a href="#">Report Bug</a>
            </li>
            <li className="flex items-center gap-2">
              <span>🛡️</span> <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div className="flex flex-col items-center md:items-center gap-2">
          <h4 className="font-semibold text-lg">Connect With Us</h4>
          <div className="flex gap-4 text-2xl">
            <a href="#" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-sm text-[#4574a1]">
        © 2025 Instrumate. Made with <span className="text-red-500">❤️</span>{" "}
        for inclusive education in Kenya.
      </div>
    </footer>
  );
};

export default Footer;
