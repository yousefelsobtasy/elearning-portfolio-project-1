import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Clock, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

const CourseDetail = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // Mock course data
  const course = {
    id: courseId,
    title: "Introduction to Web Development",
    description: "Master the fundamentals of web development with this comprehensive beginner-friendly course. You'll learn HTML, CSS, and JavaScript from scratch, building real projects along the way.",
    difficulty: "Beginner",
    totalLessons: 12,
    totalDuration: "8 hours",
    instructor: "Jane Smith",
    category: "Web Development"
  };

  const lessons: Lesson[] = [
    { id: "1", title: "Getting Started with HTML", duration: "25 min", completed: false },
    { id: "2", title: "HTML Elements and Structure", duration: "30 min", completed: false },
    { id: "3", title: "Introduction to CSS", duration: "35 min", completed: false },
    { id: "4", title: "CSS Layout Fundamentals", duration: "40 min", completed: false },
    { id: "5", title: "Responsive Design Basics", duration: "45 min", completed: false },
    { id: "6", title: "JavaScript Fundamentals", duration: "50 min", completed: false },
    { id: "7", title: "DOM Manipulation", duration: "35 min", completed: false },
    { id: "8", title: "Events and Event Handlers", duration: "30 min", completed: false },
    { id: "9", title: "Working with Forms", duration: "40 min", completed: false },
    { id: "10", title: "API Basics", duration: "45 min", completed: false },
    { id: "11", title: "Building Your First Project", duration: "60 min", completed: false },
    { id: "12", title: "Project Review and Next Steps", duration: "25 min", completed: false }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Course Header */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/courses")}
            className="mb-4"
          >
            ← Back to Courses
          </Button>
          
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {course.difficulty}
                  </Badge>
                  <Badge variant="outline">{course.category}</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground">{course.description}</p>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.totalDuration}</span>
                </div>
              </div>
            </div>

            <div>
              <Card className="p-6 sticky top-4 shadow-soft border-border/50">
                <Button 
                  size="lg" 
                  className="w-full mb-4 bg-gradient-card shadow-soft hover:shadow-hover transition-all"
                  onClick={() => navigate(`/course/${courseId}/lesson/1`)}
                >
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Start Learning
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Instructor: {course.instructor}
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Course Content</h2>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <Card
                key={lesson.id}
                className="p-4 hover:shadow-soft transition-all cursor-pointer border-border/50 hover:border-primary/30"
                onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-semibold text-muted-foreground">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">{lesson.duration}</p>
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
