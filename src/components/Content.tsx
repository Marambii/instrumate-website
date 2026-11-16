import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";

import type { Chapter } from "../types/lms";
import lmsService, {
  type Word,
} from "../services/lmsService";

interface ContentProps {
  chapter: Chapter | null;
  onMarkComplete?: (chapterId: number) => void;
  onSignAttempt?: (
    chapterId: number,
    word: string,
    video: Blob
  ) => Promise<void> | void;
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://127.0.0.1:8000";

export const Content: React.FC<ContentProps> = ({
  chapter,
  onMarkComplete,
  onSignAttempt,
}) => {
  const [markdownContent, setMarkdownContent] =
    useState("");

  const [words, setWords] = useState<Word[]>([]);

  const [selectedWord, setSelectedWord] =
    useState<Word | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  const [isRecording, setIsRecording] =
    useState(false);

  const [recordedVideo, setRecordedVideo] =
    useState<Blob | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const practiceRef =
    useRef<HTMLDivElement | null>(null);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const mediaStreamRef =
    useRef<MediaStream | null>(null);

  const recordedChunksRef =
    useRef<Blob[]>([]);

  const isMarkdown =
    chapter?.content_filepath
      ?.toLowerCase()
      .endsWith(".md") ?? false;

  const isCsv =
    chapter?.content_filepath
      ?.toLowerCase()
      .endsWith(".csv") ?? false;

  /*
   * Load chapter content
   */
  useEffect(() => {
    if (!chapter) {
      setMarkdownContent("");
      setWords([]);
      setSelectedWord(null);
      return;
    }

    const loadContent = async () => {
      setLoading(true);
      setError("");

      setMarkdownContent("");
      setWords([]);
      setSelectedWord(null);

      try {
        if (isMarkdown) {
          const contentUrl =
            `${BACKEND_URL}/media/${chapter.content_filepath}`;

          const response =
            await fetch(contentUrl);

          if (!response.ok) {
            throw new Error(
              `Unable to load chapter content (${response.status})`
            );
          }

          const content =
            await response.text();

          setMarkdownContent(content);
        } else if (isCsv) {
          const response =
            await lmsService.getWords(chapter.id);

          setWords(response.words || []);
        } else {
          setError(
            "This chapter uses an unsupported content format."
          );
        }
      } catch (err) {
        console.error(
          "Failed to load chapter content:",
          err
        );

        setError(
          "We couldn't load this lesson. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [chapter, isMarkdown, isCsv]);

  /*
   * Clean up camera when component is removed
   */
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /*
   * Attach camera stream to video element
   */
  useEffect(() => {
    if (
      cameraOpen &&
      videoRef.current &&
      mediaStreamRef.current
    ) {
      videoRef.current.srcObject =
        mediaStreamRef.current;
    }
  }, [cameraOpen]);

  /*
   * Open camera
   */
  const openCamera = async () => {
    setCameraError("");
    setRecordedVideo(null);

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

      mediaStreamRef.current = stream;

      setCameraOpen(true);
    } catch (err) {
      console.error(
        "Unable to access camera:",
        err
      );

      setCameraError(
        "We couldn't access your camera. Please allow camera permission and try again."
      );
    }
  };

  /*
   * Stop camera
   */
  const stopCamera = () => {
    if (mediaRecorderRef.current) {
      if (
        mediaRecorderRef.current.state !==
        "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      mediaRecorderRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      mediaStreamRef.current = null;
    }

    setIsRecording(false);
  };

  /*
   * Close camera modal
   */
  const closeCamera = () => {
    stopCamera();

    setCameraOpen(false);
    setRecordedVideo(null);
    setCameraError("");
  };

  /*
   * Start recording
   */
  const startRecording = () => {
    const stream =
      mediaStreamRef.current;

    if (!stream) {
      return;
    }

    recordedChunksRef.current = [];

    try {
      const recorder =
        new MediaRecorder(stream);

      mediaRecorderRef.current =
        recorder;

      recorder.ondataavailable = (
        event
      ) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(
          recordedChunksRef.current,
          {
            type: "video/webm",
          }
        );

        setRecordedVideo(blob);
      };

      recorder.start();

      setIsRecording(true);
    } catch (err) {
      console.error(
        "Unable to start recording:",
        err
      );

      setCameraError(
        "Your browser could not start video recording."
      );
    }
  };

  /*
   * Stop recording
   */
  const stopRecording = () => {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    if (
      recorder.state !== "inactive"
    ) {
      recorder.stop();
    }

    setIsRecording(false);
  };

  /*
   * Submit recorded signing attempt
   */
  const submitAttempt = async () => {
    if (
      !recordedVideo ||
      !selectedWord ||
      !chapter
    ) {
      return;
    }

    const word =
      getWordDisplayValue(selectedWord);

    try {
      setSubmitting(true);

      if (onSignAttempt) {
        await onSignAttempt(
          chapter.id,
          word,
          recordedVideo
        );
      } else {
        /*
         * The backend endpoint will be connected here.
         *
         * For now the recording exists as a Blob
         * and is ready to be sent through FormData.
         */
        console.log(
          "Sign attempt ready:",
          {
            chapterId: chapter.id,
            word,
            videoSize:
              recordedVideo.size,
          }
        );
      }
    } catch (err) {
      console.error(
        "Failed to submit sign attempt:",
        err
      );

      setCameraError(
        "We couldn't submit your signing attempt. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Get word displayed to the student
   */
  const getWordDisplayValue = (
    word: Word
  ): string => {
    const value =
      Object.values(word).find(
        (item) =>
          typeof item === "string"
      );

    return value
      ? String(value)
      : "Selected word";
  };

  /*
   * Select a word and automatically
   * scroll to the practice section
   */
  const handleWordSelect = (
    word: Word
  ) => {
    setSelectedWord(word);
    setRecordedVideo(null);

    setTimeout(() => {
      practiceRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  /*
   * No chapter selected
   */
  if (!chapter) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-400">
          Select a lesson from the curriculum
          sidebar to start learning.
        </p>
      </div>
    );
  }

  const isCompleted =
    chapter.completed === true ||
    chapter.completed === "true";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">

      {/* Chapter heading */}

      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-3xl font-bold text-gray-900">
          {chapter.title}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {chapter.is_signable
            ? "KSL vocabulary lesson"
            : "Learning lesson"}
        </p>
      </div>

      {/* Loading */}

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <p className="text-gray-500">
            Loading lesson...
          </p>
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Markdown lesson */}

      {!loading &&
        !error &&
        isMarkdown &&
        markdownContent && (
          <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

            <div className="max-w-none">

              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h2 className="mb-5 mt-1 text-2xl font-bold text-gray-900">
                      {children}
                    </h2>
                  ),

                  h2: ({ children }) => (
                    <h2 className="mb-4 mt-8 text-xl font-bold text-gray-900">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">
                      {children}
                    </h3>
                  ),

                  p: ({ children }) => (
                    <p className="mb-5 text-base leading-8 text-gray-700">
                      {children}
                    </p>
                  ),

                  ul: ({ children }) => (
                    <ul className="mb-5 list-disc space-y-2 pl-6 text-gray-700">
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol className="mb-5 list-decimal space-y-2 pl-6 text-gray-700">
                      {children}
                    </ol>
                  ),

                  li: ({ children }) => (
                    <li className="leading-7">
                      {children}
                    </li>
                  ),

                  blockquote: ({ children }) => (
                    <blockquote className="my-6 border-l-4 border-indigo-400 bg-indigo-50 py-3 pl-4 italic text-gray-700">
                      {children}
                    </blockquote>
                  ),

                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),

                  em: ({ children }) => (
                    <em>{children}</em>
                  ),

                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline hover:text-indigo-800"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {markdownContent}
              </ReactMarkdown>

            </div>
          </article>
        )}

      {/* CSV vocabulary */}

      {!loading &&
        !error &&
        isCsv && (
          <div className="space-y-5">

            {/* Introduction */}

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
              <h2 className="font-semibold text-indigo-900">
                Practice KSL Vocabulary
              </h2>

              <p className="mt-1 text-sm text-indigo-700">
                Select a word to practice its sign.
              </p>
            </div>

            {/* Word grid */}

            {words.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                {words.map(
                  (word, index) => {
                    const displayValue =
                      getWordDisplayValue(
                        word
                      );

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          handleWordSelect(
                            word
                          )
                        }
                        className={`rounded-xl border bg-white p-5 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md ${
                          selectedWord ===
                          word
                            ? "border-indigo-500 ring-2 ring-indigo-100"
                            : "border-gray-200"
                        }`}
                      >
                        <p className="font-semibold text-gray-900">
                          {displayValue}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          Click to practice
                        </p>
                      </button>
                    );
                  }
                )}

              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-500">
                  No vocabulary words were found for this lesson.
                </p>
              </div>
            )}

            {/* Practice / Avatar section */}

            {selectedWord && (
              <div
                ref={practiceRef}
                className="scroll-mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Practice this sign
                    </h2>

                    <p className="mt-1 text-gray-500">
                      {getWordDisplayValue(
                        selectedWord
                      )}
                    </p>
                  </div>

                  <button
                    onClick={openCamera}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Try Yourself
                  </button>
                </div>

                {/* Avatar area */}

                <div className="mt-5 flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-gray-50">

                  <p className="text-lg font-semibold text-gray-800">
                    {getWordDisplayValue(
                      selectedWord
                    )}
                  </p>

                  <p className="mt-4 text-sm text-gray-400">
                    Avatar signing animation
                    will appear here.
                  </p>

                </div>

                {recordedVideo && (
                  <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-800">
                      Your signing attempt has
                      been recorded.
                    </p>

                    <button
                      onClick={
                        submitAttempt
                      }
                      disabled={submitting}
                      className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {submitting
                        ? "Submitting..."
                        : "Submit Attempt"}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      {/* Mark as complete */}

      {onMarkComplete && (
        <div className="pt-1">
          <button
            onClick={() =>
              onMarkComplete(
                chapter.id
              )
            }
            disabled={isCompleted}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium ${
              isCompleted
                ? "cursor-default bg-emerald-100 text-emerald-800"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isCompleted
              ? "Completed ✓"
              : "Mark as Complete"}
          </button>
        </div>
      )}

      {/* Camera modal */}

      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Try Yourself
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Sign:
                  {" "}
                  {selectedWord
                    ? getWordDisplayValue(
                        selectedWord
                      )
                    : ""}
                </p>
              </div>

              <button
                onClick={closeCamera}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Camera */}

            <div className="mt-5 overflow-hidden rounded-xl bg-black">

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="aspect-video w-full object-cover"
              />

            </div>

            {/* Camera error */}

            {cameraError && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {cameraError}
              </div>
            )}

            {/* Controls */}

            <div className="mt-5 flex justify-center gap-3">

              {!isRecording && !recordedVideo && (
                <button
                  onClick={
                    startRecording
                  }
                  className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
                >
                  Start Recording
                </button>
              )}

              {isRecording && (
                <button
                  onClick={
                    stopRecording
                  }
                  className="rounded-lg bg-gray-800 px-6 py-3 font-medium text-white hover:bg-gray-900"
                >
                  Stop Recording
                </button>
              )}

              {recordedVideo && (
                <>
                  <button
                    onClick={() => {
                      setRecordedVideo(
                        null
                      );
                      startRecording();
                    }}
                    className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
                  >
                    Record Again
                  </button>

                  <button
                    onClick={() => {
                      closeCamera();
                    }}
                    className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Done
                  </button>
                </>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};