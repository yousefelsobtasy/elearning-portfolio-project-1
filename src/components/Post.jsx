import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Send } from 'lucide-react';
import Comments from '@/components/comments';

const Post = ({ post }) => {
    const { user } = useAuth();
    const [hasLiked, setHasLiked] = useState(post.posts_likes?.some(like => like.user_id === user?.id) || false);
    const [commentInput, setCommentInput] = useState('');


    const toggleLike = async () => {
        if (hasLiked) {
            setHasLiked(false);
            await supabase
                .from('posts_likes')
                .delete()
                .eq('post_id', post.id)
                .eq('user_id', user?.id);
            console.log('Unliked post:', post.id);
        } else {
            setHasLiked(true);
            await supabase
                .from('posts_likes')
                .insert({ post_id: post.id, user_id: user?.id });
            console.log('Liked post:', post.id);
        }
    };

    const addComment = async () => {
        const content = commentInput?.trim();
        if (!content) return;

        const { error } = await supabase
            .from('comments')
            .insert({ post_id: post.id, content, user_id: user?.id });

        if (!error) {
            setCommentInput('');
        }
    };

    const likeCount = post.posts_likes?.length || 0;
    const commentCount = post.comments?.length || 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                    Posted by {post.profiles?.username || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p >{post.content}</p>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleLike}
                        className="gap-2"
                    >
                        <Heart className={hasLiked ? 'fill-current text-red-500' : ''} size={16} />
                        {likeCount}
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageCircle size={16} />
                        {commentCount}
                    </div>
                </div>

                <Comments comments={post.comments || []} />

                <div className="flex gap-2">
                    <Input
                        placeholder="Add a comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addComment()}
                    />
                    <Button size="icon" onClick={addComment}>
                        <Send size={16} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Post;