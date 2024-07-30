import React, { useState } from "react";
import first from "../../assets/cards/priority_first.svg";
import second from "../../assets/cards/priority_second.svg";
import third from "../../assets/cards/priority_third.svg";
import fourth from "../../assets/cards/priority_fourth.svg";
import fifth from "../../assets/cards/priority_fifth.svg";

interface MainGameProps {
  // 필요한 다른 속성들...
}

const MainGame: React.FC<MainGameProps> = () => {
  const cards = [
    { id: "card1", image: first },
    { id: "card2", image: second },
    { id: "card3", image: third },
    { id: "card4", image: fourth },
    { id: "card5", image: fifth },
  ];

  return (
    <div className="flex flex-row">
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
        <div className="mt-20 flex flex-1 flex-col items-center justify-center">
          {/* 게임 로직을 여기에 구현 */}
        </div>
      </div>
      {/* 게임창 밖의 카드들 */}
      <div className="flex flex-col">
        {cards.map((card, index) => (
          <div key={card.id} className="cursor-move">
            <img
              src={card.image}
              alt={`Card ${index + 1}`}
              className="h-20 w-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainGame;
