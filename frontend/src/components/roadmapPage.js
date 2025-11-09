import React, { useState } from "react";
import Sidebar from "./sidebar";

export default function RoadmapPage() {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onSelect={(r) => setSelectedRoadmap(r)} />
      <div style={{ flex: 1, padding: "2rem" }}>
        {selectedRoadmap ? (
          <div>
            <h2>{selectedRoadmap.career_name}</h2>
            <pre>{JSON.stringify(JSON.parse(selectedRoadmap.roadmap_data), null, 2)}</pre>
          </div>
        ) : (
          <h3>Select a roadmap from the sidebar</h3>
        )}
      </div>
    </div>
  );
}
