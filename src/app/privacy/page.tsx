import { NavBar } from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | The Purple Struct",
  description: "Privacy policy for The Purple Struct, including information about data collection, courses, and blog.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black">
      <NavBar />
      
      <main className="w-full px-4 md:px-8 lg:px-12 py-10 pb-32 pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-lg text-neutral-300">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="space-y-8 text-neutral-300">
              
              <section>
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Introduction</h2>
                <p>
                  Welcome to The Purple Struct&apos;s website. I&apos;m Shinde Aditya, a Machine Learning Engineer, and this is my personal website where I share courses, blog posts, and professional experience.
                </p>```
                <p>
                  This Privacy Policy explains how I collect, use, and protect your information when you visit my website, subscribe to my newsletter, or interact with my content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Information I Collect</h2>
                
                <h3 className="text-xl font-medium text-purple-300 mb-3">Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Newsletter Subscription:</strong> When you subscribe to my newsletter, I collect your email address to send you updates about new blog posts, courses, and projects.</li>
                  <li><strong>Contact Form:</strong> If you use the contact form, I collect your name, email address, and message to respond to your inquiries.</li>
                  <li><strong>Course Enrollments:</strong> If you enroll in my courses, I may collect basic information to provide course access and support.</li>
                </ul>

                <h3 className="text-xl font-medium text-purple-300 mb-3 mt-6">Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Analytics:</strong> I use Google Analytics to understand how visitors use my website. This includes information like your IP address, browser type, pages visited, and time spent on the site.</li>
                  <li><strong>Cookies:</strong> My website uses cookies to improve your experience and analyze site traffic.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">How I Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To send you newsletter updates about new content and courses</li>
                  <li>To respond to your contact form submissions</li>
                  <li>To provide access to course materials and support</li>
                  <li>To improve my website and content based on analytics</li>
                  <li>To ensure the security and functionality of my website</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Third-Party Services</h2>
                <p>I use the following third-party services:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Resend:</strong> For sending email newsletters and contact form responses</li>
                  <li><strong>Vercel:</strong> For hosting and deploying my website</li>
                  <li><strong>Sanity CMS:</strong> For managing my blog content and courses</li>
                </ul>
                <p className="mt-4">
                  These services have their own privacy policies, and I encourage you to review them.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Data Security</h2>
                <p>
                  I implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and I cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal information I have about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Unsubscribe from my newsletter at any time</li>
                  <li>Contact me with any privacy concerns</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Children&apos;s Privacy</h2>
                <p>
                  My website is not intended for children under 13 years of age. I do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Changes to This Policy</h2>
                <p>
                  I may update this Privacy Policy from time to time. I will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Contact Me</h2>
                <p>
                  If you have any questions about this Privacy Policy or my data practices, please contact me:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Email: hello@thepurplestruct.com</li>
                  <li>Through the contact form on my website</li>
                  <li>LinkedIn: <a href="https://www.linkedin.com/in/heyshinde" className="text-purple-400 hover:text-purple-300 transition-colors">linkedin.com/in/heyshinde</a></li>
                </ul>
              </section>

              <section className="bg-purple-400/10 border border-purple-400/20 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">Disclaimer</h2>
                <p className="text-sm">
                  This is a personal portfolio website. I am not a legal professional, and this privacy policy is provided for informational purposes. For comprehensive legal advice regarding privacy policies, please consult with a qualified attorney.
                </p>
              </section>

            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 