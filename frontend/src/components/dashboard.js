import React, { useEffect, useState } from "react";
import { getRoadmap, saveRoadmap, getMyRoadmaps } from "../api";

export default function Dashboard({ username }) {
  const [career, setCareer] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [message, setMessage] = useState("");
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);

  async function fetchSavedRoadmaps() {
    try {
      const data = await getMyRoadmaps();
      setSavedRoadmaps(data);
    } catch (err) {
      console.error("Failed to load saved roadmaps:", err);
    }
  }

  useEffect(() => {
    fetchSavedRoadmaps();
  }, []);

  async function handleGenerate() {
    const data = await getRoadmap(career);
    if (data.error) setMessage(data.error);
    else {
      setMessage("");
      setRoadmap(data);
    }
  }

  async function handleSave() {
    if (!roadmap) return;
    const res = await saveRoadmap(career, roadmap);
    setMessage(res.message);
    fetchSavedRoadmaps();
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Saved Roadmaps</h2>
        {savedRoadmaps.length > 0 ? (
          <ul className="saved-list">
            {savedRoadmaps.map((r) => (
              <li
                key={r.id}
                className="saved-item"
                onClick={() => {
                  setCareer(r.career_name);
                  setRoadmap(JSON.parse(r.roadmap_data));
                  setMessage("");
                }}
              >
                {r.career_name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No saved roadmaps yet.</p>
        )}
      </aside>

      {/* Main Section */}
      <main className="main-content">
        <h1>Hello, {username}</h1>
        <div className="career-input">
          <input
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            placeholder="Enter a career"
          />
          <button onClick={handleGenerate}>Generate</button>
        </div>

        {roadmap && (
          <div className="roadmap-display">
            <h3>{career}</h3>
            <p>{roadmap.Description}</p>
            {roadmap.roadmap.map((stage, i) => (
              <div key={i} className="roadmap-stage">
                <strong>{stage.stage}</strong>
                <ul>
                  {stage.actions.map((a, j) => (
                    <li key={j}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
            <button onClick={handleSave}>💾 Save this roadmap</button>
          </div>
        )}

        <p className="message">{message}</p>
      </main>
    </div>
  );
}
