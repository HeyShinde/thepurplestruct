import { Projects } from '@/components/Projects'
import { NavBar } from '@/components/NavBar'
import  Footer  from '@/components/Footer'

export default function ProjectsPage() {
  return (
    <div>
      <NavBar />
      <main>
        <Projects />
      </main>
      <Footer />
    </div>
  )
} 