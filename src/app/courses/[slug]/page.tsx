"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import * as Collapsible from '@radix-ui/react-collapsible'
import { IoChevronDown } from 'react-icons/io5'
import { FaCheckCircle, FaClock, FaGlobe, FaMedal, FaTwitter, FaLinkedin, FaFacebook, FaLink } from 'react-icons/fa'
import { Badge } from '@/components/ui/badge'
import ShareButtons from '@/components/ShareButtons'
import Footer from '@/components/Footer'
import { urlFor } from '@/sanity/lib/image'
import { NavBar } from '@/components/NavBar'

// --- Types ---
interface Lesson {
  _id: string
  title: string
  order: number
  duration?: number
}

interface Section {
  _id: string
  title: string
  order: number
  lessons: Lesson[]
}


interface Tutor {
  name: string
  image?: any
  bio?: string
  socialLinks?: { platform: string; url: string }[]
}

interface Course {
  _id: string
  title: string
  slug: { current: string }
  description: string
  price: number
  image?: any
  sections: Section[]
  tutor?: Tutor
  whatYouWillLearn?: string[]
  requirements?: string[]
  badges?: string[]
}

// --- GROQ Query ---
const query = groq`
  *[_type == "course" && slug.current == $slug][0]{
    ...,
    image,
    sections[]->{
      ...,
      lessons[]-> {
        _id,
        title,
        order,
        duration
      }
    },
    tutor-> {
      name,
      image,
      bio,
      socialLinks
    },
    whatYouWillLearn,
    requirements,
    badges,
  }
`

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params)
  const { slug } = resolvedParams
  const [course, setCourse] = useState<Course | null>(null)
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    async function fetchCourse() {
      const c = await client.fetch<Course>(query, { slug })
      setCourse(c)
      setLoading(false)
    }
    fetchCourse()
  }, [slug])

  useEffect(() => {
    async function checkEnrollment() {
      if (!session?.user?.id || !course?._id) return
      const res = await fetch(`/api/enroll/check?courseId=${course._id}`)
      const data = await res.json()
      setIsEnrolled(data.enrolled)
    }
    checkEnrollment()
  }, [session, course])

  const handleEnroll = async () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=" + encodeURIComponent(window.location.pathname))
      return
    }
    setEnrolling(true)
    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course?._id }),
    })
    setEnrolling(false)
    if (res.ok) {
      router.push(`/courses/learn/${course?._id}`)
    } else {
      alert("Failed to enroll. Please try again.")
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-black to-black text-white">Loading...</div>
  if (!course) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-black to-black text-white">Course not found</div>

  // --- Fallbacks for missing fields (mock data) ---
  const whatYouWillLearn = course.whatYouWillLearn || [
    "Master the basics of X",
    "Build real-world projects",
    "Understand advanced concepts",
    "Get certified and job-ready"
  ]
  const requirements = course.requirements || [
    "No prior experience required",
    "A computer with internet access"
  ]
  const badges = course.badges || ["Bestseller"]
  const tutor = course.tutor || {
    name: "Shinde",
    bio: "Full-stack developer passionate about AI, web development, and creating innovative solutions.",
    image: null,
    socialLinks: []
  }

  // --- Sort sections/lessons ---
  const sortedSections = course.sections?.sort((a, b) => a.order - b.order) || []

  // --- Helper: Render stars ---
  const renderStars = (rating: number) => {
    return null
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/80 via-black to-black/90 text-white flex flex-col">
      <div className="w-full backdrop-blur-md z-50">
        <NavBar />
      </div>
      <div className="pt-16">
        {/* Hero Section - Redesigned */}
        <div className="relative w-full overflow-hidden  py-20 px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1 flex flex-col justify-center items-start md:items-start z-10 max-w-2xl">
            <div className="flex gap-2 mb-3">
              {badges.map((badge, i) => (
                <Badge key={i} variant="outline" className="bg-purple-700/20 text-purple-200 border-purple-400/40 font-semibold uppercase tracking-wide">{badge}</Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white leading-tight">{course.title}</h1>
            <p className="text-lg text-neutral-300 mb-4">{course.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <Image src={tutor.image ? urlFor(tutor.image).url() : '/images/profile-img.webp'} alt={tutor.name} width={40} height={40} className="rounded-full object-cover border-2 border-purple-400" />
              <span className="text-base font-semibold text-white">{tutor.name}</span>
              <span className="text-purple-300 text-sm">Instructor</span>
            </div>
          </div>
          <div className="flex-1 flex justify-end items-center md:mr-12">
            {course.image && (
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-700/40">
                <Image
                  src={urlFor(course.image).url()}
                  alt={course.title || 'Course image'}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-2xl shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="container mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 w-full">
          {/* Main Content */}
          <div className="md:col-span-2 order-last md:order-first">
            <div className="space-y-8">
              {/* What You'll Learn */}
              <div className="bg-white/5 rounded-2xl p-6 border border-purple-400/20 shadow-lg">
                <h2 className="text-2xl font-semibold text-purple-400 mb-4 flex items-center gap-2"><FaCheckCircle className="text-green-400" /> What you'll learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {whatYouWillLearn.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-neutral-200"><FaCheckCircle className="text-green-400" /> {item}</li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-white/5 rounded-2xl p-6 border border-purple-400/20 shadow-lg">
                <h2 className="text-xl font-semibold text-purple-400 mb-4">Requirements</h2>
                <ul className="list-disc pl-6 text-neutral-300">
                  {requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Course Content (Curriculum) */}
              <div className="bg-white/5 rounded-2xl p-6 border border-purple-400/20 shadow-lg">
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Course Content</h2>
                <div className="space-y-4">
                  {sortedSections.length > 0 ? (
                    sortedSections.map((section) => {
                      const sortedLessons = section.lessons?.sort((a, b) => a.order - b.order) || []
                      const isOpen = openSection === section._id
                      return (
                        <Collapsible.Root key={section._id} open={isOpen} onOpenChange={() => setOpenSection(isOpen ? null : section._id)}>
                          <div className="bg-black/40 rounded-lg border border-purple-400/20">
                            <Collapsible.Trigger asChild>
                              <button
                                className="w-full flex items-center justify-between px-6 py-4 cursor-pointer focus:outline-none group"
                                aria-expanded={isOpen}
                              >
                                <span className="text-xl font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">{section.title}</span>
                                <IoChevronDown className={`w-6 h-6 text-purple-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                              </button>
                            </Collapsible.Trigger>
                            <Collapsible.Content className="overflow-hidden transition-all duration-300 ease-in-out px-6 pb-4">
                              <ul className="mt-2 space-y-2">
                                {sortedLessons.length > 0 ? (
                                  sortedLessons.map((lesson) => (
                                    <li key={`${section._id}-${lesson._id}`} className="text-neutral-300 pl-2 border-l-2 border-purple-400/20 hover:border-purple-400/60 transition-colors flex items-center gap-2">
                                      <FaClock className="text-purple-400/60" /> {lesson.title}
                                      {lesson.duration && <span className="ml-2 text-xs text-gray-400">{lesson.duration} min</span>}
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-neutral-300">No lessons found</li>
                                )}
                              </ul>
                            </Collapsible.Content>
                          </div>
                        </Collapsible.Root>
                      )
                    })
                  ) : (
                    <div className="text-neutral-300">No sections found</div>
                  )}
                </div>
              </div>

              {/* Instructor Section */}
              <div className="bg-white/5 rounded-2xl p-6 border border-purple-400/20 shadow-lg flex flex-col md:flex-row gap-6 items-center">
                <Image src={tutor.image ? urlFor(tutor.image).url() : '/images/profile-img.webp'} alt={tutor.name} width={80} height={80} className="rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-lg text-purple-400">{tutor.name}</h3>
                  <p className="text-sm text-neutral-300 mb-2">{tutor.bio}</p>
                  <div className="flex gap-2 mt-2">
                    {tutor.socialLinks && tutor.socialLinks.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-xl">
                        {link.platform === 'linkedin' && <FaGlobe />}
                        {link.platform === 'github' && <FaMedal />}
                        {link.platform === 'x' && <span>X</span>}
                        {/* Add more icons as needed */}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 order-first md:order-last">
            <div className="sticky top-4 bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 shadow-lg flex flex-col gap-6">
              <p className="text-3xl font-bold text-purple-400 mb-2">{course.price === 0 ? 'Free' : `$${course.price}`}</p>
              {isEnrolled ? (
                <Link
                  href={`/courses/learn/${course._id}`}
                  className="block w-full bg-purple-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Go to Course
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="block w-full bg-purple-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}
              <ul className="text-gray-300 text-sm space-y-2 mb-2">
                <li className="flex items-center gap-2"><FaClock className="text-purple-400" /> Lifetime access</li>
                <li className="flex items-center gap-2"><FaGlobe className="text-purple-400" /> English</li>
              </ul>
              {/* Share Buttons */}
              <div className="flex items-center justify-center gap-4 mt-2">
                <button
                  onClick={() => {
                    const url = typeof window !== 'undefined' ? window.location.href : '';
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(course.title)}`, '_blank');
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <FaTwitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const url = typeof window !== 'undefined' ? window.location.href : '';
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const url = typeof window !== 'undefined' ? window.location.href : '';
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const url = typeof window !== 'undefined' ? window.location.href : '';
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  aria-label="Copy link"
                >
                  <FaLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}