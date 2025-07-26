import { useState, useEffect } from 'react';

const throttle = (func, delay) => {
  let inProgress = false;
  return (...args) => {
    if (inProgress) {
      return;
    }
    inProgress = true;
    setTimeout(() => {
      func(...args);
      inProgress = false;
    }, delay);
  };
};

export function useScrollPosition(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    const throttledHandleScroll = throttle(handleScroll, 100); 

    window.addEventListener('scroll', throttledHandleScroll);

    handleScroll(); 

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [threshold]);

  return scrolled;
}