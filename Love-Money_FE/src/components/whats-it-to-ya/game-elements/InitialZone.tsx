import React from "react";
import { useDrop } from "react-dnd";
import Card from "./PriorityCard";

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
      className="initial-zone-container absolute bottom-5 right-5"
    >
      <div className="initial-zone-cards flex flex-row space-x-1 rounded-lg bg-opacity-80 px-1 py-1 shadow-lg">
        {cards.map((card) => (
          <div key={card.id} className="initial-card">
            <Card key={card.id} id={card.id} number={card.number} />
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export default InitialZone;
