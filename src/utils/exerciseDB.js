const BASE_URL = "https://exercisedb.p.rapidapi.com";

const headers = {
  "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};

// Fetches the fixed list of body part categories ExerciseDB supports
export async function getBodyPartList() {
  const res = await fetch(`${BASE_URL}/exercises/bodyPartList`, { headers });
  if (!res.ok) throw new Error("Failed to fetch body part list");
  return res.json();
}

// Fetches exercises for a specific body part
export async function getExercisesByBodyPart(bodyPart, limit = 20) {
  const res = await fetch(
    `${BASE_URL}/exercises/bodyPart/${bodyPart}?limit=${limit}`,
    { headers }
  );
  if (!res.ok) throw new Error("Failed to fetch exercises");
  return res.json();
}

// Fetches exercises matching a name search (e.g. "squat")
export async function searchExercisesByName(name, limit = 20) {
  const res = await fetch(
    `${BASE_URL}/exercises/name/${encodeURIComponent(name)}?limit=${limit}`,
    { headers }
  );
  if (!res.ok) throw new Error("Failed to search exercises");
  return res.json();
}

// Builds a direct, browser-loadable GIF URL for an exercise.
// Unlike the other endpoints, this one takes the API key as a query param
// instead of a header -- so it works in a plain <img src> with no fetch needed.
export function getExerciseImageUrl(exerciseId, resolution = 360) {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  return `${BASE_URL}/image?exerciseId=${exerciseId}&resolution=${resolution}&rapidapi-key=${apiKey}`;
}