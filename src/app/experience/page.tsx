import React from "react";
import { Experience } from "@/components/Experience";
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function ExperiencePage() {
  return (
    <div>
      <NavBar/>
    <main className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <Experience />
    </main>
    <Footer/>
    </div>
  );
} 