const NEWS_SOURCES = [
  'techcrunch.com',
  'thenewstack.io',
  'devops.com',
  'infoq.com',
  'containerjournal.com',
  'devclass.com',
  'cloudblog.withgoogle.com',
  'aws.amazon.com/blogs',
  'azure.microsoft.com/blog'
].join(',');

export async function fetchTechNews() {
  const response = await fetch('https://newsapi.org/v2/everything?' + new URLSearchParams({
    q: '(devops OR "cloud computing" OR kubernetes OR "cloud native" OR microservices OR containerization OR "continuous integration" OR "continuous deployment" OR "infrastructure as code")',
    domains: NEWS_SOURCES,
    apiKey: '378e0ee40a884bf08e88a1788acb5b8d', // Directly added API key
    pageSize: 30,
    language: 'en',
    sortBy: 'publishedAt'
  }));

  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await response.json();
  return data.articles;
}
