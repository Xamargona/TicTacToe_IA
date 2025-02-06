import React from "react";
import "./Square.css";

interface SquareProps {
  values: string | null;
  onClick: () => void;
  style?: React.CSSProperties;
}

const Square: React.FC<SquareProps> = ({ values, onClick, style }) => {
  return (
      <button className="square" onClick={onClick} style={style}>
          {values}
      </button>
  );
}
export default Square;