import ClassroomLayout from "@/components/ClassroomLayout";
import Header from "@/components/Header";
import { coursesData } from "@/data/lessons";

export default function LessonPage() {
  const course = coursesData[0];

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Header platformName={course.title} />
      <ClassroomLayout showLessonPager />
    </div>
  );
}
