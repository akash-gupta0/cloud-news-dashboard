// src/components/Dashboard/Dashboard.jsx
"use client";

import { useState, useEffect } from 'react';
import { Search, RefreshCcw, Filter } from 'lucide-react';
import { NewsCard } from './NewsCard';
import { Header } from '../layout/Header';
import { fetchTechNews } from '@/utils/newsApi';

const categories = [
  { id: 'all', label: 'All News' },
  { id: 'devops', label: 'DevOps' },
  { id: 'cloud', label: 'Cloud Computing' },
  { id: 'kubernetes', label: 'Kubernetes' },
  { id: 'security', label: 'Security' },
  { id: 'automation', label: 'Automation' }
];

export const Dashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const articles = await fetchTechNews();
      setNews(articles);
      setError(null);
    } catch (err) {
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filterNews = (article) => {
    const matchesSearch = (
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesCategory = selectedCategory === 'all' || (
      (selectedCategory === 'devops' && article.title.toLowerCase().includes('devops')) ||
      (selectedCategory === 'cloud' && article.title.toLowerCase().includes('cloud')) ||
      (selectedCategory === 'kubernetes' && article.title.toLowerCase().includes('kubernetes')) ||
      (selectedCategory === 'security' && article.title.toLowerCase().includes('security')) ||
      (selectedCategory === 'automation' && article.title.toLowerCase().includes('automation'))
    );

    return matchesSearch && matchesCategory;
  };

  const filteredNews = news.filter(filterNews);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-6">
          {/* Search and Refresh */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search news..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchNews}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCcw className={loading ? 'animate-spin' : ''} size={20} />
              {loading ? 'Refreshing...' : 'Refresh Now'}
            </button>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter size={20} className="text-gray-500 flex-shrink-0" />
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Fetching latest updates...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid gap-6">
            {filteredNews.map((article, index) => (
              <NewsCard key={article.url + index} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No news found matching your criteria
          </div>
        )}
      </main>
    </div>
  );
};