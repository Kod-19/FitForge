import { useEffect, useRef, useState } from "react";

// Only loads/renders the GIF once its card scrolls into view.
// Keeps off-screen GIFs from decoding and animating in the background,
// which is what was causing the page-wide jank with ~20 GIFs at once.
export default function LazyExerciseGif({ src, alt, className }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // only need to trigger once
        }
      },
      { rootMargin: "100px" } // start loading slightly before it's fully on screen
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <img src={src} alt={alt} decoding="async" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-slate-800 animate-pulse" />
      )}
    </div>
  );
}