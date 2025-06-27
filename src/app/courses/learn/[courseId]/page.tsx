import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/authOptions'
import { prisma } from '@/lib/prisma'

interface LessonIdentifier {
  _id: string;
  order: number;
}

interface SectionWithLessons {
  lessons: LessonIdentifier[];
  order: number;
}

interface CourseWithLessons {
  sections: SectionWithLessons[];
}

// Define the params type
export type ParamsType = Promise<{ courseId: string }>;

export default async function CourseLearningRedirectPage({ params }: { params: ParamsType }) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const course = await client.fetch<CourseWithLessons>(
    groq`*[_type == "course" && _id == $courseId][0]{
      "sections": sections[]->{
        order,
        "lessons": lessons[]->{
          _id,
          order
        }
      }
    }`,
    { courseId }
  );

  if (!course || !course.sections || course.sections.length === 0) {
    return <div>This course has no lessons yet.</div>;
  }

  const allLessons = course.sections
    .sort((a, b) => a.order - b.order)
    .flatMap(section =>
      (section.lessons || []).sort((a, b) => a.order - b.order)
    );

  if (allLessons.length === 0) {
    return <div>This course has no lessons yet.</div>;
  }

  if (!userId) {
    redirect(`/courses/learn/${courseId}/${allLessons[0]._id}`);
    return;
  }

  const userProgress = await prisma.courseProgress.findMany({
    where: {
      userId,
      courseId,
      completed: true,
    },
    select: {
      lessonId: true,
    },
  });

  const completedLessonIds = new Set(userProgress.map(p => p.lessonId));

  let nextLessonId = allLessons[0]._id;
  const lastCompletedIndex = allLessons.findLastIndex(lesson => completedLessonIds.has(lesson._id));

  if (lastCompletedIndex !== -1) {
    if (lastCompletedIndex < allLessons.length - 1) {
      nextLessonId = allLessons[lastCompletedIndex + 1]._id;
    } else {
      nextLessonId = allLessons[lastCompletedIndex]._id;
    }
  }

  redirect(`/courses/learn/${courseId}/${nextLessonId}`);
}