import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  lessons: number;
}

const Courses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const courses: Course[] = [
    {
      id: "1",
      title: "Introduction to Web Development",
      description: "Learn the fundamentals of HTML, CSS, and JavaScript to build your first website",
      difficulty: "Beginner",
      category: "Web Development",
      lessons: 12
    },
    {
      id: "2",
      title: "React Fundamentals",
      description: "Master React basics and build interactive user interfaces",
      difficulty: "Intermediate",
      category: "Web Development",
      lessons: 15
    },
    {
      id: "3",
      title: "UI/UX Design Principles",
      description: "Learn to create beautiful and user-friendly interfaces",
      difficulty: "Beginner",
      category: "Design",
      lessons: 10
    },
    {
      id: "4",
      title: "Python for Beginners",
      description: "Start your programming journey with Python",
      difficulty: "Beginner",
      category: "Programming",
      lessons: 18
    },
    {
      id: "5",
      title: "Advanced JavaScript",
      description: "Deep dive into async programming, closures, and design patterns",
      difficulty: "Advanced",
      category: "Web Development",
      lessons: 20
    },
    {
      id: "6",
      title: "Data Structures & Algorithms",
      description: "Master essential computer science concepts",
      difficulty: "Intermediate",
      category: "Programming",
      lessons: 25
    }
  ];

  const categories = ["All", ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Courses</h1>
          <p className="text-lg text-muted-foreground">
            Discover the perfect course to advance your skills
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id}
              className="p-6 hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-semibold leading-tight">{course.title}</h3>
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">
                    {course.lessons} lessons
                  </span>
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    View Course →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No courses found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
