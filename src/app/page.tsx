import { AboutMe } from "@/components/AboutMe";
import { Experience } from "@/components/Experience";
import Hero from "@/components/Hero";
import { NavBar } from "@/components/NavBar";
import { Projects } from "@/components/Projects";
import { Research } from "@/components/Research";
import { BlogGrid } from "@/components/BlogGrid";
import  Footer  from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <NavBar />
      <main>
        <Hero />
        <AboutMe />
        <section className="bg-gradient-to-b from-black to-purple-950">
    <Experience displayLimit={2} />
  </section>
        <Projects displayLimit={4}/>
        <Research />
        <BlogGrid displayLimit={3} />
        </main>
        <Footer/>
    </div>
  );
}
