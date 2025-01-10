// src/components/Dashboard/NewsCard.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Calendar, Clock } from 'lucide-react';

export const NewsCard = ({ article }) => {
  const { title, description, source, publishedAt, url } = article;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 3600) {
      return `${Math.floor(diff / 60)} minutes ago`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            {formatDate(publishedAt)}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {new Date(publishedAt).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </div>
        </div>
        <CardTitle className="text-lg font-medium group">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-start gap-2 hover:text-blue-600 transition-colors"
          >
            {title}
            <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </CardTitle>
        <div className="text-sm font-medium text-blue-600">
          {source.name}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description || 'No description available'}
        </p>
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full"
        >
          Read Full Article 
          <ExternalLink size={16} />
        </a>
      </CardContent>
    </Card>
  );
};