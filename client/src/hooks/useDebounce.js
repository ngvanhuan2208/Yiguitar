import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * Giúp trì hoãn việc cập nhật giá trị (thường dùng cho search input)
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
