'use client';

import { useCountUp } from '@/hooks/useCountUp';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  decimals?: number;
  className?: string;
  label?: string;
  labelClassName?: string;
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2000,
  delay = 0,
  decimals = 0,
  className = '',
  label,
  labelClassName = '',
}: AnimatedCounterProps) {
  const { formattedCount, ref } = useCountUp({
    end,
    suffix,
    prefix,
    duration,
    delay,
    decimals,
  });

  return (
    <div className="text-center">
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className={`block tabular-nums ${className}`}
      >
        {formattedCount}
      </span>
      {label && <span className={labelClassName}>{label}</span>}
    </div>
  );
}
