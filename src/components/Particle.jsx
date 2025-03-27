import { useEffect, useMemo, useState } from "react";

const Particle = ({ p }) => {
  const [animate, setAnimate] = useState(false);
  const [opacity, setOpacity] = useState("1");

  useEffect(() => {
    // Trigger the animation on the next animation frame
    const animationFrame = requestAnimationFrame(() => setAnimate(true));
    var opacityTimeout = setTimeout(() => {
      setOpacity("0");
    }, p.opacityTime);
    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(opacityTimeout);
    };
  }, []);
  return (
    <div
      key={p.start}
      className="absolute select-none pointer-events-none"
      style={{
        top: (animate ? p.endPos.y : p.startPos.y) + "px",
        left: (animate ? p.endPos.x : p.startPos.x) + "px",
        transition:
          "left " +
          p.transition +
          ", top " +
          p.transition +
          ", transform " +
          p.transition +
          ", opacity " +
          p.opacityTransition,
        zIndex: 99999,
        transform: "rotate(" + (animate ? p.endRot : p.startRot) + "deg)",
        width: typeof p.size == "object" ? p.size.width : p.size,
        height: typeof p.size == "object" ? p.size.height : p.size,
        backgroundImage: `url(${p.img}.svg)`,
        backgroundSize: "contain",
        opacity: animate ? opacity : "0",
      }}
    ></div>
  );
};

export default Particle;
