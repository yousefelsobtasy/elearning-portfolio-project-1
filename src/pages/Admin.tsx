import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

export default function Admin() {
  const { isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  // Course form
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDifficulty, setCourseDifficulty] = useState('Beginner');

  // Lesson form
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonOrder, setLessonOrder] = useState('1');

  // News form
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchCourses();
      fetchLessons();
    }
  }, [isAdmin]);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (data) setCourses(data);
  };

  const fetchLessons = async () => {
    const { data } = await supabase
      .from('lessons')
      .select('*, courses(title)')
      .order('order_index', { ascending: true });
    if (data) setLessons(data);
  };

  const createCourse = async () => {
    const { error } = await supabase
      .from('courses')
      .insert({ title: courseTitle, description: courseDesc, difficulty: courseDifficulty });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Course created' });
      setCourseTitle('');
      setCourseDesc('');
      fetchCourses();
    }
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Success', description: 'Course deleted' });
      fetchCourses();
    }
  };

  const createLesson = async () => {
    if (!selectedCourse) {
      toast({ title: 'Error', description: 'Please select a course', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('lessons').insert({
      course_id: selectedCourse,
      title: lessonTitle,
      content: lessonContent,
      order_index: parseInt(lessonOrder),
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Lesson created' });
      setLessonTitle('');
      setLessonContent('');
      fetchLessons();
    }
  };

  const deleteLesson = async (id: string) => {
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Success', description: 'Lesson deleted' });
      fetchLessons();
    }
  };

  const createNews = async () => {
    const { error } = await supabase.from('news').insert({ title: newsTitle, content: newsContent });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'News posted' });
      setNewsTitle('');
      setNewsContent('');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="courses">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Course</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} />
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select value={courseDifficulty} onValueChange={setCourseDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={createCourse}>Create Course</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {courses.map((course) => (
                    <div key={course.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-semibold">{course.title}</div>
                        <div className="text-sm text-muted-foreground">{course.difficulty}</div>
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => deleteCourse(course.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Lesson</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} rows={6} />
                </div>
                <div>
                  <Label>Order</Label>
                  <Input type="number" value={lessonOrder} onChange={(e) => setLessonOrder(e.target.value)} />
                </div>
                <Button onClick={createLesson}>Create Lesson</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-semibold">{lesson.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {lesson.courses?.title} • Order: {lesson.order_index}
                        </div>
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => deleteLesson(lesson.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Post News</CardTitle>
                <CardDescription>Share updates with students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} rows={8} />
                </div>
                <Button onClick={createNews}>Post News</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}