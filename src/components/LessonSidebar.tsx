import { Card } from "@/components/ui/card";
import { CheckCircle, PlayCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const LessonsSidebar = ({ lessons, courseId, completedLessons, setCompletedLessons }) => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { user } = useAuth();

  const isLessonCompleted = (lessonId) => {
    return completedLessons.find((lesson) => lesson.lesson_id === lessonId);
  };

  const handleLessonClick = (lesson) => {
    if (!user || (lesson.id === lessonId)) return;
    navigate(`/course/${courseId}/lesson/${lesson.id}`);
  };

  return (
    <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-border/50 shadow-soft">
      <div className="mb-4">
        <h3 className="font-bold text-lg text-foreground">Course Lessons</h3>
        <p className="text-sm text-muted-foreground">
          {completedLessons.size} of {lessons.length} completed
        </p>
      </div>
      <div className="space-y-2">
        {lessons.map((lesson, index) => {
          const completed = isLessonCompleted(lesson.id);
          const isCurrent = lesson.id === lessonId;

          return (
            <div
              key={lesson.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isCurrent
                ? 'bg-primary/10 border border-primary/20 shadow-sm'
                : 'hover:bg-muted/50 cursor-pointer hover:shadow-sm'
                }`}
              onClick={() => handleLessonClick(lesson)}
            >
              <div className="flex-shrink-0">
                {completed ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <PlayCircle className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isCurrent ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                  {index + 1}. {lesson.title}
                </p>
              </div>
            </div>
          );
        })}

        {lessons.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No lessons available
          </p>
        )}
      </div>
    </Card>
  );
};

export default LessonsSidebar;