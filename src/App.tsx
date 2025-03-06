import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';

interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
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
      comments: [
        {
          id: 1,
          author: "Alex Chen",
          content: "This is fascinating! Which book was it?",
          timestamp: "2h ago"
        }
      ]
    },
    {
      id: 2,
      author: "Mike Peters",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      content: "Exploring the hidden trails of Mount Rainier today. The views are absolutely breathtaking! 🏔️",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
      likes: 89,
      isLiked: false,
      comments: [
        {
          id: 1,
          author: "Lisa Wong",
          content: "The colors in this photo are incredible!",
          timestamp: "5h ago"
        }
      ]
    }
  ]);

  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: number) => {
    if (!newComments[postId]?.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: post.comments.length + 1,
            author: "You",
            content: newComments[postId],
            timestamp: "Just now"
          }]
        };
      }
      return post;
    }));

    setNewComments({ ...newComments, [postId]: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.map(post => (
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
                {post.comments.map(comment => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-800 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex space-x-2">
                <input
                  type="text"
                  value={newComments[post.id] || ""}
                  onChange={(e) => setNewComments({
                    ...newComments,
                    [post.id]: e.target.value
                  })}
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