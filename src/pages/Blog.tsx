import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Banner from '../components/Banner';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const blogsRef = ref(database, 'blogs/posts');
    onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBlogPosts(data);
      }
    });
  }, []);

const categories = [
  "ALL",
  "INDUSTRY TRENDS",
  "CAREER TIPS",
  "NETWORKING",
  "SKILLS DEVELOPMENT",
  "PERSONAL BRANDING",
  "INTERVIEW TIPS",
  "TECHNOLOGY"
];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="pt-20">
      <br></br>
<Banner
  title="CAREER INSIGHTS & INDUSTRY TRENDS"
  subtitle="STAY INFORMED WITH EXPERT ADVICE, MARKET INSIGHTS, AND PRACTICAL TIPS TO ADVANCE YOUR CAREER"
  imageUrl="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
/>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full border transition-colors text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
<h2 className="text-3xl font-bold text-gray-900 mb-4">LATEST ARTICLES</h2>
<p className="text-gray-600">DISCOVER EXPERT INSIGHTS AND PRACTICAL ADVICE FOR YOUR CAREER JOURNEY</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col"
              >
                <div className="relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    {/* MODIFIED: Added 'uppercase' class */}
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium uppercase">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  {/* MODIFIED: Added 'uppercase' class */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight uppercase">
                    {post.title}
                  </h3>
                  {/* MODIFIED: Added 'uppercase' class */}
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3 flex-grow uppercase">
                    {post.excerpt}
                  </p>
                  
                  {/* MODIFIED: Added 'uppercase' class to the parent div */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 uppercase">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span className="mr-3">{post.author}</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {/* MODIFIED: Added 'uppercase' class */}
                    <Link to={`/blog/${index}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center uppercase">
                      Read Article
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                    <button
                      onClick={() => handleShare(post)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;