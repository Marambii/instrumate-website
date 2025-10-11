import React, { useRef, useState } from "react";
import PageWrapper from "../components/PageWrapper";

const SignDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null); // 🔧

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setMediaStream(stream); // 🔧 save stream to state
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop()); // 🔧 stop each track
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false); // 🔧 reset state
    setMediaStream(null); // 🔧 clear stream
  };

  const handleCameraToggle = () => {
    if (isStreaming) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  return (
    <PageWrapper>
      <div className="p-6">
        <div className="flex flex-col min-h-screen bg-slate-50 font-['Lexend','Noto_Sans',sans-serif]">
          <main className="flex justify-center py-5 px-6 flex-1 gap-4">
            <div className="flex flex-col max-w-[920px] w-full">
              <h2 className="text-[28px] font-bold px-4 pb-3 pt-5">
                Real-time Sign Language Translation
              </h2>

              <div className="p-4">
                <div className="aspect-video rounded-xl bg-black p-4 relative flex justify-center items-center">
                  <video
                    ref={videoRef}
                    className="rounded-xl w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  {!isStreaming && (
                    <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-xl">
                      <p>Camera is off</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center py-3">
                <button
                  className="h-10 px-4 bg-[#359dff] text-sm font-bold rounded-full"
                  onClick={handleCameraToggle}
                >
                  {isStreaming ? "Turn Camera Off" : "Start Sign Detection"}
                </button>
              </div>

              <p className="text-sm text-center text-[#4574a1]">
                Status: {isStreaming ? "Streaming..." : "Not started"}
              </p>
            </div>

            <aside className="w-[360px] flex flex-col">
              <h1 className="text-[22px] font-bold px-4 pt-5 pb-3">
                Translation
              </h1>
              <div className="flex items-end gap-3 p-4">
                <div
                  className="w-10 h-10 bg-cover rounded-full"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/placeholder-avatar.jpg')",
                  }}
                />
                <div className="flex flex-col gap-1">
                  <p className="text-[13px] text-[#4574a1]">AI Translator</p>
                  <p className="bg-[#e6edf4] text-[#0c151d] px-4 py-3 rounded-xl">
                    Hello, how can I help you today?
                  </p>
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SignDetection;
