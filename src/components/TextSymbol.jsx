import { DRAWING_SCALE } from "../const";

const TextSymbol = ({
  symbol,
  marginLeft = 5,
  marginTop = -2,
  size = 45,
  marginRight = 0,
}) => {
  return (
    <img
      src={`/symbols/${symbol}.svg`}
      className="inline-block"
      style={{
        height: DRAWING_SCALE * size + "px",
        marginTop: marginTop + "px",
        marginLeft: marginLeft + "px",
        marginRight: marginRight + "px",
      }}
    ></img>
  );
};

export default TextSymbol;
