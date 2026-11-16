import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import type { Course, Chapter, Module } from "../../types/lms";

import { lmsService } from "../../services/lmsService";
import { Modules } from "../../components/Modules";
import { Content } from "../../components/Content";

export const Classroom: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      return;
    }

    const loadClassroom = async () => {
      try {
        setLoading(true);

        const id = Number(courseId);

        // Get course
        const courseData = await lmsService.getCourseDetail(id);

        // Get modules belonging to this course
        const modules = await lmsService.getModules(id);

        // Get chapters for each module
        const modulesWithChapters = await Promise.all(
          modules.map(async (module: Module) => {
            const chapters = await lmsService.getChapters(module.id);

            return {
              ...module,
              chapters,
            };
          })
        );

        const completeCourse: Course = {
          ...courseData,
          modules: modulesWithChapters,
        };

        setCourse(completeCourse);

        // Select the first chapter automatically
        if (modulesWithChapters[0]?.chapters?.[0]) {
          setActiveChapter(modulesWithChapters[0].chapters[0]);
        }
      } catch (error) {
        console.error("Failed to load classroom:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClassroom();
  }, [courseId]);

  const handleMarkComplete = async (chapterId: number) => {
    if (!courseId || !activeChapter || !course) {
      return;
    }

    try {
      const currentModule = course.modules?.find(
        (module: Module) =>
          module.chapters?.some(
            (chapter: Chapter) => chapter.id === chapterId
          )
      );

      if (!currentModule) {
        return;
      }

      await lmsService.updateCourseProgress(
        Number(courseId),
        currentModule.id,
        chapterId
      );

      setActiveChapter((prev) =>
        prev
          ? {
              ...prev,
              completed: true,
            }
          : null
      );
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        Loading classroom...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center text-red-500">
        Course not found.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Top Bar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5">
        <Link
          to="/courses"
          className="text-sm font-medium text-gray-500 hover:text-indigo-600"
        >
          ← Back to Courses
        </Link>

        <span className="truncate text-sm font-semibold text-gray-800">
          {course.title}
        </span>
      </div>

      {/* Main Classroom Area */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Curriculum Sidebar */}
        <aside className="w-80 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
            Course Curriculum
          </h2>

          <Modules
            modules={course.modules}
            activeChapterId={activeChapter?.id ?? null}
            onSelectChapter={(chapter) => {
              setActiveChapter(chapter);
            }}
          />
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 overflow-y-auto bg-gray-50 px-5 py-4 md:px-6 md:py-5">
          <Content
            chapter={activeChapter}
            onMarkComplete={handleMarkComplete}
          />
        </main>
      </div>
    </div>
  );
};