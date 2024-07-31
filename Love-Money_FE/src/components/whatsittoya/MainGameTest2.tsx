import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import first from "../../assets/cards/priority_first.svg";
import second from "../../assets/cards/priority_second.svg";
import third from "../../assets/cards/priority_third.svg";
import fourth from "../../assets/cards/priority_fourth.svg";
import fifth from "../../assets/cards/priority_fifth.svg";
import { FaHeart } from "react-icons/fa";

// 메인 게임 컴포넌트의 props 정의
interface MainGameProps {
  // 필요한 다른 속성들...
}

// 카드 객체의 인터페이스 정의
interface Card {
  id: string;
  image: string;
}

// 드래그 앤 드롭에서 사용할 아이템 타입을 정의
const ItemTypes = {
  CARD: "card",
};

// 드래그 가능한 카드 컴포넌트
const DraggableCard: React.FC<Card> = ({ id, image }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id, image },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="h-[70px] w-[70px] cursor-move"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img
        src={image}
        alt={`Card ${id}`}
        className="h-full w-full"
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
};

// 드랍 존 컴포넌트
const DropZone: React.FC<{
  id: string;
  onDrop: (item: Card, targetId: string) => void;
  droppedImage: string | null;
  currentPriorityId: string | null;
  onReturn: (item: Card) => void;
}> = ({ id, onDrop, droppedImage, currentPriorityId, onReturn }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: Card) => onDrop(item, id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className="flex items-center justify-center border-2 border-dashed border-gray-500"
      style={{
        width: "80px",
        height: "80px",
        backgroundColor: isOver ? "lightyellow" : "transparent",
      }}
    >
      {droppedImage ? (
        <DraggableCard id={currentPriorityId!} image={droppedImage} />
      ) : (
        <FaHeart className="text-gray-500 opacity-15" size={70} />
      )}
    </div>
  );
};

// 메인 게임 컴포넌트
const MainGame: React.FC<MainGameProps> = () => {
  const [droppedCards, setDroppedCards] = useState<{
    [key: string]: string | null;
  }>({
    word1: null,
    word2: null,
    word3: null,
    word4: null,
    word5: null,
  });

  const [priorityCardPositions, setPriorityCardPositions] = useState<{
    [key: string]: string | null;
  }>({
    card1: null,
    card2: null,
    card3: null,
    card4: null,
    card5: null,
  });

  const priorityCards: Card[] = [
    { id: "card1", image: first },
    { id: "card2", image: second },
    { id: "card3", image: third },
    { id: "card4", image: fourth },
    { id: "card5", image: fifth },
  ];

  const wordCards = [
    { id: "word1", text: "바다", color: "#2e8bab" },
    { id: "word2", text: "야구", color: "#bb7c7e" },
    { id: "word3", text: "맥주", color: "#bd9a5a" },
    { id: "word4", text: "피아노", color: "#58a279" },
    { id: "word5", text: "놀이공원", color: "#bd80ba" },
  ];

  const handleDrop = (item: Card, targetId: string) => {
    setDroppedCards((prev) => {
      const newDroppedCards = { ...prev };

      const previousTargetId = Object.keys(newDroppedCards).find(
        (key) => newDroppedCards[key] === item.image
      );
      if (previousTargetId) {
        newDroppedCards[previousTargetId] = null;
      }

      const cardInTarget = newDroppedCards[targetId];
      if (cardInTarget) {
        const cardInTargetId = priorityCards.find(
          (c) => c.image === cardInTarget
        )?.id;
        setPriorityCardPositions((prev) => ({
          ...prev,
          [cardInTargetId!]: null,
        }));
      }

      newDroppedCards[targetId] = item.image;

      return newDroppedCards;
    });

    setPriorityCardPositions((prev) => {
      const newPositions = { ...prev };
      const previousPosition = Object.keys(newPositions).find(
        (key) => newPositions[key] === item.id
      );
      if (previousPosition) {
        newPositions[previousPosition] = null;
      }

      newPositions[item.id] = targetId;

      return newPositions;
    });
  };

  const handleReturn = (item: Card) => {
    setPriorityCardPositions((prev) => {
      const newPositions = { ...prev };
      const dropZoneId = Object.keys(droppedCards).find(
        (key) => droppedCards[key] === item.image
      );
      if (dropZoneId) {
        newPositions[item.id] = null;
        setDroppedCards((prevDropped) => ({
          ...prevDropped,
          [dropZoneId]: null,
        }));
      }
      return newPositions;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-full items-center justify-center">
        <div className="relative flex h-[620px] w-[900px] flex-col rounded-[20px] bg-[#F0E9F6]">
          <div className="absolute -top-5 left-1/2 flex h-[50px] w-[250px] -translate-x-1/2 items-center justify-center rounded-3xl bg-[#8B6CAC]">
            <h1
              className="text-xl text-white"
              style={{ fontFamily: "DNFBitBitv2" }}
            >
              What's it to ya
            </h1>
          </div>
          <div className="mt-4 flex flex-1 flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div
                className="mx-auto flex flex-col justify-center rounded-lg border-2 border-dashed border-custom-purple-color bg-white px-10 py-4 text-center"
                style={{
                  fontFamily: "DungGeunMo",
                  width: "700px",
                }}
              >
                <p className="mb-2 text-2xl">당신이 선입니다!</p>
                <p className="text-2xl">
                  다섯 개의 단어 카드를 보고 우선순위를 정해주세요
                </p>
              </div>
              <div className="card-container mt-8 flex flex-row space-x-6">
                {wordCards.map((card) => (
                  <div
                    key={card.id}
                    className="border-3 flex flex-col items-center justify-center rounded-xl p-4 shadow-2xl"
                    style={{
                      width: "120px",
                      height: "160px",
                      backgroundColor: card.color,
                    }}
                  >
                    <p
                      className="text-sm"
                      style={{ fontFamily: "DungGeunMo", color: "white" }}
                    >
                      MONEY&LOVE
                    </p>
                    <p
                      className="mb-14 mt-11 text-xl text-white"
                      style={{ fontFamily: "DungGeunMo" }}
                    >
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-center space-x-16">
                {wordCards.map((card) => (
                  <DropZone
                    key={card.id}
                    id={card.id}
                    onDrop={handleDrop}
                    droppedImage={droppedCards[card.id]}
                    currentPriorityId={
                      (droppedCards[card.id] &&
                        priorityCards.find(
                          (c) => c.image === droppedCards[card.id]
                        )?.id) ||
                      null
                    }
                    onReturn={handleReturn}
                  />
                ))}
              </div>
              <div className="mt-5 flex justify-center space-x-16">
                {wordCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <FaHeart className="text-gray-500 opacity-0" size={70} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-5 top-[38%] flex -translate-y-1/2 transform flex-col space-y-3 rounded-lg bg-white bg-opacity-80 px-10 py-6 shadow-lg">
          {priorityCards.map((card) =>
            !priorityCardPositions[card.id] ? (
              <DraggableCard key={card.id} id={card.id} image={card.image} />
            ) : (
              <div key={card.id} className="h-[70px] w-[70px]"></div>
            )
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default MainGame;
