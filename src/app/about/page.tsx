import { redirect } from 'next/navigation';

export default function AboutPage() {
  redirect('/#about');
  return null; // This component will not render anything
} 