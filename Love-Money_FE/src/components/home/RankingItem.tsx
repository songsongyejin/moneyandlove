import React from "react";
import { CiCoins1 } from "react-icons/ci";
import rank1 from "../../assets/rank1.svg";
import rank2 from "../../assets/rank2.svg";
import rank3 from "../../assets/rank3.svg";

interface RankItemProps {
  rank: number;
  nickname: string;
  rankPoint: number;
}

const RankingItem: React.FC<RankItemProps> = ({
  rank,
  nickname,
  rankPoint,
}) => {
  const getRankImage = (rank: number) => {
    switch (rank) {
      case 1:
        return <img src={rank1} alt="1등" className="mr-2 h-6 w-6" />;
      case 2:
        return <img src={rank2} alt="2등" className="mr-2 h-6 w-6" />;
      case 3:
        return <img src={rank3} alt="3등" className="mr-2 h-6 w-6" />;
      default:
        return <span className="mr-2 w-6 text-center font-bold">{rank}</span>;
    }
  };

  return (
    <li
      className="flex items-center justify-between border-b border-gray-200 px-6 py-3"
      style={{ fontFamily: "DungGeunMo" }}
    >
      <div className="flex items-center">
        {getRankImage(rank)}
        <span>{nickname}</span>
      </div>
      <div className="flex items-center">
        <CiCoins1 className="mr-1 text-black" /> {/* 코인 아이콘*/}
        <span className="w-16 text-right">{rankPoint}점</span>
      </div>
    </li>
  );
};

export default RankingItem;
