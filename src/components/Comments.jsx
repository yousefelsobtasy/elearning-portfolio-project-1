const Comments = ({ comments }) => {
    if (!comments || comments.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2 border-t pt-4">
            {comments.map((comment) => (
                <div key={comment.id} className="text-sm">
                    <span className="font-semibold">{comment.profiles?.username || 'Unknown'}: </span>
                    {comment.content}
                    <span className="text-xs text-muted-foreground ml-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Comments;