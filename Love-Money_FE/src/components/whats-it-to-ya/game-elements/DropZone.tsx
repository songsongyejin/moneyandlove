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
        width: "125px",
        height: "90px",
      }}
    >
      {childCount === 0 && (
        <div
          className={`absolute flex items-center justify-center rounded-md ${
            isOver ? "bg-gray-200" : "bg-pink-200"
          }`}
          style={{
            width: "80px", // 카드 크기와 일치하도록 설정
            height: "80px", // 카드 크기와 일치하도록 설정
            pointerEvents: "none",
            transition: "background-color 0.3s",
          }}
        ></div>
      )}
      <div
        className={
          childCount === 1
            ? "flex h-full w-full items-center justify-center"
            : "grid h-full w-full grid-cols-2 grid-rows-2 gap-0"
        }
      >
        {children}
      </div>
    </div>
  );
};

export default DropZone;
