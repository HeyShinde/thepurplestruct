import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'
import { FaPlay, FaClock, FaBook, FaGraduationCap, FaCheck } from 'react-icons/fa'

interface Lesson {
  _id: string
  title: string
  order: number
  content?: any
  videoUrl?: string
  duration?: number
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
  imageUrl?: string
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

export default async function CourseLearningPage({ params }: { params: { courseId: string } }) {
  const resolvedParams = await params;
  const course = await client.fetch<Course>(query, { courseId: resolvedParams.courseId });

  if (!course) {
    return <div>Course not found</div>
  }

  console.log('DEBUG: course.sections', course.sections);
  course.sections?.forEach((section) => {
    console.log(`DEBUG: section ${section?._id} lessons`, section?.lessons);
  });

  // Sort and filter sections by order and valid _id
  const sortedSections = (course.sections || [])
    .filter(Boolean)
    .filter(section => section && section._id)
    .sort((a, b) => a.order - b.order)

  // Calculate total duration and lessons
  const totalDuration = sortedSections.reduce((acc, section) => {
    return acc + (section.lessons || []).reduce((lessonAcc, lesson) => {
      return lessonAcc + (lesson.duration || 0)
    }, 0)
  }, 0)

  const totalLessons = sortedSections.reduce((acc, section) => {
    return acc + (section.lessons || []).length
  }, 0)

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-96 bg-black/40 backdrop-blur-sm border-r border-purple-400/20 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">{course.title}</h2>
              <p className="text-sm text-purple-400">Course Overview</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {sortedSections.map((section) => {
              // Sort and filter lessons by order and valid _id
              const sortedLessons = (section.lessons || [])
                .filter(Boolean)
                .filter(lesson => lesson && lesson._id)
                .sort((a, b) => a.order - b.order)
              
              return (
                <div key={section._id} className="space-y-2">
                  <h3 className="font-semibold text-purple-400 text-sm uppercase tracking-wider">{section.title}</h3>
                  <ul className="space-y-1">
                    {sortedLessons.map((lesson) => (
                      <li key={`${section._id}-${lesson._id}`}>
                        <Link 
                          href={`/courses/learn/${course._id}/${lesson._id}`}
                          className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 text-gray-300 hover:bg-purple-400/10 hover:text-purple-400"
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <FaPlay className="w-3 h-3" />
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
            <h1 className="text-4xl font-bold mb-4 text-white">Welcome to {course.title}</h1>
            <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
              <span className="flex items-center gap-2">
                <FaBook className="w-4 h-4" />
                {totalLessons} Lessons
              </span>
              <span className="flex items-center gap-2">
                <FaClock className="w-4 h-4" />
                {totalDuration} minutes
              </span>
              <span className="flex items-center gap-2">
                <FaGraduationCap className="w-4 h-4" />
                {sortedSections.length} Sections
              </span>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">{course.description}</p>
          </div>
          
          {/* Course Overview Card */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-400/20 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">What you'll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedSections.map((section) => (
                <div key={section._id} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-400/20 flex items-center justify-center mt-1">
                    <FaCheck className="w-3 h-3 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">{section.title}</h3>
                    <p className="text-sm text-gray-400">
                      {section.lessons?.length || 0} lessons • {section.lessons?.reduce((acc, lesson) => acc + (lesson.duration || 0), 0)} minutes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Learning Card */}
          <div className="bg-gradient-to-r from-purple-400/10 to-purple-600/10 border border-purple-400/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to begin your learning journey?</h2>
            <p className="text-gray-300 mb-6">Select a lesson from the sidebar to start learning</p>
            {sortedSections[0]?.lessons?.[0] && (
              <Link
                href={`/courses/learn/${course._id}/${sortedSections[0].lessons[0]._id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors duration-200"
              >
                <FaPlay className="w-4 h-4" />
                Start First Lesson
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 