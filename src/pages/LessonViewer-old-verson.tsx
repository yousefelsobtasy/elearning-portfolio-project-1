import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Lesson {
  id: string;
  title: string;
  content: string;
  order_index: number;
  course_id: string;
}

const LessonViewer = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
      fetchAllLessons();
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (data) setLesson(data);
  };

  const fetchAllLessons = async () => {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (data) setAllLessons(data);
  };

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      navigate(`/course/${courseId}/lesson/${allLessons[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      navigate(`/course/${courseId}/lesson/${allLessons[currentIndex + 1].id}`);
    }
  };

  return (
    <div className="min-h-screen py-8 pt-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(`/course/${courseId}`)} className="mb-4">
            ← Back to Course
          </Button>
        </div>

        <Card className="p-8 md:p-12 mb-8 shadow-soft border-border/50">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {lesson.order_index}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{lesson.title}</h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="space-y-6 text-base leading-relaxed whitespace-pre-wrap">
              {lesson.content}
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className="flex-1 md:flex-initial"
          >
            <ChevronLeft className="mr-2 w-5 h-5" />
            Previous Lesson
          </Button>

          <span className="text-sm text-muted-foreground hidden md:block">
            Lesson {currentIndex + 1} of {allLessons.length}
          </span>

          <Button
            onClick={handleNext}
            disabled={!hasNext}
            className="flex-1 md:flex-initial bg-primary hover:bg-primary/90"
          >
            Next Lesson
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;