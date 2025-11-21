import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-learning.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with real-world experience"
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Join thousands of learners on their journey to mastery"
    },
    {
      icon: Award,
      title: "Earn Certificates",
      description: "Showcase your achievements with recognized certifications"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Master New Skills<br />at Your Own Pace
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-lg">
                Join our community of learners and unlock your potential with beginner-friendly courses in coding, design, and technology.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 shadow-hover hover:scale-105 transition-transform"
                onClick={() => navigate("/courses")}
              >
                Browse Courses
              </Button>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Students learning online" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose LearnHub?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-8 text-center hover:shadow-hover transition-all duration-300 hover:-translate-y-1 border-border/50"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-card mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning on LearnHub. Start your journey today!
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 bg-gradient-card shadow-soft hover:shadow-hover transition-all"
            onClick={() => navigate("/courses")}
          >
            Explore All Courses
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
