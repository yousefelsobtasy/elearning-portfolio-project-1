import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Post from '@/components/Post';

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, fetchPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts_likes' }, fetchLikes)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!inner(
          username
        ),
        posts_likes(
          user_id
        ),
        comments(
          id,
          content,
          created_at,
          user_id,
          post_id,
          profiles!inner(
            username
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (data) {
      console.log('Fetched posts:', data);
      setPosts(data);
    }
  };

  const fetchLikes = async () => {
    const { data: likesData } = await supabase
      .from('posts_likes')
      .select()
      .order('created_at', { ascending: false });

    if (likesData) {
      console.log('Fetched posts likes:', likesData);
      setPosts((prevPosts) => {
        return {
          ...prevPosts,
          posts_likes: likesData
        }
      });
    }
  };



  const createPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    const { error } = await supabase
      .from('posts')
      .insert({ title: newPostTitle, content: newPostContent, user_id: user?.id });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
      toast({ title: 'Success', description: 'Post created successfully' });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Community</h1>
          <Button onClick={() => setShowNewPost(!showNewPost)}>
            {showNewPost ? 'Cancel' : 'New Post'}
          </Button>
        </div>

        {showNewPost && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create a Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Post title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
              />
              <Button onClick={createPost}>Post</Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}