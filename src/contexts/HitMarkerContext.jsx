import { createContext, useContext, useState } from "react";

const HitMarkerContext = createContext();

export const HitMarkerProvider = ({ children }) => {
  const [hitMarkers, setHitMarkers] = useState([]);

  const addHitMarker = (left, top, msg = "", dir = "up") => {
    setHitMarkers((prevMarkers) => {
      const newMarkers = [
        ...prevMarkers,
        { left, top, msg, dir, start: Date.now() },
      ].filter((hm) => Date.now() - hm.start < 1000);

      return newMarkers;
    });
  };

  return (
    <HitMarkerContext.Provider value={{ hitMarkers, addHitMarker }}>
      {hitMarkers.map((m, mIndex) => (
        <div
          key={m.start}
          className="float-up absolute select-none text-2xl text-center"
          style={{
            top: m.top + "px",
            left: m.left - 10 + "px",
            width: "20px",
            z: 1000,
          }}
        >
          {m.msg}
        </div>
      ))}
      {children}
    </HitMarkerContext.Provider>
  );
};

export const useHitMarkers = () => useContext(HitMarkerContext);
