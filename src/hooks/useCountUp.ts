'use client';

import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  suffix = '',
  prefix = '',
  decimals = 0,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Intersection Observer to detect when element is visible
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Animation logic
  useEffect(() => {
    if (!isVisible || hasAnimated) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(end);
      setHasAnimated(true);
      return;
    }

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = start + (end - start) * easeOut;

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setHasAnimated(true);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, hasAnimated, start, end, duration, delay]);

  const formattedCount = `${prefix}${count.toFixed(decimals)}${suffix}`;

  return { count, formattedCount, ref, isVisible };
}
