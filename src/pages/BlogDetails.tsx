import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Calendar, User, Clock } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const convertHtmlTextToUppercase = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const walkNodes = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        node.textContent = node.textContent.toUpperCase();
      } else {
        node.childNodes.forEach(walkNodes);
      }
    };

    walkNodes(doc.body);
    return doc.body.innerHTML;
  };

  useEffect(() => {
    if (id) {
      const postRef = ref(database, `blogs/posts/${id}`);
      onValue(postRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Capitalize string fields
          const uppercasedPost = {
            ...data,
            title: data.title.toUpperCase(),
            excerpt: data.excerpt.toUpperCase(),
            content: convertHtmlTextToUppercase(data.content),
            author: data.author.toUpperCase(),
            readTime: data.readTime.toUpperCase(),
            category: data.category.toUpperCase(),
          };
          setPost(uppercasedPost);
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center h-screen">Post not found.</div>;
  }

  return (
    <div className="pt-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-96 object-cover" />
          <div className="p-8">
            <div className="mb-4">
              <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-500 text-sm mb-6">
              <div className="flex items-center mr-6">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center mr-6">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <p className="text-lg text-gray-600 mb-6">{post.excerpt}</p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;