import React, { useState, useEffect } from "react";
import { Session } from "openvidu-browser";
import cardBack from "../../assets/cards/card_back.svg";
import cardFirstTurn from "../../assets/cards/first_turn_card.png";
import cardSecondTurn from "../../assets/cards/second_turn_card.png";

interface SelectTurnProps {
  onTurnSelected: (cardIndex: number) => void;
  session: Session;
}

const SelectTurn: React.FC<SelectTurnProps> = ({ onTurnSelected, session }) => {
  // 카드의 뒤집힘 상태를 관리하는 state
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  // 카드가 선택되었는지 여부를 관리하는 state
  const [isCardSelected, setIsCardSelected] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [mySelectedCard, setMySelectedCard] = useState<number | null>(null);
  const [shuffledCards, setShuffledCards] = useState<number[]>([]);

  // 카드를 랜덤하게 섞는 함수
  const shuffleCards = () => {
    const cards = [1, 2];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  };

  // 컴포넌트가 처음 렌더링될 때 카드를 섞음
  useEffect(() => {
    setShuffledCards(shuffleCards());
  }, []);

  // 카드 클릭 핸들러
  // 사용자가 선, 후 카드 선택했을 때
  const handleCardClick = (cardIndex: number) => {
    if (!isCardSelected && !selectedCards.includes(cardIndex)) {
      setMySelectedCard(cardIndex);
      setFlippedCard(cardIndex); // 카드가 뒤집어지도록 함
      setIsCardSelected(true); // 카드선택완료상태로 변경
      // 카드 선택번호가 1이면 선, 2이면 후인거임
      console.log(`내가 선택한 카드번호 ${cardIndex}`);

      // 선택한 카드를 세션에 signal로 전송
      session
        .signal({
          data: JSON.stringify({ cardIndex }),
          to: [],
          type: "cardSelected",
        })
        .then(() => {
          console.log(`카드 선택 신호 전송 완료: ${cardIndex}`); // 신호 전송 성공 확인
        })
        .catch((error) => {
          console.error(`카드 선택 신호 전송 실패: ${error.message}`); // 신호 전송 실패 시 오류 확인
        });
      setSelectedCards((prev) => [...prev, cardIndex]);
    }
  };

  useEffect(() => {
    session.on("signal:cardSelected", (event: any) => {
      const { cardIndex } = JSON.parse(event.data);
      console.log(`수신한 카드번호: ${cardIndex}`);
      setSelectedCards((prev) => [...prev, cardIndex]);
    });
  }, [session]);

  useEffect(() => {
    console.log(`현재 선택된 카드들: ${selectedCards}`);
    const uniqueCards = new Set(selectedCards);

    if (uniqueCards.size === 2 && mySelectedCard !== null) {
      console.log("모든 플레이어가 선택 완료, 다음 페이지로 넘어갑니다.");
      const timer = setTimeout(() => {
        setFlippedCard(mySelectedCard);
        onTurnSelected(mySelectedCard);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [selectedCards, mySelectedCard, onTurnSelected]);

  return (
    <div className="relative flex h-screen flex-col items-center">
      {/* 설명 영역 */}
      <div
        className="absolute -translate-y-1/2 transform animate-fadeIn whitespace-nowrap text-center text-white"
        style={{
          fontFamily: "DungGeunMo",
          top: "65%", // 텍스트 위치를 적절히 조정
        }}
      >
        <p
          className="mb-3 text-6xl"
          style={{
            textShadow: `
                1px 1px 2px #000, 2px 2px 4px #000,
                3px 3px 8px rgba(0, 0, 0, 0.7),
                4px 4px 12px rgba(0, 0, 0, 0.7),
                5px 5px 16px rgba(0, 0, 0, 0.7),
                6px 6px 20px rgba(0, 0, 0, 0.7)
              `, // 여러 겹의 그림자를 추가하여 깊이감과 입체감을 만듦
            transform: "perspective(500px) rotateX(15deg)", // 더 강한 원근감을 주기 위해 각도 조정
            fontWeight: "bold",
          }}
        >
          왓츠잇투야 게임이 곧 시작됩니다!
        </p>
        <p
          className="text-2xl"
          style={{
            textShadow: `
                1px 1px 2px #000, 2px 2px 4px #000,
                3px 3px 8px rgba(0, 0, 0, 0.7),
                4px 4px 12px rgba(0, 0, 0, 0.7),
                5px 5px 16px rgba(0, 0, 0, 0.7),
                6px 6px 20px rgba(0, 0, 0, 0.7)
              `, // 여러 겹의 그림자를 추가하여 깊이감과 입체감을 만듦
            transform: "perspective(500px) rotateX(15deg)", // 더 강한 원근감을 주기 위해 각도 조정
            fontWeight: "bold",
          }}
        >
          게임의 순서를 위해 카드를 골라주세요
        </p>
      </div>
      {/* 카드 선택 영역 */}
      <div
        className="absolute flex -translate-y-1/2 justify-center"
        style={{
          top: "85%",
        }}
      >
        <div className="flip-card-container flex animate-fadeIn flex-row space-x-20">
          {shuffledCards.map((card, index) => (
            <div
              key={card}
              className={`flip-card cursor-pointer ${
                flippedCard === card ? "flipped" : ""
              }`}
              onClick={() => handleCardClick(card)}
              style={{
                pointerEvents:
                  selectedCards.includes(card) && mySelectedCard !== card
                    ? "none"
                    : "auto",
                opacity:
                  selectedCards.includes(card) && mySelectedCard !== card
                    ? 0.5
                    : 1, // 투명도 설정
              }}
            >
              <div className="flip-card-inner hover:scale-105">
                <div className="flip-card-front">
                  <img
                    src={cardBack}
                    alt={`카드 ${index + 1} 뒷면`}
                    className="h-[228px] w-[165px] object-contain"
                  />
                </div>
                <div className="flip-card-back">
                  <img
                    src={card === 1 ? cardFirstTurn : cardSecondTurn}
                    alt={`카드 ${index + 1} 앞면`}
                    className="h-[228px] w-[165px] rounded-lg object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
          {/* 첫 번째 카드 */}
          {/* <div
            className={`flip-card cursor-pointer ${
              flippedCard === 1 ? "flipped" : ""
            }`}
            onClick={() => handleCardClick(1)}
            style={{
              pointerEvents:
                selectedCards.includes(1) && mySelectedCard !== 1
                  ? "none"
                  : "auto",
              opacity:
                selectedCards.includes(1) && mySelectedCard !== 1 ? 0.5 : 1, // 투명도 설정
            }}
          >
            <div className="flip-card-inner hover:scale-105">
              <div className="flip-card-front">
                <img
                  src={cardBack}
                  alt="첫 번째 카드 뒷면인 상태"
                  className="h-[228px] w-[165px] object-contain"
                />
              </div>
              <div className="flip-card-back">
                <img
                  src={cardFirstTurn}
                  alt="첫 번째 카드 앞면"
                  className="h-[228px] w-[165px] rounded-lg object-contain"
                />
              </div>
            </div>
          </div> */}
          {/* 두 번째 카드 */}
          {/* <div
            className={`flip-card cursor-pointer ${
              selectedCards.includes(2) ? "selected" : ""
            } ${flippedCard === 2 ? "flipped" : ""}`}
            onClick={() => handleCardClick(2)}
            style={{
              pointerEvents:
                selectedCards.includes(2) && mySelectedCard !== 2
                  ? "none"
                  : "auto",
              opacity:
                selectedCards.includes(2) && mySelectedCard !== 2 ? 0.5 : 1, // 투명도 설정
            }}
          >
            <div className="flip-card-inner hover:scale-105">
              <div className="flip-card-front">
                <img
                  src={cardBack}
                  alt="두 번째 카드 뒷면"
                  className="h-[228px] w-[165px] object-contain"
                />
              </div>
              <div className="flip-card-back">
                <img
                  src={cardSecondTurn}
                  alt="두 번째 카드 앞면"
                  className="h-[228px] w-[165px] rounded-lg object-contain"
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SelectTurn;
