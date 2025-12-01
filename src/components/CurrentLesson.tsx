import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, Clock, Target } from "lucide-react";
import { useState, useEffect } from "react";

const CurrentLesson = ({
    lesson,
    courseId,
    allLessons,
    currentIndex,
    isMarkedAsRead,
    markAsRead,
    hasPrevious,
    hasNext
}) => {
    const navigate = useNavigate();
    const [isMarkingComplete, setIsMarkingComplete] = useState(false);
    const [readingTime, setReadingTime] = useState(0);

    useEffect(() => {
        if (lesson?.content) {
            // Estimate reading time (average reading speed: 200-250 words per minute)
            const wordCount = lesson.content.split(/\s+/).length;
            const readingTimeMinutes = Math.ceil(wordCount / 200);
            setReadingTime(readingTimeMinutes);
        }
    }, [lesson]);

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

    const handleMarkAsRead = async () => {
        if (isMarkedAsRead) return;

        setIsMarkingComplete(true);
        try {
            await markAsRead();
        } catch (error) {
            console.error("Error marking lesson as read:", error);
        } finally {
            setIsMarkingComplete(false);
        }
    };

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground mb-2">Loading lesson content...</p>
                <p className="text-sm text-muted-foreground">Please wait while we prepare your lesson</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 h-full flex flex-col">
            {/* Lesson Header */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-center justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                        {lesson.order_index}
                    </div>
                    <Button
                        variant={isMarkedAsRead ? "secondary" : "default"}
                        onClick={handleMarkAsRead}
                        disabled={isMarkedAsRead || isMarkingComplete}
                        className="flex items-center gap-2 transition-all duration-200 whitespace-nowrap"
                        size="lg"
                    >
                        {isMarkingComplete ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                            <CheckCircle className={`h-4 w-4 ${isMarkedAsRead ? 'text-green-500' : ''}`} />
                        )}
                        {isMarkedAsRead ? "Completed" : isMarkingComplete ? "Marking..." : "Mark as Complete"}
                    </Button>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                            {lesson.title}
                        </h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                Lesson {currentIndex + 1} of {allLessons.length}
                            </div>
                            {readingTime > 0 && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {readingTime} min read
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lesson Content */}
            <Card className="p-2 md:p-8 bg-transparent border-border/30 shadow-none flex-1 mb-6">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="space-y-6 text-base md:text-lg leading-relaxed md:leading-loose text-foreground/90 whitespace-pre-wrap">
                        {lesson.content}
                    </div>
                </div>
            </Card>

            {/* Navigation */}
            <div className="flex sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/30">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={!hasPrevious}
                    className="flex items-center gap-2 flex-1 sm:flex-initial min-w-0"
                    size="lg"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="truncate">Previous</span>
                </Button>

                <div className="flex items-center gap-3 text-sm text-muted-foreground flex-shrink-0">
                    <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>Progress: {currentIndex + 1}/{allLessons.length}</span>
                    </div>
                </div>

                <Button
                    onClick={handleNext}
                    disabled={!hasNext}
                    className="flex items-center gap-2 flex-1 sm:flex-initial min-w-0 bg-primary hover:bg-primary/90"
                    size="lg"
                >
                    <span className="truncate">Next Lesson</span>
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {/* Completion Celebration */}
            {isMarkedAsRead && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-in fade-in-50">
                    <div className="flex items-center gap-3 text-green-800 dark:text-green-300">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Lesson completed!</p>
                            <p className="text-sm opacity-80">Great job! Ready to move to the next lesson?</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentLesson;