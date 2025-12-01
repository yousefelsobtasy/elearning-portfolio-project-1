// contexts/CourseContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Lesson {
    id: string;
    title: string;
    content: string;
    order_index: number;
    course_id: string;
    created_at: string;
}

interface Course {
    id: string;
    title: string;
    description: string | null;
    difficulty: string | null;
    image_url: string | null;
    created_by: string | null;
    created_at: string;
}

interface LessonCompletion {
    id: string;
    profile_id: string;
    lesson_id: string;
    course_id: string;
    completed_at: string;
    created_at: string;
}

interface CourseContextType {
    // Data
    courses: Course[];
    lessons: { [courseId: string]: Lesson[] };
    completions: { [courseId: string]: Set<string> };

    // Loading states
    loading: boolean;
    loadingCourses: boolean;
    loadingLessons: boolean;

    // Actions
    fetchCourses: () => Promise<void>;
    fetchLessons: (courseId: string) => Promise<void>;
    markLessonAsCompleted: (courseId: string, lessonId: string) => Promise<void>;
    unmarkLessonAsCompleted: (courseId: string, lessonId: string) => Promise<void>;

    // Helper methods
    getCourseLessons: (courseId: string) => Lesson[];
    isLessonCompleted: (courseId: string, lessonId: string) => boolean;
    getCourseProgress: (courseId: string) => number;
    getCompletedLessonsCount: (courseId: string) => number;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [lessons, setLessons] = useState<{ [courseId: string]: Lesson[] }>({});
    const [completions, setCompletions] = useState<{ [courseId: string]: Set<string> }>({});
    const [loading, setLoading] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingLessons, setLoadingLessons] = useState(false);

    // Fetch all courses
    const fetchCourses = async () => {
        if (!user) return;

        setLoadingCourses(true);
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setCourses(data);
        }
        setLoadingCourses(false);
    };

    // Fetch lessons for a specific course
    const fetchLessons = async (courseId: string) => {
        if (!user) return;

        setLoadingLessons(true);

        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index', { ascending: true });

        if (!error && data) {
            setLessons(prev => ({ ...prev, [courseId]: data }));
        }

        setLoadingLessons(false);
    };

    // Fetch completions for a course
    const fetchCompletions = async (courseId: string) => {
        if (!user) return;

        const { data } = await supabase
            .from('lesson_completions')
            .select('lesson_id')
            .eq('profile_id', user.id)
            .eq('course_id', courseId);
        console.log('Fetched completions for course', courseId, data);
        if (data) {
            const completionSet = new Set(data.map(item => item.lesson_id));
            setCompletions(prev => ({ ...prev, [courseId]: completionSet }));
        }
    };

    // Mark lesson as completed
    const markLessonAsCompleted = async (courseId: string, lessonId: string) => {
        if (!user) return;

        const { error } = await supabase
            .from('lesson_completions')
            .upsert({
                profile_id: user.id,
                lesson_id: lessonId,
                course_id: courseId,
                completed_at: new Date().toISOString()
            });

        if (!error) {
            setCompletions(prev => {
                const courseCompletions = prev[courseId] || new Set();
                return {
                    ...prev,
                    [courseId]: new Set([...courseCompletions, lessonId])
                };
            });
        }
    };

    // Unmark lesson as completed
    const unmarkLessonAsCompleted = async (courseId: string, lessonId: string) => {
        if (!user) return;

        const { error } = await supabase
            .from('lesson_completions')
            .delete()
            .eq('profile_id', user.id)
            .eq('lesson_id', lessonId)
            .eq('course_id', courseId);

        if (!error) {
            setCompletions(prev => {
                const courseCompletions = prev[courseId] || new Set();
                courseCompletions.delete(lessonId);
                return {
                    ...prev,
                    [courseId]: new Set(courseCompletions)
                };
            });
        }
    };

    // Helper methods
    const getCourseLessons = (courseId: string): Lesson[] => {
        return lessons[courseId] || [];
    };

    const isLessonCompleted = (courseId: string, lessonId: string): boolean => {
        return completions[courseId]?.has(lessonId) || false;
    };

    const getCompletedLessonsCount = (courseId: string): number => {
        return completions[courseId]?.size || 0;
    };

    const getCourseProgress = (courseId: string): number => {
        const courseLessons = getCourseLessons(courseId);
        const completedCount = getCompletedLessonsCount(courseId);
        return courseLessons.length > 0 ? (completedCount / courseLessons.length) * 100 : 0;
    };

    // Initial data loading
    useEffect(() => {
        if (user) {
            fetchCourses();
            setLoading(false);
        }
    }, [user]);

    // Set up real-time subscriptions
    useEffect(() => {
        if (!user) return;

        // Subscribe to lesson completions changes
        const completionChannel = supabase
            .channel('lesson-completions-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'lesson_completions',
                    filter: `profile_id=eq.${user.id}`
                },
                (payload) => {
                    console.log('Lesson completion change:', payload);
                    // Refresh completions for the affected course
                    if (payload.new && 'course_id' in payload.new) {
                        fetchCompletions((payload.new as any).course_id);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'lessons'
                },
                (payload) => {
                    console.log('Lesson change:', payload);
                    // Refresh lessons for the affected course
                    if (payload.new && 'course_id' in payload.new) {
                        fetchLessons((payload.new as any).course_id);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(completionChannel);
        };
    }, [user]);

    const value: CourseContextType = {
        // Data
        courses,
        lessons,
        completions,

        // Loading states
        loading,
        loadingCourses,
        loadingLessons,

        // Actions
        fetchCourses,
        fetchLessons,
        markLessonAsCompleted,
        unmarkLessonAsCompleted,

        // Helper methods
        getCourseLessons,
        isLessonCompleted,
        getCourseProgress,
        getCompletedLessonsCount,
    };

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
}

export function useCourse() {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error('useCourse must be used within a CourseProvider');
    }
    return context;
}