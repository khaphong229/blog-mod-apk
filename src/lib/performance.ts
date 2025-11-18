/**
 * Performance monitoring utilities for Next.js app
 */

// Measure and log Web Vitals
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === "production") {
    // Example: Send to Google Analytics
    if (window.gtag) {
      window.gtag("event", metric.name, {
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  }
}

// Performance marks for custom measurements
export const performanceMark = {
  start: (name: string) => {
    if (typeof window !== "undefined" && window.performance) {
      performance.mark(`${name}-start`);
    }
  },
  end: (name: string) => {
    if (typeof window !== "undefined" && window.performance) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name)[0];
      if (measure && process.env.NODE_ENV === "development") {
        console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
      }

      // Clean up marks
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);
    }
  },
};

// Image optimization helper
export const getOptimizedImageUrl = (url: string, width?: number) => {
  if (!url) return "";

  // If using external image service (Cloudinary, Imgix, etc.)
  // Add query params for optimization
  if (width) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}w=${width}&q=80&f=auto`;
  }

  return url;
};

// Lazy load images with IntersectionObserver
export const setupLazyLoading = () => {
  if (typeof window === "undefined") return;

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;

          if (src) {
            img.src = src;
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );

  // Observe all images with data-src attribute
  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
};

// Debounce utility for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Measure component render time
export function measureRenderTime(componentName: string) {
  return {
    onMount: () => performanceMark.start(componentName),
    onUnmount: () => performanceMark.end(componentName),
  };
}

// Cache utilities for better performance
export const cache = {
  set: (key: string, value: any, ttl: number = 3600000) => {
    if (typeof window === "undefined") return;

    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  get: <T = any>(key: string): T | null => {
    if (typeof window === "undefined") return null;

    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value as T;
    } catch {
      return null;
    }
  },

  remove: (key: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },

  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.clear();
  },
};

// Preload critical resources
export const preloadResource = (href: string, as: string) => {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Check network speed
export const getNetworkSpeed = (): "slow" | "fast" | "unknown" => {
  if (typeof navigator === "undefined" || !("connection" in navigator)) {
    return "unknown";
  }

  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType;

  if (effectiveType === "slow-2g" || effectiveType === "2g") {
    return "slow";
  }

  return "fast";
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
