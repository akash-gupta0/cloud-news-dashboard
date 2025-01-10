"use client";

import React, { useState, useEffect } from 'react';
import { Search, RefreshCcw, ChevronDown, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NewsCard = ({ title, description, source, date, url }) => (
  <Card className="mb-4 hover:shadow-lg transition-shadow bg-white">
    <CardHeader>
      <CardTitle className="text-lg font-medium group">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
        >
          {title}
          <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </CardTitle>
      <div className="text-sm text-gray-500">
        {source} • {new Date(date).toLocaleDateString()}
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 mb-4">{description}</p>
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        Read More 
        <ExternalLink size={16} />
      </a>
    </CardContent>
  </Card>
);

const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full mr-2 mb-2 transition-all ${
      active
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
    }`}
  >
    {label}
  </button>
);

const Dashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(['All']);
  const [selectedProvider, setSelectedProvider] = useState('All Providers');
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace this URL with your actual news API endpoint
      const response = await fetch('https://newsapi.org/v2/everything?' + new URLSearchParams({
        q: '(india OR indian) AND (cloud computing OR aws OR azure OR google cloud OR devops)',
        apiKey: '378e0ee40a884bf08e88a1788acb5b8d', // Replace with your NewsAPI key
        pageSize: 20,
        language: 'en',
        sortBy: 'publishedAt',
        domains: 'yourstory.com,inc42.com,economictimes.indiatimes.com,techcrunch.com,livemint.com,ndtv.com'

     }));
    
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      
      // Transform the API response to match our news format
      const transformedNews = data.articles.map((article, index) => ({
        id: index,
        title: article.title,
        description: article.description,
        source: article.source.name,
        date: article.publishedAt,
        url: article.url,
        provider: determineProvider(article.title), // Helper function to categorize news
        category: determineCategory(article.title) // Helper function to categorize news
      }));

      setNews(transformedNews);
    } catch (err) {
      setError('Failed to fetch news. Using mock data instead.');
      // Fallback to mock data if API fails
      setNews(mockNews);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to categorize news
  const determineProvider = (title) => {
    title = title.toLowerCase();
    if (title.includes('aws') || title.includes('amazon')) return 'AWS';
    if (title.includes('azure') || title.includes('microsoft')) return 'Azure';
    if (title.includes('google')) return 'Google Cloud';
    return 'Other';
  };

  const determineCategory = (title) => {
    title = title.toLowerCase();
    if (title.includes('kubernetes') || title.includes('container')) return 'Kubernetes';
    if (title.includes('security')) return 'Security';
    if (title.includes('devops')) return 'DevOps';
    return 'Cloud Computing';
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Mock news data for fallback
  const mockNews = [
    {
      id: 1,
      title: 'AWS Launches New Serverless Computing Service',
      description: 'Amazon Web Services introduces a revolutionary serverless computing platform that promises to transform how developers build and deploy applications in the cloud...',
      source: 'AWS News',
      date: '2025-01-09',
      url: 'https://aws.amazon.com/news',
      provider: 'AWS',
      category: 'Cloud Computing'
    },
    {
      id: 2,
      title: 'Google Cloud Enhances Security Features',
      description: 'Google Cloud Platform announces major security enhancements including advanced threat detection, improved encryption, and new compliance certifications...',
      source: 'Google Cloud Blog',
      date: '2025-01-10',
      url: 'https://cloud.google.com/blog',
      provider: 'Google Cloud',
      category: 'Security'
    },
    {
      id: 3,
      title: 'Azure DevOps Introduces New Pipeline Features',
      description: 'Microsoft Azure DevOps releases new pipeline capabilities to streamline CI/CD workflows and improve development team productivity...',
      source: 'Azure Updates',
      date: '2025-01-08',
      url: 'https://azure.microsoft.com/updates',
      provider: 'Azure',
      category: 'DevOps'
    }
  ];

  const filters = ['All', 'Cloud Computing', 'DevOps', 'Security', 'Kubernetes'];
  const providers = ['All Providers', 'AWS', 'Google Cloud', 'Azure', 'Other'];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilters.includes('All') || activeFilters.includes(item.category);
    const matchesProvider = selectedProvider === 'All Providers' || selectedProvider === item.provider;
    return matchesSearch && matchesFilter && matchesProvider;
  });

  const handleFilterClick = (filter) => {
    if (filter === 'All') {
      setActiveFilters(['All']);
    } else {
      const newFilters = activeFilters.includes('All') 
        ? [filter]
        : activeFilters.includes(filter)
          ? activeFilters.filter(f => f !== filter)
          : [...activeFilters, filter];
      setActiveFilters(newFilters.length ? newFilters : ['All']);
    }
  };

  const handleRefresh = () => {
    fetchNews();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Cloud & DevOps News</h1>
          <p className="text-xl text-gray-600">Stay updated with the latest in cloud technology and DevOps</p>
        </header>

        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative min-w-[200px]">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full appearance-none bg-white px-4 py-3 pr-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {providers.map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            {loading ? (
              <>
                <RefreshCcw className="animate-spin" size={20} />
                Loading...
              </>
            ) : (
              <>
                <RefreshCcw size={20} />
                Refresh
              </>
            )}
          </button>
        </div>

        <div className="mb-6">
          {filters.map(filter => (
            <FilterButton
              key={filter}
              label={filter}
              active={activeFilters.includes(filter)}
              onClick={() => handleFilterClick(filter)}
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading latest news...</p>
          </div>
        ) : (
          <div>
            {filteredNews.length > 0 ? (
              filteredNews.map(item => (
                <NewsCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  source={item.source}
                  date={item.date}
                  url={item.url}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No news found matching your criteria
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;