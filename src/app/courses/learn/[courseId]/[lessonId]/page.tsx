"use client"

import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { FaPlay, FaCheck, FaClock, FaSpinner, FaBars, FaTimes, FaHome } from 'react-icons/fa'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { TypedObject } from '@portabletext/types'

interface Lesson {
  _id: string
  title: string
  content: TypedObject | TypedObject[]
  videoUrl?: string
  duration?: number
  order: number
}

interface Section {
  _id: string
  title: string
  order: number
  lessons: Lesson[]
}

interface Course {
  _id: string
  title: string
  description: string
  imageUrl: string
  sections: Section[]
}

interface CourseData {
  course: Course | null;
  currentLesson: Lesson | null;
}

const courseQuery = groq`
  *[_type == "course" && _id == $courseId][0]{
    _id,
    title,
    imageUrl,
    "sections": sections[]->{
      _id,
      title,
      order,
      "lessons": lessons[]->{
        _id,
        title,
        order,
        duration
      }
    }
  }
`

const lessonQuery = groq`
  *[_type == "lesson" && _id == $lessonId][0]{
    _id,
    title,
    content,
    videoUrl,
    duration,
    order
  }
`

function getEmbedUrl(url: string) {
  if (!url) return '';
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&color=white&controls=1&iv_load_policy=3&disablekb=1`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  // Otherwise, return as-is (could be direct video file)
  return url;
}

export default function LessonPage() {
  const params = useParams() || {};
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  
  const [courseData, setCourseData] = useState<CourseData>({ course: null, currentLesson: null });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<Map<string, boolean>>(new Map());
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const fetchCourseData = useCallback(async () => {
    if (!courseId || !lessonId) return;
    const courseData = await client.fetch<Course>(courseQuery, { courseId });
    const lessonData = await client.fetch<Lesson>(lessonQuery, { lessonId });
    setCourseData({ course: courseData, currentLesson: lessonData });
  }, [courseId, lessonId]);

  const trackView = useCallback(async () => {
    if (!courseId || !lessonId) return;
    try {
      await axios.post('/api/course/progress/view', {
        courseId,
        lessonId,
      });
    } catch {
      // console.error('Failed to track lesson view');
    }
  }, [courseId, lessonId]);

  const fetchProgress = useCallback(async () => {
    if (!courseId || !lessonId) return;
    try {
      const { data } = await axios.get(`/api/course/progress?courseId=${courseId}`);
      const progressMap = new Map<string, boolean>(data.map((p: { lessonId: string, completed: boolean }) => [p.lessonId, p.completed]));
      setProgress(progressMap);
      setIsCompleted(progressMap.get(lessonId) || false);
    } catch {
      // console.error('Failed to fetch progress');
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    fetchCourseData();
    fetchProgress();
    trackView();
  }, [fetchCourseData, fetchProgress, trackView]);

  const handleCompleteToggle = async () => {
    setIsLoading(true);
    try {
      const newCompletedStatus = !isCompleted;
      await axios.post('/api/course/progress', {
        courseId,
        lessonId,
        completed: newCompletedStatus,
      });
      setIsCompleted(newCompletedStatus);
      setProgress(prev => {
        const newProgress = new Map<string, boolean>(prev);
        newProgress.set(lessonId, newCompletedStatus);
        return newProgress;
      });
      
      if (newCompletedStatus) {
        // Find next lesson and navigate
        const allSections = courseData.course?.sections || [];
        const allLessons = allSections.flatMap(s => s.lessons).sort((a,b) => a.order - b.order);
        const currentIndex = allLessons.findIndex(l => l._id === lessonId);
        if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
          const nextLesson = allLessons[currentIndex + 1];
          router.push(`/courses/learn/${courseId}/${nextLesson._id}`);
        }
      }
    } catch {
      // console.error('Failed to update progress');
    } finally {
      setIsLoading(false);
    }
  };

  if (!courseData.course || !courseData.currentLesson) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <FaSpinner className="animate-spin mr-3" /> Loading...
      </div>
    );
  }

  const { course, currentLesson } = courseData;

  // Sort sections by order
  const sortedSections = course.sections?.sort((a, b) => a.order - b.order) || []
  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const completedLessonsCount = Array.from(progress.values()).filter(Boolean).length;
  const courseProgressPercentage = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
          <div 
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
          ></div>
      )}
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 w-80 lg:w-96 bg-black border-r border-purple-400/20 flex flex-col transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex-shrink-0 border-b border-purple-400/10">
            <div className="flex justify-between items-center mb-4">
                <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                    <FaHome className="w-4 h-4" />
                    <span>Home</span>
                </Link>
                <button 
                    onClick={() => setSidebarOpen(false)} 
                    className="lg:hidden flex-shrink-0 p-1 text-gray-400 hover:text-white rounded-full hover:bg-purple-500/20"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
            </div>
            <h2 className="text-xl font-bold text-white">{course.title}</h2>
            <p className="text-sm text-purple-400 mt-2">Course Progress: {courseProgressPercentage}%</p>
        </div>
          
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {sortedSections.map((section) => {
              // Sort lessons by order
              const sortedLessons = section.lessons?.sort((a, b) => a.order - b.order) || []
              
              return (
                <div key={section._id} className="space-y-2">
                  <h3 className="font-semibold text-purple-400 text-sm uppercase tracking-wider">{section.title}</h3>
                  <ul className="space-y-1">
                    {sortedLessons.map((lesson) => {
                      const isLessonCompleted = progress.get(lesson._id) || false;
                      const isCurrent = lesson._id === currentLesson._id;

                      return (
                        <li key={`${section._id}-${lesson._id}`}>
                          <Link
                            href={`/courses/learn/${course._id}/${lesson._id}`}
                            className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                              isCurrent
                                ? 'bg-purple-400/20 text-purple-400 border border-purple-400/40'
                                : isLessonCompleted
                                ? 'text-green-400 hover:bg-green-400/10'
                                : 'text-gray-300 hover:bg-purple-400/10 hover:text-purple-400'
                            }`}
                          >
                            <div className="w-5 h-5 flex items-center justify-center">
                              {isLessonCompleted ? (
                                <FaCheck className="w-3 h-3 text-green-400" />
                              ) : (
                                <FaPlay className="w-3 h-3" />
                              )}
                            </div>
                            <span className="flex-1">{lesson.title}</span>
                            {lesson.duration && (
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <FaClock className="w-3 h-3" />
                                {lesson.duration} min
                              </span>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-black to-purple-950/20">
        <div className="lg:hidden sticky top-0 z-30 bg-black/50 backdrop-blur-sm flex items-center p-4 border-b border-purple-400/10">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
              <FaBars className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-white ml-4 truncate">{course.title}</h2>
        </div>
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-white">{currentLesson.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <FaClock className="w-4 h-4" />
                {currentLesson.duration} minutes
              </span>
              <span>•</span>
              <span>Lesson {currentLesson.order}</span>
            </div>
          </div>
          
          {/* Video Player */}
          {currentLesson.videoUrl && (
            <div className="aspect-video mb-8 rounded-xl overflow-hidden bg-black border border-purple-400/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              {currentLesson.videoUrl.match(/\.(mp4|webm|ogg)$/) ? (
                <video
                  src={currentLesson.videoUrl}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <iframe
                  src={getEmbedUrl(currentLesson.videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              )}
            </div>
          )}

          {/* Lesson Content */}
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-purple-400 prose-strong:text-purple-400 prose-code:text-purple-400 prose-code:bg-purple-400/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
            <PortableText value={currentLesson.content} />
          </div>

          <div className="mt-8">
            <button
              onClick={handleCompleteToggle}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:bg-gray-600"
            >
              {isLoading && <FaSpinner className="animate-spin" />}
              {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 