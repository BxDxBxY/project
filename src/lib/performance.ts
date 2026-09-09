/**
 * Performance monitoring utilities
 */

export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  /**
   * Start measuring performance for a specific operation
   */
  static start(label: string): void {
    if (typeof window !== "undefined" && window.performance) {
      this.marks.set(label, performance.now());
    }
  }

  /**
   * End measuring and log the duration
   */
  static end(label: string): number | null {
    if (typeof window !== "undefined" && window.performance) {
      const startTime = this.marks.get(label);
      if (startTime) {
        const duration = performance.now() - startTime;
        this.marks.delete(label);
        return duration;
      }
    }
    return null;
  }

  /**
   * Measure Web Vitals
   */
  static measureWebVitals(): void {
    if (typeof window === "undefined") return;

    // Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          list.getEntries();
          // LCP should be under 2.5s for good performance
          // Can track entries if needed for analytics
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        // Observer not supported
      }
    }
  }
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImage(img: HTMLImageElement): void {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          const src = image.dataset.src;
          if (src) {
            image.src = src;
            image.removeAttribute("data-src");
          }
          observer.unobserve(image);
        }
      });
    });
    observer.observe(img);
  } else {
    // Fallback for browsers without IntersectionObserver
    const src = img.dataset.src;
    if (src) {
      img.src = src;
    }
  }
}

/**
 * Prefetch a URL for faster navigation
 */
export function prefetchURL(url: string): void {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
