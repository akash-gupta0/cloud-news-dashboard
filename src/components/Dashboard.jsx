"use client";

import React, { useState, useEffect } from 'react';
import { Search, RefreshCcw, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NewsCard = ({ title, description, source, date, url }) => (
  <Card className="mb-4 hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
      <div className="text-sm text-gray-500">
        {source} • {new Date(date).toLocaleDateString()}
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="text-blue-600 hover:text-blue-800 font-medium">
        Read More
      </button>
    </CardContent>
  </Card>
);

const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

  // Mock news data
  const mockNews = [
    {
      id: 1,
      title: 'AWS Launches New Serverless Computing Service',
      description: 'Amazon Web Services introduces a revolutionary serverless computing platform...',
      source: 'AWS News',
      date: '2025-01-09',
      provider: 'AWS',
      category: 'Cloud Computing'
    },
    {
      id: 2,
      title: 'Google Cloud Enhances Security Features',
      description: 'New security features launched for Google Cloud Platform users...',
      source: 'Google Cloud Blog',
      date: '2025-01-10',
      provider: 'Google Cloud',
      category: 'Security'
    },
    {
      id: 3,
      title: 'Azure DevOps Introduces New Pipeline Features',
      description: 'Microsoft Azure DevOps releases new pipeline capabilities...',
      source: 'Azure Updates',
      date: '2025-01-08',
      provider: 'Azure',
      category: 'DevOps'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const filters = ['All', 'Cloud Computing', 'DevOps', 'Security', 'Kubernetes'];
  const providers = ['All Providers', 'AWS', 'Google Cloud', 'Azure'];

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cloud & DevOps News</h1>
          <p className="text-gray-600">Stay updated with the latest in cloud technology and DevOps</p>
        </header>

        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="appearance-none bg-white px-4 py-2 pr-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {providers.map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <button
            onClick={() => setLoading(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCcw size={20} />
            Refresh
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

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading latest news...</p>
          </div>
        ) : (
          <div>
            {filteredNews.map(item => (
              <NewsCard
                key={item.id}
                title={item.title}
                description={item.description}
                source={item.source}
                date={item.date}
                url="#"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;