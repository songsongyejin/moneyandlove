import React from "react";
import { useDrop } from "react-dnd";
import Card from "./PriorityCard2";

interface InitialZoneProps {
  id: number;
  cards: { id: string; number: number }[];
  onDrop: (id: number, item: any) => void;
}

const InitialZone: React.FC<InitialZoneProps> = ({ id, cards, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item) => onDrop(id, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return cards.length > 0 ? (
    <div
      ref={drop}
      className="absolute right-5 top-[38%] flex -translate-y-1/2 transform flex-col space-y-3 rounded-lg bg-white bg-opacity-80 px-6 py-6 shadow-lg"
    >
      {cards.map((card) => (
        <Card key={card.id} id={card.id} number={card.number} />
      ))}
    </div>
  ) : null;
};

export default InitialZone;
