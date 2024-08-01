import React from "react";
import { useDrop } from "react-dnd";

interface DropZoneProps {
  id: number;
  onDrop: (id: number, item: any) => void;
  children: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({ id, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item) => onDrop(id, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const childCount = React.Children.count(children);

  return (
    <div
      ref={drop}
      className="flex flex-col items-center justify-center"
      style={{
        width: "120px",
        height: "80px",
      }}
    >
      <div
        className={
          childCount === 1
            ? "flex h-full w-full justify-center"
            : "grid h-full w-full grid-cols-2 grid-rows-2 gap-0"
        }
      >
        {children}
      </div>
    </div>
  );
};

export default DropZone;
