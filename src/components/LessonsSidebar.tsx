import { Card } from "@/components/ui/card";
import { CheckCircle, PlayCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const LessonsSidebar = ({ lessons, courseId, completedLessons, setCompletedLessons }) => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isLessonCompleted = (lessonId) => {
    return completedLessons.find((lesson) => lesson.lesson_id === lessonId);
  };

  const handleLessonClick = (lesson) => {
    if (!user || (lesson.id === lessonId)) return;
    navigate(`/course/${courseId}/lesson/${lesson.id}`);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card className="p-4 sm:p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-border/50 shadow-soft">
      {/* Header with collapsible icon for mobile */}
      <div
        className="flex items-center justify-between cursor-pointer sm:cursor-default mb-4"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-lg text-foreground">Course Lessons</h3>
          <span className="hidden sm:inline text-sm text-muted-foreground">
            ({completedLessons?.length || 0} of {lessons?.length || 0} completed)
          </span>
        </div>
        <div className="sm:hidden">
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Progress text - desktop only */}
      <p className="hidden sm:block text-sm text-muted-foreground mb-4">
        {completedLessons?.length || 0} of {lessons?.length || 0} completed
      </p>

      {/* Progress text - mobile only (when collapsed) */}
      {isCollapsed && (
        <p className="sm:hidden text-sm text-muted-foreground mb-4">
          {completedLessons?.length || 0} of {lessons?.length || 0} completed
        </p>
      )}

      {/* Lessons list - collapsible on mobile */}
      <div className={`${isCollapsed ? 'hidden sm:block' : 'block'}`}>
        <div className="space-y-2">
          {lessons?.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            const isCurrent = lesson.id === lessonId;

            return (
              <div
                key={lesson.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isCurrent
                  ? 'bg-primary/10 border border-primary/20 shadow-sm'
                  : 'hover:bg-muted/50 cursor-pointer hover:shadow-sm'
                  }`}
                onClick={() => {
                  handleLessonClick(lesson);
                  // On mobile, collapse after selecting a lesson
                  if (window.innerWidth < 640) {
                    setIsCollapsed(true);
                  }
                }}
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

          {(!lessons || lessons.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No lessons available
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LessonsSidebar;