import React, { useMemo } from "react";
import { useCubeStore } from "../../store/useCubeStore";
import { isCubeSolved } from "../../utils/cubeLogic";

export const CubeStatus: React.FC = () => {
  const cubies = useCubeStore((state) => state.cubies);
  const historyCount = useCubeStore((state) => state.history.length);
  const solved = useMemo(() => isCubeSolved(cubies), [cubies]);

  const label = solved
    ? "Resolvido"
    : historyCount > 0
      ? `${historyCount} movimento${historyCount !== 1 ? "s" : ""}`
      : "Embaralhado";

  return (
    <div className={`cube-status ${solved ? "solved" : ""}`} aria-live="polite">
      <span className="cube-status-dot" />
      {label}
    </div>
  );
};
