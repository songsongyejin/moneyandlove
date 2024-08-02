import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "../game-elements/PriorityCard";
import DropZone from "../game-elements/DropZone";
import InitialZone from "../game-elements/InitialZone";

interface CardType {
  id: string;
  number: number;
}

const initialZones = {
  initial: [1, 2, 3, 4, 5].map((num) => ({ id: `card-${num}`, number: num })),
  dropZones: Array.from({ length: 5 }, () => [] as CardType[]),
};

const FirstPlayerPlay: React.FC = () => {
  const [zones, setZones] = useState(initialZones);

  const wordCards = [
    { id: "word1", text: "바다", bgColor: "#88cce1", textColor: "#2e8bab" },
    { id: "word2", text: "야구", bgColor: "#ffbdbd", textColor: "#bb7c7e" },
    { id: "word3", text: "맥주", bgColor: "#FFDE59", textColor: "#bd9a5a" },
    { id: "word4", text: "피아노", bgColor: "#9edaae", textColor: "#58a279" },
    { id: "word5", text: "놀이공원", bgColor: "#f5b9f3", textColor: "#bd80ba" },
  ];

  // 우선순위 카드들 drop
  const handleDrop = (zoneIndex: number, item: CardType) => {
    setZones((prevZones) => {
      const newDropZones = [...prevZones.dropZones];
      const initialIndex = prevZones.initial.findIndex(
        (card) => card.id === item.id
      );

      if (initialIndex !== -1) {
        // Initial Zone에서 Drop Zone으로 드롭된 경우
        const targetZone = newDropZones[zoneIndex];

        // 기존 드롭존에 카드가 있는 경우, 초기 위치로 되돌림
        if (targetZone.length > 0) {
          const [existingCard] = targetZone.splice(0, 1);
          prevZones.initial.push(existingCard); // 기존 카드를 초기 위치로 되돌림
        }

        targetZone.push(item);
        prevZones.initial.splice(initialIndex, 1);
      } else {
        // Drop Zone에서 다른 Drop Zone으로 이동한 경우
        const fromZoneIndex = newDropZones.findIndex((zone) =>
          zone.some((card) => card.id === item.id)
        );

        if (fromZoneIndex !== -1) {
          const fromZone = newDropZones[fromZoneIndex];
          const targetZone = newDropZones[zoneIndex];

          const fromCardIndex = fromZone.findIndex(
            (card) => card.id === item.id
          );
          const [movedCard] = fromZone.splice(fromCardIndex, 1);

          // 기존 드롭존에 카드가 있는 경우, 교환
          if (targetZone.length > 0) {
            const [existingCard] = targetZone.splice(0, 1);
            fromZone.push(existingCard);
          }

          targetZone.push(movedCard);
        }
      }

      // 초기 위치 존 정렬
      const sortedInitial = [...prevZones.initial].sort(
        (a, b) => a.number - b.number
      );

      return {
        initial: sortedInitial,
        dropZones: newDropZones,
      };
    });
  };

  // 우선순위 카드들 초기화
  const handleReset = () => {
    setZones((prevZones) => {
      const allCards = [...prevZones.initial];
      prevZones.dropZones.forEach((zone) => {
        allCards.push(...zone);
      });
      // 원래 순서대로 정렬
      allCards.sort((a, b) => a.number - b.number);
      return {
        initial: allCards,
        dropZones: Array.from({ length: 5 }, () => [] as CardType[]),
      };
    });
  };

  // 최종 선택 완료
  const handleFinalize = () => {
    const totalCardsInDropZones = zones.dropZones.reduce(
      (sum, zone) => sum + zone.length,
      0
    );

    if (totalCardsInDropZones < 5) {
      alert("모든 우선순위를 정해주세요");
      return;
    }

    const selectedCards = zones.dropZones.map((zone) =>
      zone.map((card) => card.number)
    );
    console.log("최종 선택한 카드:", selectedCards);
    console.log("최종 선택한 카드:", selectedCards.flat());
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-full items-center justify-center">
        {/* 게임창 */}
        <div className="relative flex h-[620px] w-[900px] flex-col rounded-[20px] bg-[#F0E9F6]">
          {/* 제목 박스 */}
          <div className="absolute -top-5 left-1/2 flex h-[50px] w-[250px] -translate-x-1/2 items-center justify-center rounded-3xl bg-[#8B6CAC]">
            <h1
              className="text-xl text-white"
              style={{ fontFamily: "DNFBitBitv2" }}
            >
              What's it to ya
            </h1>
          </div>
          {/* 게임 영역 */}
          <div className="mt-1 flex flex-1 flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              {/* 설명 영역 */}
              <div
                className="mx-auto mt-5 flex animate-fadeIn flex-col justify-center rounded-lg border-2 border-dashed border-custom-purple-color bg-white px-10 py-4 text-center"
                style={{
                  fontFamily: "DungGeunMo",
                  width: "780px",
                }}
              >
                <p className="mb-2 text-xl">당신이 선입니다!</p>
                <p className="text-xl">
                  {" "}
                  다섯 개의 단어 카드를 보고 당신의 우선순위를 정해주세요{" "}
                </p>
              </div>
              {/* 다섯 개의 단어 카드 영역 */}
              <div className="card-container mt-8 flex animate-fadeIn flex-row space-x-8">
                {wordCards.map((card) => (
                  <div
                    key={card.id}
                    className="border-3 flex flex-col items-center justify-center rounded-xl shadow-md"
                    style={{
                      width: "135px",
                      height: "180px",
                      backgroundColor: card.bgColor,
                    }}
                  >
                    {/* 상단 영역 */}
                    <div className="h-12 w-full rounded-xl rounded-b-none"></div>
                    {/* 본문 영역 */}
                    <div className="flex w-full flex-1 flex-col items-center justify-center bg-white">
                      <p
                        className="text-2xl"
                        style={{
                          fontFamily: "DungGeunMo",
                          color: card.textColor,
                        }}
                      >
                        {card.text}
                      </p>
                    </div>

                    {/* 하단 영역 */}
                    <div className="flex h-12 w-full items-center justify-center rounded-xl rounded-t-none">
                      <p
                        className="text-base"
                        style={{ fontFamily: "DungGeunMo", color: "white" }}
                      >
                        MONEY & LOVE
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* 드래그 앤 드롭 영역 */}
              <div className="mt-2 animate-fadeIn rounded-lg py-4">
                <div className="flex justify-center space-x-11">
                  {zones.dropZones.map((zone, index) => (
                    <DropZone key={index} id={index} onDrop={handleDrop}>
                      {zone.map((card) => (
                        <Card key={card.id} id={card.id} number={card.number} />
                      ))}
                    </DropZone>
                  ))}
                </div>
              </div>
            </div>
            {/* 버튼 두개: 초기화 버튼, 선택완료 버튼*/}
            <div className="mb-2 mt-10 flex animate-fadeIn space-x-10">
              <button
                onClick={handleReset}
                className="rounded-lg bg-gray-400 px-6 py-3 text-2xl text-white"
                style={{ fontFamily: "DungGeunMo" }}
              >
                Reset
              </button>
              <button
                onClick={handleFinalize}
                className="rounded-lg bg-custom-purple-color px-4 py-3 text-xl text-white"
                style={{ fontFamily: "DungGeunMo" }}
              >
                선택완료
              </button>
            </div>
          </div>
        </div>
        {/* 게임창 밖 우선순위 정하는 카드들 영역*/}
        <div className="animate-fadeIn">
          <InitialZone id={0} cards={zones.initial} onDrop={handleDrop} />
        </div>
      </div>
    </DndProvider>
  );
};

export default FirstPlayerPlay;
