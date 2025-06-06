import { BlogGrid } from "@/components/BlogGrid";
import Footer from "@/components/Footer";
import { NavBar } from "@/components/NavBar";

export default function BlogPage() {
  return (
    <div>
      <NavBar/>
      <main>
      <BlogGrid />
      </main>
      <Footer />  
    </div>
  );
} 