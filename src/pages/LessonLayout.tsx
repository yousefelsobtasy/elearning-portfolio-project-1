import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import LessonsSidebar from "@/components/LessonSidebar";
import TasksSidebar from "@/components/TasksSidebar";
import { ArrowLeft, CheckCircle, BookOpen, Clock } from "lucide-react";
import LessonProgress from "@/components/LessonProgress";
import CurrentLesson from "@/components/CurrentLesson";

const LessonLayout = () => {
    const navigate = useNavigate();
    const { courseId, lessonId } = useParams();
    const { user } = useAuth();
    const [allLessons, setAllLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [courseTitle, setCourseTitle] = useState("");
    const [isMarkedAsRead, setIsMarkedAsRead] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    useEffect(() => {
        if (lessonId && user && allLessons.length > 0) {
            fetchCurrentLesson();
            checkIfLessonCompleted();
        }
    }, [lessonId, user, allLessons, completedLessons]);

    const fetchCourseData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([fetchAllLessons(), fetchCourseTitle()]);
        } catch (error) {
            console.error("Error fetching course data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllLessons = async () => {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index', { ascending: true });

        if (data) {
            setAllLessons(data);
            await fetchCompletedLessons();
        }
        if (error) {
            console.error("Error fetching lessons:", error);
        }
    };

    const fetchCurrentLesson = () => {
        if (!lessonId || allLessons.length === 0) return;
        const lesson = allLessons.find((lesson) => lesson.id === lessonId) || null;
        setCurrentLesson(lesson);
    };

    const fetchCompletedLessons = async () => {
        if (!user) return [];
        const { data, error } = await supabase
            .from('lesson_completions')
            .select('lesson_id')
            .eq('profile_id', user.id)
            .eq('course_id', courseId);

        if (data) {
            setCompletedLessons(data);
        }
        return data || [];
    };

    const fetchCourseTitle = async () => {
        const { data, error } = await supabase
            .from('courses')
            .select('title')
            .eq('id', courseId)
            .single();

        if (data) {
            setCourseTitle(data.title);
        }
    };

    const checkIfLessonCompleted = () => {
        if (!user || !lessonId) return;
        const isCompleted = completedLessons.find((cl) => cl.lesson_id === lessonId);
        setIsMarkedAsRead(!!isCompleted);
    };

    const markAsRead = async () => {
        if (!user || !lessonId || !courseId) return;

        const { error } = await supabase
            .from('lesson_completions')
            .upsert({
                profile_id: user.id,
                course_id: courseId,
                lesson_id: lessonId,
                completed_at: new Date().toISOString()
            });

        if (!error) {
            setIsMarkedAsRead(true);
            const updatedCompletedLessons = await fetchCompletedLessons();
            setCompletedLessons(updatedCompletedLessons);
        }
    };

    const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
    const progressPercentage = allLessons.length > 0 ? (completedLessons.length / allLessons.length) * 100 : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-emerald-950/10 py-8 pt-24">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading course content...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-emerald-950/10 py-8 pt-24">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/course/${courseId}`)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Course
                        </Button>

                        {isMarkedAsRead && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 animate-in fade-in-50">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Lesson Completed
                            </Badge>
                        )}
                    </div>

                    <LessonProgress
                        courseTitle={courseTitle}
                        progressPercentage={progressPercentage}
                        completedLessons={completedLessons}
                        allLessons={allLessons}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left Sidebar - Lessons List */}
                    <div className="xl:col-span-3">
                        <LessonsSidebar
                            lessons={allLessons}
                            courseId={courseId}
                            completedLessons={completedLessons}
                            setCompletedLessons={setCompletedLessons}
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="xl:col-span-6">
                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden">
                            <CurrentLesson
                                lesson={currentLesson}
                                courseId={courseId}
                                currentIndex={currentIndex}
                                markAsRead={markAsRead}
                                isMarkedAsRead={isMarkedAsRead}
                                allLessons={allLessons}
                                hasPrevious={currentIndex > 0}
                                hasNext={currentIndex < allLessons.length - 1}
                            />
                        </div>
                    </div>

                    {/* Right Sidebar - Tasks */}
                    <div className="xl:col-span-3">
                        <TasksSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonLayout;