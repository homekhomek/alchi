import TextSymbol from "./TextSymbol";

const SymbolText = ({
  msg,
  marginLeft = 5,
  marginTop = -2,
  size = 45,
  marginRight = 0,
}) => {
  const renderText = (text) => {
    return text.split(/(\[.*?\])/g).map((part, index) => {
      const match = part.match(/^\[(.*?)\]$/);
      return match ? (
        <TextSymbol
          key={index}
          symbol={match[1]}
          marginLeft={marginLeft}
          marginRight={marginRight}
          marginTop={marginTop}
          size={size}
        />
      ) : (
        part
      );
    });
  };

  return <span>{renderText(msg)}</span>;
};

export default SymbolText;
