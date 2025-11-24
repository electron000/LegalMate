import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast, { Toaster } from 'react-hot-toast';
import './BlogViewPage.css';

const BlogViewPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadBlogFromState = () => {
      setLoading(true);
      setError(null);
      
      const blogDataFromState = location.state?.blog;

      if (blogDataFromState && String(blogDataFromState.id) === blogId) {
        setBlog(blogDataFromState);
        setLoading(false);
      } else {
        setError('Blog data is missing. Please return to the feed and select the blog again.');
        setLoading(false);
      }
    };

    loadBlogFromState();
  }, [blogId, location.state]);
  
  useEffect(() => {
    if (loading || !blog) return;
    const timer = setTimeout(() => {
      document.querySelectorAll('.blog-body pre').forEach(block => {
        if (block.querySelector('.copy-code-btn')) return;
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        block.appendChild(button);
        button.addEventListener('click', () => {
          const code = block.querySelector('code')?.innerText || '';
          navigator.clipboard.writeText(code)
            .then(() => toast.success('Code copied!', { duration: 2000 }))
            .catch(() => toast.error('Failed to copy code.'));
        });
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [blog, loading]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const estimateReadTime = (content) => {
    if (!content) return '1 min read';
    const wordCount = content.split(/\s+/).length;
    return `${Math.ceil(wordCount / 200)} min read`;
  };

  const getContentWithoutTitle = (content) => {
    if (!content) return "";
    return content.replace(/^\s*#\s+[^\n]+(\n|$)/, '').trim();
  };

  if (loading) {
    return <div className="blog-view-page loading"><h2>Loading Blog...</h2></div>;
  }

  if (error || !blog) {
    return (
      <div className="blog-view-page error">
        <h2>{error || 'Blog not found'}</h2>
        <button onClick={() => navigate('/blogs')} className="back-to-blogs-btn" style={{marginTop: '1rem'}}>
           Return to Feed
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      
      <div className="blog-view-page">
        <button onClick={() => navigate(-1)} className="back-to-blogs-btn">
          <ArrowLeft size={18} />
          Back
        </button>
        <article className="blog-content">
          <header className="blog-header">
            <div className="blog-header-content">
                <h1 className="blog-title">{blog.title}</h1>
                <div className="blog-meta">
                    <span><User size={14} /> By {blog.author || 'LegalMate AI'}</span>
                    <span><Calendar size={14} /> {formatDate(blog.createdAt)}</span>
                    <span><Clock size={14} /> {estimateReadTime(blog.content)}</span>
                </div>
            </div>
          </header>
          <div className="blog-body">
            <ReactMarkdown>{getContentWithoutTitle(blog.content)}</ReactMarkdown>
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogViewPage;