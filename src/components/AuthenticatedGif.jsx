import { useEffect, useState } from "react";

// ExerciseDB's gifUrl requires the RapidAPI key header to load --
// a plain <img src> can't send headers, so we fetch it manually
// and convert the response into a local blob URL the <img> tag CAN use.
export default function AuthenticatedGif({ src, alt, className }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src) return;

    let objectUrl;
    setFailed(false);

    fetch(src, {
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load gif");
        return res.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(() => setFailed(true));

    // Clean up the blob URL when this image unmounts or src changes,
    // otherwise blob URLs pile up in memory
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (failed) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-800 text-slate-600 text-xs`}>
        No preview
      </div>
    );
  }

  if (!blobUrl) {
    return <div className={`${className} bg-slate-800 animate-pulse`} />;
  }

  return <img src={blobUrl} alt={alt} className={className} />;
}