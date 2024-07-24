import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import RankingItem from "./RankingItem";

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RankItem {
  rank: number;
  nickname: string;
  montage: string;
  rankPoint: number;
}

// 목업 데이터
const mockRankings: RankItem[] = [
  { rank: 1, nickname: "이치윤", montage: "www.", rankPoint: 1000 },
  { rank: 2, nickname: "김성윤", montage: "www.", rankPoint: 950 },
  { rank: 3, nickname: "이규빈", montage: "www.", rankPoint: 900 },
  { rank: 4, nickname: "정지환", montage: "www.", rankPoint: 850 },
  { rank: 5, nickname: "송예진", montage: "www.", rankPoint: 800 },
  { rank: 6, nickname: "오현진", montage: "www.", rankPoint: 600 },
  { rank: 7, nickname: "오현진", montage: "www.", rankPoint: 600 },
  { rank: 8, nickname: "오현진", montage: "www.", rankPoint: 600 },
  { rank: 9, nickname: "오현진", montage: "www.", rankPoint: 600 },
  { rank: 10, nickname: "오현진", montage: "www.", rankPoint: 600 },
];

const myRank: RankItem = {
  rank: 6,
  nickname: "오현진",
  montage: "www.",
  rankPoint: 600,
};

const RankingModal: React.FC<RankingModalProps> = ({ isOpen, onClose }) => {
  const [rankings, setRankings] = useState<RankItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setRankings(mockRankings);
      setIsLoading(false);
    }
  }, [isOpen]);

  const renderContent = () => {
    if (isLoading) {
      return <p>로딩 중...</p>;
    }
    return (
      <div className="flex h-full w-full flex-col">
        {/* 랭킹 박스 */}
        <div className="scrollbar-thin scrollbar-webkit flex-1 overflow-y-auto rounded-lg bg-white shadow-inner">
          {rankings.map((item) => (
            <RankingItem
              key={item.rank}
              rank={item.rank}
              nickname={item.nickname}
              rankPoint={item.rankPoint}
            />
          ))}
        </div>
        {/* 내 랭킹 */}
        <div
          className="mt-4 rounded-lg py-1"
          style={{
            border: "2px solid #8B6CAC",
            opacity: "var(--sds-size-stroke-border)",
            background: "#EADCFA",
          }}
        >
          <RankingItem
            rank={myRank.rank}
            nickname={myRank.nickname}
            rankPoint={myRank.rankPoint}
          />
        </div>
      </div>
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="RANKING">
      {renderContent()}
    </BaseModal>
  );
};

export default RankingModal;
