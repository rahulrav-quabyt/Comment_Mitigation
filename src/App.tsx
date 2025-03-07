import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';

interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  timestamp: string;
  obscene?: number;
  negative?: number;
}

interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

function App() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      content: "Just finished reading an amazing book about sustainable architecture. The way modern design can harmonize with nature is truly inspiring! 🌿🏗️",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
      likes: 124,
      isLiked: false,
      comments: [],
    },
    {
      id: 2,
      author: "Mike Peters",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      content: "Exploring the hidden trails of Mount Rainier today. The views are absolutely breathtaking! 🏔️",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
      likes: 89,
      isLiked: false,
      comments: [],
    },
  ]);

  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});

  // Run the Python script on component mount (refresh)
  useEffect(() => {
    const runPythonScript = async () => {
      try {
        const response = await fetch('http://localhost:5001/run-script', {
          method: 'POST',
        });
        const result = await response.json();
        if (result.success) {
          console.log("Python script executed successfully:", result.output);
        } else {
          console.error("Error running Python script:", result.error);
        }
      } catch (error) {
        console.error("Failed to run Python script:", error);
      }
    };

    runPythonScript();
  }, []);

  // Fetch comments from JSON Server
  const fetchComments = async (postId: number): Promise<Comment[]> => {
    const response = await fetch(`http://localhost:3001/comments?postId=${postId}`);
    const comments = await response.json();
    return comments;
  };

  // Load comments for all posts on initial render
  useEffect(() => {
    const loadComments = async () => {
      const updatedPosts = await Promise.all(
        posts.map(async (post) => {
          const comments = await fetchComments(post.id);
          return { ...post, comments };
        })
      );
      setPosts(updatedPosts);
    };

    loadComments();
  }, []);

  // Handle like button click
  const handleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      )
    );
  };

  // Add a new comment
  const handleComment = async (postId: number) => {
    if (!newComments[postId]?.trim()) return;

    const response = await fetch('http://localhost:3001/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId,
        author: 'You',
        content: newComments[postId],
        timestamp: new Date().toLocaleTimeString(),
      }),
    });

    const newComment = await response.json();

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );

    setNewComments({ ...newComments, [postId]: '' });
  };

  // Function to format the date and time
  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-center mb-4">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">{post.author}</p>
                </div>
              </div>

              <p className="text-gray-800 mb-4">{post.content}</p>

              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <div className="flex items-center justify-between border-t border-b border-gray-200 py-2 mb-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 ${post.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
                >
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <button className="flex items-center space-x-2 text-gray-500">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </button>

                <button className="flex items-center space-x-2 text-gray-500">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <React.Fragment key={comment.id}>
                    <div className="flex space-x-3">
                      <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-sm text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-800 mt-1">
                          {comment.obscene === 1
                            ? `Comment has been removed, as of ${formatDateTime(new Date())}`
                            : comment.content}
                        </p>
                      </div>
                    </div>
                    {/* Add a review comment if the comment is negative */}
                    {comment.negative === 1 && (
                      <div className="flex space-x-3">
                        <div className="flex-1 bg-yellow-100 rounded-lg px-4 py-2">
                          <p className="text-yellow-800 mt-1">
                            This comment is under review, Please maintain online decorum and etiquette.
                          </p>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-4 flex space-x-2">
                <input
                  type="text"
                  value={newComments[post.id] || ''}
                  onChange={(e) =>
                    setNewComments({
                      ...newComments,
                      [post.id]: e.target.value,
                    })
                  }
                  placeholder="Write a comment..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleComment(post.id);
                    }
                  }}
                />
                <button
                  onClick={() => handleComment(post.id)}
                  className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;