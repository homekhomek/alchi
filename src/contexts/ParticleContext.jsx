import { createContext, useContext, useState } from "react";
import { BOUNCE_TRANSITION } from "../const";
import { sleep } from "../helpers/helper";
import Particle from "../components/Particle";

const ParticleContext = createContext();

export const ParticleProvider = ({ children }) => {
  const [particles, setParticles] = useState([]);

  const refreshParticles = () => {
    setParticles((prevParticles) => [...prevParticles]);
  };

  const addParticle = async ({
    startPos,
    endPos,
    img,
    size,
    time = 1000,
    opacityTime = 750,
    opacityDuration = 250,
    transition = "1s ease",
    opacityTransition = ".25s linear",
    startRot = 0,
    endRot = 0,
  }) => {
    const newParticle = {
      startPos: startPos,
      endPos: endPos,
      startRot: startRot,
      endRot: endRot,
      img: img,
      size: size,
      time: time,
      opacity: "0",
      start: Date.now(),
      opacityTime: opacityTime,
      opacityDuration: opacityDuration,
      transition: transition,
      opacityTransition: opacityTransition,
    };

    setParticles((prevParticles) => {
      return [...prevParticles, newParticle].filter(
        (p) =>
          Date.now() - p.start <
          Math.max(p.opacityTime + p.opacityDuration, p.time)
      );
    });
  };

  return (
    <ParticleContext.Provider value={{ particles: particles, addParticle }}>
      {particles.map((p, pIndex) => (
        <Particle key={p.start} p={p} />
      ))}
      {children}
    </ParticleContext.Provider>
  );
};

export const useParticles = () => useContext(ParticleContext);
