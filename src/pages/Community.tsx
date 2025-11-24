import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Heart, MessageCircle, Send } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { username: string };
  likes: { user_id: string }[];
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { username: string };
}

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showNewPost, setShowNewPost] = useState(false);

  useEffect(() => {
    fetchPosts();
    
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, fetchPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, fetchPosts)
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
        profiles:user_id (username),
        likes (user_id),
        comments (*, profiles:user_id (username))
      `)
      .order('created_at', { ascending: false });

    if (data) setPosts(data as any);
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

  const toggleLike = async (postId: string, hasLiked: boolean) => {
    if (hasLiked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user?.id);
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: user?.id });
    }
  };

  const addComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    const { error } = await supabase
      .from('comments')
      .insert({ post_id: postId, content, user_id: user?.id });

    if (!error) {
      setCommentInputs({ ...commentInputs, [postId]: '' });
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
          {posts.map((post) => {
            const hasLiked = post.likes.some((like) => like.user_id === user?.id);
            return (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    Posted by {post.profiles.username} • {new Date(post.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{post.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id, hasLiked)}
                      className="gap-2"
                    >
                      <Heart className={hasLiked ? 'fill-current text-red-500' : ''} size={16} />
                      {post.likes.length}
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageCircle size={16} />
                      {post.comments.length}
                    </div>
                  </div>

                  {post.comments.length > 0 && (
                    <div className="space-y-2 border-t pt-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="text-sm">
                          <span className="font-semibold">{comment.profiles.username}: </span>
                          {comment.content}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                    />
                    <Button size="icon" onClick={() => addComment(post.id)}>
                      <Send size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}