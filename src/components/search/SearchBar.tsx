"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  autoFocus?: boolean;
}

interface SearchSuggestion {
  id: string;
  title: string;
  slug: string;
  featuredImage?: string | null;
}

async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  if (!query || query.length < 2) return [];

  const response = await axios.get<SearchSuggestion[]>("/api/posts/suggestions", {
    params: { q: query, limit: 5 },
  });
  return response.data;
}

export function SearchBar({ initialQuery = "", onSearch, autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: () => getSearchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 1000,
  });

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Tìm kiếm ứng dụng, game..."
            className="pl-10 pr-10 h-12 text-base"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            autoFocus={autoFocus}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && query.length >= 2 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto shadow-lg">
          {isLoading && (
            <div className="p-4 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && suggestions && suggestions.length > 0 && (
            <div className="py-2">
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion.id}
                  href={`/post/${suggestion.slug}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                >
                  {suggestion.featuredImage ? (
                    <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={suggestion.featuredImage}
                        alt={suggestion.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{suggestion.title}</p>
                  </div>
                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}

          {!isLoading && suggestions && suggestions.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Không tìm thấy kết quả cho "{query}"
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
