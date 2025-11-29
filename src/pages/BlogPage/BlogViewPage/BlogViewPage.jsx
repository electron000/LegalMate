import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, BookOpen, ChevronDown } from 'lucide-react'; // Changed Icon
import ReactMarkdown from 'react-markdown';
import toast, { Toaster } from 'react-hot-toast';
import { fetchAllBlogs } from '../../../api';
import './BlogViewPage.css';

const BlogViewPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [blog, setBlog] = useState(null);
  const [sidebarBlogs, setSidebarBlogs] = useState([]); // Stores ALL available sidebar blogs
  const [visibleCount, setVisibleCount] = useState(5); // Controls how many are shown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Reset visible count when switching blogs
  useEffect(() => {
    setVisibleCount(5);
  }, [blogId]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      // 1. Check if data was passed via Router State
      if (location.state?.blog) {
        setBlog(location.state.blog);
        
        let allContext = location.state.allBlogsContext || [];
        
        // If context wasn't passed, we might need to fetch to populate the sidebar properly
        // However, if we have location.state.trendingBlogs, we use that temporarily, 
        // but ideally we want the FULL list now.
        if (allContext.length === 0 && location.state.trendingBlogs) {
             allContext = location.state.trendingBlogs;
        }

        // Filter out the current blog
        const others = allContext.filter(b => String(b.id) !== String(location.state.blog.id));
        
        // If we have a decent amount of data from state, use it
        if (others.length > 0) {
            setSidebarBlogs(others);
            setLoading(false);
            return;
        }
        // If we don't have enough data in state, fall through to fetch
      }

      // 2. Fallback: Fetch ALL blogs
      try {
        const allBlogs = await fetchAllBlogs();
        
        const foundBlog = allBlogs.find(b => String(b.id) === String(blogId));
        
        if (!foundBlog) {
            throw new Error("Blog not found.");
        }

        setBlog(foundBlog);
        
        // Set Sidebar to include ALL other blogs
        const others = allBlogs.filter(b => String(b.id) !== String(blogId));
        setSidebarBlogs(others);

      } catch (err) {
        console.error(err);
        setError('Blog could not be loaded.');
      } finally {
        setLoading(false);
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
    // Pass the full sidebar context so we don't re-fetch on the next page
    navigate(`/blogs/${clickedBlog.id}`, { 
      state: { 
        blog: clickedBlog, 
        allBlogsContext: [...sidebarBlogs, blog] // Pass current + sidebar as new context
      } 
    });
    window.scrollTo(0, 0);
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const CodeBlock = ({ children, ...props }) => {
    const handleCopy = () => {
        const codeText = String(children).replace(/\n$/, '');
        navigator.clipboard.writeText(codeText)
            .then(() => toast.success('Code copied!'))
            .catch(() => toast.error('Failed to copy.'));
    };
    return (
        <div style={{ position: 'relative' }}>
            <button className="copy-code-btn" onClick={handleCopy}>
                 Copy
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
                    <span><User size={14} /> By LegalMate AI</span>
                    <span><Calendar size={14} /> {formatDate(blog.createdAt)}</span>
                    <span><Clock size={14} /> {estimateReadTime(blog.content)}</span>
                </div>
            </header>
            <div className="blog-body">
              <ReactMarkdown components={{ code: CodeBlock }}>
                {getContentWithoutTitle(blog.content)}
              </ReactMarkdown>
            </div>
          </article>

          <aside className="blog-sidebar">
            <div className="blog-sidebar-header">
              <BookOpen size={18} className="sidebar-icon" />
              <h3>More Blogs</h3>
            </div>
            
            <div className="sidebar-list">
              {sidebarBlogs.length > 0 ? (
                <>
                    {/* Render slice based on visibleCount */}
                    {sidebarBlogs.slice(0, visibleCount).map((item) => (
                      <div key={item.id} className="sidebar-card" onClick={() => handleSidebarClick(item)}>
                        <h4 className="sidebar-card-title">{item.title}</h4>
                        <div className="sidebar-card-meta">
                          <span>{estimateReadTime(item.content)}</span>
                          <span>•</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                    ))}

                    {/* Show More Button if there are more blogs to show */}
                    {visibleCount < sidebarBlogs.length && (
                        <button className="sidebar-show-more-btn" onClick={handleShowMore}>
                            Show More <ChevronDown size={14} />
                        </button>
                    )}
                </>
              ) : (
                <div className="empty-sidebar">No other blogs available</div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogViewPage;