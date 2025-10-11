import React from "react";

const LearningPage: React.FC = () => {
  const handleLevelSelect = (level: string) => {
    alert(`You selected ${level} level!`);
    // TODO: Navigate to level-specific content
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-['Lexend'] flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Learning Hub</h1>
      <p className="text-gray-600 text-center mb-8">
        Choose your level to access learning content
      </p>

      {/* Levels Column */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        {/* Beginner */}
        <button
          onClick={() => handleLevelSelect("Beginner")}
          className="bg-green-500 text-white px-12 py-8 rounded-2xl shadow-md hover:bg-green-600 transition flex flex-col items-center justify-center w-full"
        >
          <span className="text-4xl mb-3">🌱</span>
          <span className="text-xl font-semibold">Beginner</span>
        </button>

        {/* Intermediate */}
        <button
          onClick={() => handleLevelSelect("Intermediate")}
          className="bg-yellow-500 text-white px-12 py-8 rounded-2xl shadow-md hover:bg-yellow-600 transition flex flex-col items-center justify-center w-full"
        >
          <span className="text-4xl mb-3">📘</span>
          <span className="text-xl font-semibold">Intermediate</span>
        </button>

        {/* Advanced */}
        <button
          onClick={() => handleLevelSelect("Advanced")}
          className="bg-blue-500 text-white px-12 py-8 rounded-2xl shadow-md hover:bg-blue-600 transition flex flex-col items-center justify-center w-full"
        >
          <span className="text-4xl mb-3">🚀</span>
          <span className="text-xl font-semibold">Advanced</span>
        </button>
      </div>
    </div>
  );
};

export default LearningPage;
