import React from "react";
import { useDrag } from "react-dnd";
import first from "../../assets/cards/priority_first.svg";
import second from "../../assets/cards/priority_second.svg";
import third from "../../assets/cards/priority_third.svg";
import fourth from "../../assets/cards/priority_fourth.svg";
import fifth from "../../assets/cards/priority_fifth.svg";

interface CardProps {
  id: string;
  number: number;
}

const Card: React.FC<CardProps> = ({ id, number }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id, number },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getImage = (number: number) => {
    switch (number) {
      case 1:
        return first;
      case 2:
        return second;
      case 3:
        return third;
      case 4:
        return fourth;
      case 5:
        return fifth;
      default:
        return "";
    }
  };

  return (
    <div
      ref={drag}
      className={`align-center ${isDragging ? "opacity-50" : "opacity-100"} flex h-20 w-20 justify-center rounded-md border-2 border-white bg-pink-200 bg-opacity-50 p-2 shadow-lg`}
      style={{
        cursor: "move",
      }}
    >
      <img
        src={getImage(number)}
        alt={`Card ${number}`}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </div>
  );
};

export default Card;
