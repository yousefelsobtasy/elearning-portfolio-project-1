import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlaskConical, Users, Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-learning.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FlaskConical,
      title: "Interactive Chemistry Lessons",
      description: "Master chemistry concepts through engaging, visual learning experiences"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with fellow chemistry students and share insights"
    },
    {
      icon: Sparkles,
      title: "Expert Guidance",
      description: "Learn from experienced chemistry educators with proven teaching methods"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Master Chemistry<br />Your Way
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-lg">
                Explore the fascinating world of chemistry through interactive courses designed to make learning engaging and accessible.
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
            Why Chemistry Hub?
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
            Join fellow students in discovering the wonders of chemistry. Start your journey today!
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

      {/* Footer Section */}
      <footer className="mt-auto py-8 border-t border-border/50 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>by</span>
              <a href="https://makethemlearn.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                make them learn
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70 text-center max-w-md">
              Chemistry Hub is dedicated to transforming chemistry education through innovative teaching methods and interactive learning experiences.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;