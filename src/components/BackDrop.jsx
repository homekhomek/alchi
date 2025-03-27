import { BOUNCE_TRANSITION, DRAWING_SCALE, INNER_WIDTH } from "../const";

const BackDrop = ({ name }) => {
  return (
    <div
      className="absolute"
      style={{
        backgroundImage: "url(/backdrops/" + name + ".svg)",
        transition: BOUNCE_TRANSITION,
        left: INNER_WIDTH / 2 - DRAWING_SCALE * 750,
        bottom: "0",
        width: DRAWING_SCALE * 1500 + "px",
        height: DRAWING_SCALE * 3000 + "px",
        backgroundSize: "contain",
        zIndex: 1,
      }}
    ></div>
  );
};

export default BackDrop;
