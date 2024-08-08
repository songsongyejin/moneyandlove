import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "../game-elements/PriorityCard";
import DropZone from "../game-elements/DropZone";
import InitialZone from "../game-elements/InitialZone";
import backCard from "../../../assets/cards/white_heart_card_back.png";

interface CardType {
  id: string;
  number: number;
}

interface FirstPlayerPlayProps {
  onFinalize: (guessZones: CardType[][]) => void; // Callback to finalize guesses
  wordCards: { id: string; word: string; bgColor: string; textColor: string }[];
}

const initialZones = {
  initial: [1, 2, 3, 4, 5].map((num) => ({ id: `card-${num}`, number: num })),
  guessZones: Array.from({ length: 5 }, () => [] as CardType[]),
};

const FirstPlayerPlay: React.FC<FirstPlayerPlayProps> = ({
  onFinalize,
  wordCards,
}) => {
  const [zones, setZones] = useState(initialZones);

  // 카드 드롭 처리
  const handleDrop = (zoneIndex: number, item: CardType) => {
    setZones((prevZones) => {
      const newGuessZones = [...prevZones.guessZones];
      const initialIndex = prevZones.initial.findIndex(
        (card) => card.id === item.id
      );

      if (initialIndex !== -1) {
        // Initial Zone에서 Guess Zone으로 드롭된 경우
        const targetZone = newGuessZones[zoneIndex];

        // 기존 guess존에 카드가 있는 경우, 초기 위치로 되돌림
        if (targetZone.length > 0) {
          const [existingCard] = targetZone.splice(0, 1);
          prevZones.initial.push(existingCard); // 기존 카드를 초기 위치로 되돌림
        }

        targetZone.push(item);
        prevZones.initial.splice(initialIndex, 1);
      } else {
        // Guess Zone에서 다른 Guess Zone으로 이동한 경우
        const fromZoneIndex = newGuessZones.findIndex((zone) =>
          zone.some((card) => card.id === item.id)
        );

        if (fromZoneIndex !== -1) {
          const fromZone = newGuessZones[fromZoneIndex];
          const targetZone = newGuessZones[zoneIndex];

          const fromCardIndex = fromZone.findIndex(
            (card) => card.id === item.id
          );
          const [movedCard] = fromZone.splice(fromCardIndex, 1);

          // 기존 guess드롭존에 카드가 있는 경우, 교환
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
        guessZones: newGuessZones,
      };
    });
  };

  // 우선순위 카드들 초기화
  const handleReset = () => {
    setZones((prevZones) => {
      const allCards = [...prevZones.initial];
      prevZones.guessZones.forEach((zone) => {
        allCards.push(...zone);
      });
      // 원래 순서대로 정렬
      allCards.sort((a, b) => a.number - b.number);
      return {
        initial: allCards,
        guessZones: Array.from({ length: 5 }, () => [] as CardType[]),
      };
    });
  };

  // 예측 완료
  const handleFinalize = () => {
    const totalCardsInGuessZones = zones.guessZones.reduce(
      (sum, zone) => sum + zone.length,
      0
    );

    if (totalCardsInGuessZones < 5) {
      alert("모든 카드를 배치해주세요.");
      return;
    }

    onFinalize(zones.guessZones);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-full flex-col justify-end">
        {/* 게임 영역 */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            {/* 설명 영역 */}
            <div
              className="mx-auto mt-5 flex animate-fadeIn flex-col justify-center rounded-lg border-2 border-dashed border-custom-purple-color bg-white px-10 py-4 text-center"
              style={{
                fontFamily: "DungGeunMo",
                width: "780px",
              }}
            >
              <p className="mb-2 text-xl">당신의 차례입니다.</p>
              <p className="text-xl">
                {" "}
                다섯 개의 단어 카드를 보고 상대방의 우선순위를 맞춰보세요!{" "}
              </p>
            </div>
            {/* 버튼 두개: 초기화 버튼, 선택완료 버튼*/}
            <div className="mb-2 mt-6 flex animate-fadeIn space-x-10">
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
            {/* 플레이어 1이 정한 우선순위 카드들 뒷면으로 뒤집혀있는 영역 */}
            <div className="drop-table-container">
              <div
                className="drop-card-container mt-3 flex animate-fadeIn flex-row"
                style={{ gap: "1rem" }}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <img
                    key={index}
                    src={backCard}
                    alt="Card Back"
                    className="h-16 w-16"
                  />
                ))}
              </div>
            </div>
            {/* 다섯 개의 단어 카드 영역 */}
            <div className="table-container">
              <div className="word-card-container mt-2 flex animate-fadeIn flex-row space-x-8">
                {wordCards.map((card) => (
                  <div
                    key={card.id}
                    className="word-card border-3 flex flex-col items-center justify-center rounded-xl shadow-md"
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
                        {card.word}
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
            </div>

            {/* 드래그 앤 드롭 영역 */}
            <div className="drop-table-container animate-fadeIn rounded-lg py-4">
              <div className="drop-card-container flex justify-center space-x-11">
                {zones.guessZones.map((zone, index) => (
                  <DropZone key={index} id={index} onDrop={handleDrop}>
                    {zone.map((card) => (
                      <Card key={card.id} id={card.id} number={card.number} />
                    ))}
                  </DropZone>
                ))}
              </div>
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
