import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target } from "lucide-react";

const LessonProgress = ({ courseTitle, progressPercentage, completedLessons, allLessons }) => {
    return (
        <>
            <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-medium transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{courseTitle}</h1>
                            <p className="text-sm text-muted-foreground">Continue your learning journey</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</div>
                        <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="font-medium text-foreground">Learning Progress</span>
                        </div>
                        <span className="text-muted-foreground">
                            {completedLessons.length} of {allLessons.length} lessons
                        </span>
                    </div>

                    <Progress
                        value={progressPercentage}
                        className="h-3 bg-black"
                    />

                    {/* <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Beginner</span>
                                <span>Intermediate</span>
                                <span>Advanced</span>
                            </div> */}
                </div>
            </Card>
        </>
    )
}

export default LessonProgress
