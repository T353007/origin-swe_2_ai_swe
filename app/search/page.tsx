"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { SearchResult } from "@/types/content";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Update query when URL params change
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Search</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search lessons, modules, and content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </form>

        {query && (
          <div className="space-y-4">
            {isSearching ? (
              <p className="text-muted-foreground">Searching...</p>
            ) : (
              <p className="text-muted-foreground">
                {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
              </p>
            )}
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <Link key={result.id} href={result.url}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl">{result.title}</CardTitle>
                          <Badge variant="outline">{result.type}</Badge>
                        </div>
                        <CardDescription>{result.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No results found. Try different keywords.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!query && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Enter a search query to find lessons and modules.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

