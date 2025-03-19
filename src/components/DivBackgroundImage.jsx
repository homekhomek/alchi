import { useEffect, useMemo, useState } from "react";

const DivBackgroundImage = ({ className, style }) => {
  return (
    <div className={className + " absolute"} style={style}>
      Play - {matchData.playsLeft}
    </div>
  );
};

export default DivBackgroundImage;
