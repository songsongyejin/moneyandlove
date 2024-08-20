import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "../game-elements/PriorityCard2";
import DropZone from "../game-elements/DropZone";
import InitialZone from "../game-elements/InitialZone2";
import backCard from "../../../assets/cards/pink_heart_card_back.png";

interface CardType {
  id: string;
  number: number;
}

interface SecondPlayerPlayProps {
  onFinalize: (guessZones: CardType[][]) => void; // Callback to finalize guesses
  wordCards: { id: string; word: string; bgColor: string; textColor: string }[];
}

const initialZones = {
  initial: [1, 2, 3, 4, 5].map((num) => ({ id: `card-${num}`, number: num })),
  guessZones: Array.from({ length: 5 }, () => [] as CardType[]),
};

const SecondPlayerPlay: React.FC<SecondPlayerPlayProps> = ({
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
      <div className="relative flex h-screen flex-col items-center justify-between">
        {/* 설명 영역 */}
        <div
          className="absolute flex -translate-y-1/2 transform animate-fadeIn items-center whitespace-nowrap text-center text-white"
          style={{
            fontFamily: "DungGeunMo",
            top: "55%", // 텍스트 위치를 적절히 조정
          }}
        >
          <div>
            <p className="deep-3d-text mb-3 text-2xl">당신의 차례입니다.</p>
            <p className="deep-3d-text mb-3 text-2xl">
              다섯 개의 단어 카드를 보고 상대방의 우선순위를 맞춰보세요.
            </p>
            <p className="deep-3d-text text-2xl">
              오른쪽 하단에 있는 하트 카드를 드래그해서 카드 밑에 배치해주세요.{" "}
            </p>
          </div>
        </div>

        {/* 플레이어 1이 정한 우선순위 카드들 뒷면으로 뒤집혀있는 영역 */}
        <div
          className="drop-table-container animate-fadeIn"
          style={{ position: "fixed", bottom: "27%" }}
        >
          <div
            className="drop-card-container mt-3 flex animate-fadeIn flex-row"
            style={{ gap: "5.8rem", transform: "rotateX(70deg)" }}
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
        <div
          className="table-container"
          style={{ position: "fixed", bottom: "26%" }}
        >
          <div
            className="word-card-container flex flex-row"
            style={{ gap: "3rem" }}
          >
            {wordCards.map((card, index) => (
              <div
                key={card.id}
                className="word-card border-3 flex flex-col items-center justify-center rounded-xl shadow-md"
                style={{
                  backgroundColor: card.bgColor,
                  animationDelay: `${index * 0.1}s`, // Stagger the animation
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
        <div
          className="drop-table-container flex animate-fadeIn flex-col items-center"
          style={{ position: "fixed", bottom: "8%" }}
        >
          <div
            className="drop-card-container flex"
            style={{ gap: "6rem", transform: "rotateX(60deg)" }}
          >
            {zones.guessZones.map((zone, index) => (
              <DropZone key={index} id={index} onDrop={handleDrop}>
                {zone.map((card) => (
                  <Card key={card.id} id={card.id} number={card.number} />
                ))}
              </DropZone>
            ))}
          </div>
        </div>
        {/* 버튼 두개: 초기화 버튼, 선택완료 버튼*/}
        <div
          className="space-x-20"
          style={{
            position: "fixed",
            bottom: "5%",
          }}
        >
          <button onClick={handleReset} className="three-d-button reset">
            Reset
          </button>
          <button onClick={handleFinalize} className="three-d-button finalize">
            선택완료
          </button>
        </div>
        {/* 게임창 밖 우선순위 정하는 카드들 영역 */}
        <div className="animate-fadeIn">
          <InitialZone id={0} cards={zones.initial} onDrop={handleDrop} />
        </div>
      </div>
    </DndProvider>
  );
};

export default SecondPlayerPlay;
