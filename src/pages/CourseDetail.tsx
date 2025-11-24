import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Clock, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Lesson {
  id: string;
  title: string;
  order_index: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  lessons: Lesson[];
}

const CourseDetail = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*, lessons(*)')
      .eq('id', courseId)
      .order('order_index', { referencedTable: 'lessons', ascending: true })
      .single();

    if (data) setCourse(data as any);
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen py-12 pt-24">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/courses")} className="mb-4">
          ← Back to Courses
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getDifficultyColor(course.difficulty)}>
                  {course.difficulty}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground">{course.description}</p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{course.lessons.length} lessons</span>
              </div>
            </div>
          </div>

          <div>
            <Card className="p-6 sticky top-20 shadow-soft border-border/50">
              <Button
                size="lg"
                className="w-full mb-4 bg-gradient-card shadow-soft hover:shadow-hover transition-all"
                onClick={() =>
                  navigate(`/course/${courseId}/lesson/${course.lessons[0]?.id}`)
                }
                disabled={course.lessons.length === 0}
              >
                <PlayCircle className="mr-2 w-5 h-5" />
                Start Learning
              </Button>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Course Content</h2>
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <Card
                key={lesson.id}
                className="p-4 hover:shadow-soft transition-all cursor-pointer border-border/50 hover:border-primary/30"
                onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-semibold text-muted-foreground">
                    {lesson.order_index}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{lesson.title}</h3>
                  </div>
                  <PlayCircle className="w-6 h-6 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;