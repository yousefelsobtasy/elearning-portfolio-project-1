import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const LessonViewer = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const [progress] = useState(25); // Mock progress

  // Mock lesson data
  const lesson = {
    id: lessonId,
    title: "Getting Started with HTML",
    content: `
      # Introduction to HTML

      HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page semantically and originally included cues for the appearance of the document.

      ## What You'll Learn

      In this lesson, we'll cover:
      - The basic structure of an HTML document
      - Essential HTML tags and elements
      - How to create your first web page
      - Best practices for writing semantic HTML

      ## Basic HTML Structure

      Every HTML document follows a basic structure:

      \`\`\`html
      <!DOCTYPE html>
      <html>
        <head>
          <title>My First Page</title>
        </head>
        <body>
          <h1>Hello, World!</h1>
          <p>This is my first web page.</p>
        </body>
      </html>
      \`\`\`

      ## Key Concepts

      **Elements**: The building blocks of HTML pages
      
      **Tags**: Define elements with opening and closing tags
      
      **Attributes**: Provide additional information about elements

      ## Practice Exercise

      Try creating your own simple HTML page using the structure above. Experiment with different headings (h1-h6) and paragraph tags.

      ## Next Steps

      In the next lesson, we'll dive deeper into HTML elements and learn about lists, links, and images.
    `
  };

  const currentLessonNum = parseInt(lessonId || "1");
  const totalLessons = 12;
  const hasPrevious = currentLessonNum > 1;
  const hasNext = currentLessonNum < totalLessons;

  const handlePrevious = () => {
    if (hasPrevious) {
      navigate(`/course/${courseId}/lesson/${currentLessonNum - 1}`);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      navigate(`/course/${courseId}/lesson/${currentLessonNum + 1}`);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/course/${courseId}`)}
            className="mb-4"
          >
            ← Back to Course
          </Button>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="font-medium">{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Lesson Content */}
        <Card className="p-8 md:p-12 mb-8 shadow-soft border-border/50">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {currentLessonNum}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{lesson.title}</h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="space-y-6 text-base leading-relaxed">
              {lesson.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{line.slice(3)}</h2>;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={index} className="font-semibold">{line.slice(2, -2)}</p>;
                } else if (line.startsWith('```')) {
                  return null;
                } else if (line.trim().startsWith('-')) {
                  return (
                    <li key={index} className="ml-4">
                      {line.trim().slice(2)}
                    </li>
                  );
                } else if (line.trim()) {
                  return <p key={index}>{line}</p>;
                }
                return null;
              })}
            </div>
          </div>

          {/* Mark Complete Button */}
          <div className="mt-8 pt-8 border-t border-border">
            <Button className="w-full md:w-auto bg-gradient-card shadow-soft hover:shadow-hover transition-all">
              <CheckCircle className="mr-2 w-5 h-5" />
              Mark as Complete
            </Button>
          </div>
        </Card>

        {/* Navigation */}
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
            Lesson {currentLessonNum} of {totalLessons}
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
