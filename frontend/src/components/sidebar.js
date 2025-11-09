import React, { useEffect, useState } from "react";
import { getMyRoadmaps } from "../api";

export default function Sidebar({ onSelect }) {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    async function fetchRoadmaps() {
      const data = await getMyRoadmaps();
      if (!data.error) setRoadmaps(data);
    }
    fetchRoadmaps();
  }, []);

  return (
    <div style={styles.sidebar}>
      <h3>My Saved Roadmaps</h3>
      <ul style={styles.list}>
        {roadmaps.length === 0 ? (
          <p>No saved roadmaps yet</p>
        ) : (
          roadmaps.map((r) => (
            <li
              key={r.id}
              onClick={() => onSelect(r)}
              style={styles.item}
            >
              {r.career_name}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "#f4f4f4",
    padding: "1rem",
    borderRight: "1px solid #ccc",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    cursor: "pointer",
    padding: "0.5rem 0",
    borderBottom: "1px solid #ddd",
  },
};
