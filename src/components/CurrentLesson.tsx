import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, Clock, Target, Video, FileText } from "lucide-react";
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
    const [lessonViewMode, setLessonViewMode] = useState("text"); // "text" or "video"

    useEffect(() => {
        if (lesson?.content) {
            // Estimate reading time (average reading speed: 200-250 words per minute)
            const wordCount = lesson.content.split(/\s+/).length;
            const readingTimeMinutes = Math.ceil(wordCount / 200);
            setReadingTime(readingTimeMinutes);
        }
    }, [lesson]);

    // Reset view mode when lesson changes
    useEffect(() => {
        // If lesson has video_url, show video mode by default if available
        if (lesson?.video_url) {
            setLessonViewMode("video");
        } else {
            setLessonViewMode("text");
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

    const toggleViewMode = () => {
        if (lesson?.video_url) {
            setLessonViewMode(prev => prev === "text" ? "video" : "text");
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

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
        if (!url) return null;

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = lesson.video_url ? getYouTubeVideoId(lesson.video_url) : null;
    const hasVideoContent = Boolean(videoId);
    const hasTextContent = Boolean(lesson?.content);

    return (
        <div className="p-6 md:p-8 h-full flex flex-col">
            {/* Lesson Header */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                            {lesson.order_index}
                        </div>

                        {/* View Mode Toggle Button */}
                        {hasVideoContent && hasTextContent && (
                            <Button
                                variant="outline"
                                onClick={toggleViewMode}
                                className="flex items-center gap-2 transition-all duration-200"
                                size="sm"
                            >
                                {lessonViewMode === "text" ? (
                                    <>
                                        <Video className="h-4 w-4" />
                                        Switch to Video
                                    </>
                                ) : (
                                    <>
                                        <FileText className="h-4 w-4" />
                                        Switch to Text
                                    </>
                                )}
                            </Button>
                        )}
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
                            {readingTime > 0 && lessonViewMode === "text" && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {readingTime} min read
                                </div>
                            )}
                            {lessonViewMode === "video" && (
                                <div className="flex items-center gap-1">
                                    <Video className="h-4 w-4" />
                                    Video Lesson
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lesson Content - Dynamic based on view mode */}
            <Card className=" bg-transparent border-border/30 shadow-none flex-1 mb-6 overflow-hidden">
                {lessonViewMode === "video" && videoId ? (
                    <div className="w-full aspect-video rounded-lg overflow-hidden">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={lesson.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <div className="space-y-6 text-base md:text-lg leading-relaxed md:leading-loose text-foreground/90 whitespace-pre-wrap">
                            {lesson.content}
                        </div>
                    </div>
                )}

                {/* Warning if content is missing for current view mode */}
                {lessonViewMode === "video" && !videoId && (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Video className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">Video not available</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            This lesson doesn't have a video or the video URL is invalid.
                        </p>
                        {hasTextContent && (
                            <Button
                                onClick={() => setLessonViewMode("text")}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                Switch to Text Lesson
                            </Button>
                        )}
                    </div>
                )}

                {lessonViewMode === "text" && !lesson.content && (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">Text content not available</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            This lesson doesn't have text content.
                        </p>
                        {hasVideoContent && (
                            <Button
                                onClick={() => setLessonViewMode("video")}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Video className="h-4 w-4" />
                                Switch to Video Lesson
                            </Button>
                        )}
                    </div>
                )}
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