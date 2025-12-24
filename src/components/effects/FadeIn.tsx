'use client';

import { useInView } from '@/hooks/useInView';
import { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface FadeInProps<T extends ElementType = 'div'> {
  children: ReactNode;
  as?: T;
  delay?: number;
  duration?: number;
  direction?: Direction;
  distance?: number;
  className?: string;
  threshold?: number;
}

const directionMap: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 30 },
  down: { x: 0, y: -30 },
  left: { x: 30, y: 0 },
  right: { x: -30, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * FadeIn component - Reveals content with animation when entering viewport
 */
export function FadeIn<T extends ElementType = 'div'>({
  children,
  as,
  delay = 0,
  duration = 800,
  direction = 'up',
  distance,
  className = '',
  threshold = 0.1,
  ...props
}: FadeInProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof FadeInProps<T>>) {
  const { ref, isVisible } = useInView({ threshold });
  const Component = as || 'div';

  const { x, y } = directionMap[direction];
  const translateX = distance
    ? direction === 'left'
      ? distance
      : direction === 'right'
        ? -distance
        : 0
    : x;
  const translateY = distance
    ? direction === 'up'
      ? distance
      : direction === 'down'
        ? -distance
        : 0
    : y;

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translate3d(0, 0, 0)'
          : `translate3d(${translateX}px, ${translateY}px, 0)`,
        transition: `opacity ${duration}ms cubic-bezier(0.5, 0, 0, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.5, 0, 0, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Stagger container - Automatically applies delays to children
 */
interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function Stagger({ children, staggerDelay = 100, className = '' }: StaggerProps) {
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 800ms cubic-bezier(0.5, 0, 0, 1) ${index * staggerDelay}ms, transform 800ms cubic-bezier(0.5, 0, 0, 1) ${index * staggerDelay}ms`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

export default FadeIn;
