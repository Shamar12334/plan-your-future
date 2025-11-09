const API_URL = "http://127.0.0.1:5000";

export async function register(username,password){
    const res =await fetch(`${API_URL}/auth/register`,{
        method : "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({username,password}),
    });
    return res.json();
}

export async function saveRoadmap(career_name, roadmap_data) {
  const res = await fetch(`${API_URL}/api/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ career_name, roadmap_data }),
  });

  if (!res.ok) throw new Error("Failed to save roadmap");
  return res.json();
}

export async function getRoadmap(career) {
  const res = await fetch(
    `${API_URL}/api/roadmap?career=${encodeURIComponent(career)}`,
    { credentials: "include" }
  );

  if (!res.ok) throw new Error("Failed to fetch roadmap");
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include", // include session cookies if used
  });
  return res.json();
}
export async function getMyRoadmaps() {
  const res = await fetch(`${API_URL}/api/my-roadmaps`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
}

