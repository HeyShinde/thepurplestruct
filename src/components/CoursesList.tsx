import Link from 'next/link'
import { CourseCard } from './CourseCard';

interface Course {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  price: number;
  imageUrl: string;
  lessons: number;
}

interface CoursesListProps {
  courses: Course[];
  displayLimit?: number;
  showTitle?: boolean;
  isHomePage?: boolean;
}

export function CoursesList({ courses, displayLimit, showTitle = true, isHomePage = false }: CoursesListProps) {
    const displayedCourses = displayLimit ? courses.slice(0, displayLimit) : courses;
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
        backgroundImage: `url('/themes/projects-background.svg')`,
        backgroundSize: '220px 220px'
      }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {showTitle && (
                    <div
            className="text-center mb-16"
          >
                        {isHomePage ? (
                          <h2 className="font-heading text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                            Courses
                          </h2>
                        ) : (
                          <h1 className="font-heading text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                            Courses
                          </h1>
                        )}
                    </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedCourses.map((course) => (
                        <CourseCard course={course} key={course._id} />
                    ))}
          {/* "View All Courses" button */}
          {displayLimit !== undefined && courses.length > displayLimit && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center">
              <div className="w-full h-full rounded-xl relative group flex items-center justify-center">
                <Link
                  href="/courses"
                  className="w-[260px] h-[70px] flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/60 via-purple-400/40 to-blue-500/40 backdrop-blur-md border-4 border-transparent [background-clip:padding-box] relative shadow-2xl group"
                  style={{
                    boxShadow: '0 4px 32px 0 rgba(168,85,247,0.25), 0 1.5px 0 0 #fff inset',
                  }}
                >
                                    <span className="font-heading text-white font-bold text-lg drop-shadow-lg tracking-wide pr-2">
                    View All Courses
                  </span>
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1 text-purple-200 group-hover:text-white transition-colors duration-200">
                                        <path d="M7 14h14M15 10l6 4-6 4" />
                  </svg>
                  <span className="absolute inset-0 rounded-2xl pointer-events-none border-4 border-transparent group-hover:border-purple-400 group-hover:shadow-[0_0_24px_4px_rgba(168,85,247,0.5)] transition-all duration-200" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 