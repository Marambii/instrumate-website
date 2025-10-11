import React from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageWrapper>
        <div className="p-6">
          {/* Hero Section */}
          <main className="relative flex min-h-screen flex-col bg-slate-50 overflow-x-hidden font-['Lexend','Noto_Sans',sans-serif]">
            <div
              className="flex flex-col items-center justify-center 
                 w-full max-w-5xl min-h-[480px] 
                 bg-cover bg-center
                 gap-6 p-8 text-white text-center 
                 rounded-xl shadow-lg mx-auto"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url(/8687238.jpg)`,
              }}
            >
              <h1 className="text-4xl font-black tracking-[-0.033em] max-w-3xl">
                Welcome to Instrumate: Redefining Learning for All Abilities
              </h1>

              <div className="flex gap-3 flex-wrap justify-center">
                <button
                  className="h-10 px-4 rounded-full bg-[#359dff] font-bold text-sm text-[#0c151d]"
                  onClick={() => navigate("/sign-detection")}
                >
                  Use Webcam to Sign
                </button>
                <button
                  className="h-10 px-4 rounded-full bg-[#e6edf4] font-bold text-sm text-[#0c151d]"
                  onClick={() => navigate("/translation")}
                >
                  Enter Text to See in Sign
                </button>
              </div>
            </div>

            {/* Intro Text */}
            <p className="text-[#0c151d] text-base text-center px-4 pt-6 max-w-4xl mx-auto">
              Instrumate is an innovative platform designed to bridge
              communication gaps for deaf learners in Kenya. Leveraging AI and
              sign language, we offer tools for both sign-to-text and
              text-to-sign interactions, fostering inclusive learning
              experiences.
            </p>
          </main>
        </div>
      </PageWrapper>
    </>
  );
};

export default Home;
