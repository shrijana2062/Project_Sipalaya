import React, { useState, useEffect } from 'react';
import { BookOpen, User, Calendar, Clock, Search } from 'lucide-react';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs');
      const data = await response.json();
      if (response.ok) {
        setBlogs(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const categories = ['All', 'Tech Trends', 'Career Advice', 'Study Guides'];

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchVal.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchVal.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container section animate-up">
      <h2 className="section-title">Knowledge & <span className="gradient-text">Career Blog</span></h2>
      <p className="section-subtitle">Stay up-to-date with industry trends, learning tips, and technology updates.</p>

      {/* Categories & Search Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="form-control" 
            style={{ paddingLeft: '2.5rem' }} 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No articles found matching your query.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredBlogs.map(blog => (
            <article key={blog.id} className="card glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden' }}>
              <img 
                src={blog.image} 
                alt={blog.title} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
              />
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: '1' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {blog.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {blog.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: '1.4' }}>{blog.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{blog.excerpt}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} /> {blog.author}</span>
                  <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{blog.category}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
