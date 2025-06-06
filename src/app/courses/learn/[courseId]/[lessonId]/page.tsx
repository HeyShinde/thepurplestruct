import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { FaPlay, FaLock, FaCheck, FaClock } from 'react-icons/fa'

interface Lesson {
  _id: string
  title: string
  content: any
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

const query = groq`
  *[_type == "course" && _id == $courseId][0]{
    ...,
    sections[]->{
      ...,
      lessons[]-> {
        _id,
        title,
        order,
        content,
        videoUrl,
        duration
      }
    }
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

export default async function LessonPage(props: { params: { courseId: string; lessonId: string } }) {
  const params = await props.params;
  const course = await client.fetch<Course>(query, { courseId: params.courseId });

  if (!course) {
    return <div>Course not found</div>
  }

  // Find the current lesson
  const currentLesson = course.sections
    ?.flatMap(section => section.lessons)
    .find(lesson => lesson._id === params.lessonId);

  if (!currentLesson) {
    return <div>Lesson not found</div>
  }

  // Sort sections by order
  const sortedSections = course.sections?.sort((a, b) => a.order - b.order) || []

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-96 bg-black/40 backdrop-blur-sm border-r border-purple-400/20 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src={course.imageUrl}
                alt={course.title}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{course.title}</h2>
              <p className="text-sm text-purple-400">Course Progress: 0%</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {sortedSections.map((section) => {
              // Sort lessons by order
              const sortedLessons = section.lessons?.sort((a, b) => a.order - b.order) || []
              
              return (
                <div key={section._id} className="space-y-2">
                  <h3 className="font-semibold text-purple-400 text-sm uppercase tracking-wider">{section.title}</h3>
                  <ul className="space-y-1">
                    {sortedLessons.map((lesson) => (
                      <li key={`${section._id}-${lesson._id}`}>
                        <Link
                          href={`/courses/learn/${course._id}/${lesson._id}`}
                          className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                            lesson._id === currentLesson._id
                              ? 'bg-purple-400/20 text-purple-400 border border-purple-400/40'
                              : 'text-gray-300 hover:bg-purple-400/10 hover:text-purple-400'
                          }`}
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            {lesson._id === currentLesson._id ? (
                              <FaPlay className="w-3 h-3" />
                            ) : (
                              <FaCheck className="w-3 h-3" />
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
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-black to-purple-950/20">
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
        </div>
      </div>
    </div>
  )
} 