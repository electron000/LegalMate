import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, TrendingUp, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast, { Toaster } from 'react-hot-toast';
import { fetchMoreBlogs, fetchBlogById, searchBlogsByTopic } from '../../../api';
import './BlogViewPage.css';

const BlogViewPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [blog, setBlog] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      const blogDataFromState = location.state?.blog;
      const trendingDataFromState = location.state?.trendingBlogs;

      // Scenario A: Use State (Optimistic)
      if (blogDataFromState && String(blogDataFromState.id) === blogId) {
        setBlog(blogDataFromState);
        setTrendingBlogs((trendingDataFromState || []).filter(b => String(b.id) !== blogId).slice(0, 6));
        setLoading(false);
      } 
      // Scenario B: Fetch Fresh
      else {
        try {
          const fetchedBlog = await fetchBlogById(blogId);
          if (!fetchedBlog) throw new Error("Blog not found");
          setBlog(fetchedBlog);

          const sidebarBlogs = await searchBlogsByTopic("Trending", false);
          setTrendingBlogs(sidebarBlogs.filter(b => String(b.id) !== blogId).slice(0, 6));

        } catch (err) {
          console.error(err);
          setError('Blog not found or could not be loaded.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [blogId, location.state]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const estimateReadTime = (content) => {
    if (!content) return '1 min read';
    return `${Math.ceil(content.split(/\s+/).length / 200)} min read`;
  };

  const getContentWithoutTitle = (content) => {
    return content ? content.replace(/^\s*#\s+[^\n]+(\n|$)/, '').trim() : "";
  };

  const handleSidebarClick = (clickedBlog) => {
    navigate(`/blogs/${clickedBlog.id}`, { 
      state: { 
        blog: clickedBlog, 
        trendingBlogs: [...trendingBlogs, blog].filter(b => b.id !== clickedBlog.id)
      } 
    });
    window.scrollTo(0, 0);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const existingTitles = [...trendingBlogs.map(b => b.title), blog?.title];

    try {
      const newBlogs = await fetchMoreBlogs('Trending', existingTitles, false);
      if (newBlogs?.length > 0) {
        const uniqueNewBlogs = newBlogs.filter(b => String(b.id) !== blogId);
        if (uniqueNewBlogs.length > 0) {
            setTrendingBlogs(prev => [...prev, ...uniqueNewBlogs]);
        } else {
            toast('No new unique blogs found.', { icon: 'ℹ️' });
        }
      } else {
        toast('No more trending blogs available.', { icon: 'ℹ️' });
      }
    } catch {
      toast.error("Failed to load more blogs.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Custom Component for Code Blocks (Replaces manual DOM manipulation)
  const CodeBlock = ({ children, ...props }) => {
    const handleCopy = () => {
        // Extract text content from the children (code)
        const codeText = String(children).replace(/\n$/, '');
        navigator.clipboard.writeText(codeText)
            .then(() => toast.success('Code copied!'))
            .catch(() => toast.error('Failed to copy.'));
    };

    return (
        <div style={{ position: 'relative' }}>
            <button className="copy-code-btn" onClick={handleCopy}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <code {...props}>{children}</code>
        </div>
    );
  };

  if (loading) return <div className="blog-view-page loading"><h2>Loading Blog...</h2></div>;
  
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
          <ArrowLeft size={18} /> Back
        </button>

        <div className="blog-layout-grid">
          <article className="blog-content">
            <header className="blog-header">
                <h1 className="blog-title">{blog.title}</h1>
                <div className="blog-meta">
                    <span><User size={14} /> By {blog.author || 'LegalMate AI'}</span>
                    <span><Calendar size={14} /> {formatDate(blog.createdAt)}</span>
                    <span><Clock size={14} /> {estimateReadTime(blog.content)}</span>
                </div>
            </header>
            <div className="blog-body">
              <ReactMarkdown 
                components={{
                    code: CodeBlock
                }}
              >
                {getContentWithoutTitle(blog.content)}
              </ReactMarkdown>
            </div>
          </article>

          <aside className="blog-sidebar">
            <div className="sidebar-header">
              <TrendingUp size={18} className="sidebar-icon" />
              <h3>Trending Topics</h3>
            </div>
            
            <div className="sidebar-list">
              {trendingBlogs.length > 0 ? (
                trendingBlogs.map((item) => (
                  <div key={item.id} className="sidebar-card" onClick={() => handleSidebarClick(item)}>
                    <h4 className="sidebar-card-title">{item.title}</h4>
                    <div className="sidebar-card-meta">
                      <span>{estimateReadTime(item.content)}</span>
                      <span>•</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-sidebar">No other blogs available</div>
              )}
            </div>

            <div className="sidebar-load-more-container">
                <button className="sidebar-load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
                    {loadingMore ? <><Loader2 className="spinner" size={14} /> Loading...</> : 'More'}
                </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogViewPage;