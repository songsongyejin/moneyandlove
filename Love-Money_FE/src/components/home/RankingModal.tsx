import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import RankingItem from "./RankingItem";
import WantedPoster from './WantedPoster';
//
import { userToken } from "../../atom/store"; //회원 토큰 가져오기
import { useRecoilState } from "recoil"; //상태관리
import { fetchRanking } from "../../utils/rankingAPI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RankItem {
  rankingId: number;
  rank: number;
  nickName: string;
  montage: string;
  rankPoint: number;
  rankNumber: number;
}

// 목업 데이터
// const mockRankings: RankItem[] = [

// ];

// const myRank: RankItem = {
//   rank: 6,
//   nickname: "오현진",
//   montage: "www.",
//   rankPoint: 600,
// };

const RankingModal: React.FC<RankingModalProps> = ({ isOpen, onClose }) => {
  const [ranking, setRanking] = useState<RankItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useRecoilState(userToken);
  const [selectedMontage, setSelectedMontage] = useState<string | null>(null);
  const [isPosterOpen, setIsPosterOpen] = useState(false);

  const { data: s } = useQuery({
    queryKey: ["rankings", token],
    queryFn: () => fetchRanking(token as string),
    enabled: !!token && isOpen,
    select: (data) => data, // 그대로 data를 반환
  });

  // useEffect를 사용하여 데이터가 변경될 때만 ranking 상태를 업데이트합니다.
  useEffect(() => {
    if (s) {
      console.log(s);
      setRanking(s.rankList);
      console.log(ranking);
      setIsLoading(false);
    }
  }, [s]); // 의존성 배열에 s를 추가하여 s가 변경될 때만 실행되도록 합니다.

  const handleItemClick = (montage: string) => {
    setSelectedMontage(montage);
    setIsPosterOpen(true);
  };

  const renderContent = () => {
    if (isLoading) {
      return <p>로딩 중...</p>;
    }
    return (
      <div className="flex h-full w-full flex-col">
        {/* 랭킹 박스 */}
        <div className="flex-1 overflow-y-auto rounded-lg bg-white shadow-inner scrollbar-thin scrollbar-webkit">
          {ranking.map((item) => (
            <div onClick={() => handleItemClick(item.montage)} key={item.rankingId}>
            <RankingItem
              key={item.rankingId}
              rank={item.rankNumber}
              nickName={
                item.nickName.length > 2
                  ? `${item.nickName.slice(0, 2)}${"*".repeat(item.nickName.length - 2)}`
                  : item.nickName
              }
              rankPoint={item.rankPoint}
            />
          </div>
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
            rank={s.myRank.rankNumber}
            nickName={s.myRank.nickName}
            rankPoint={s.myRank.rankPoint}
          />
        </div>
      </div>
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="RANKING">
      {renderContent()}
      {selectedMontage &&
      <WantedPoster montage={selectedMontage} 
      isOpen={isPosterOpen}
      onClose={() => setIsPosterOpen(false)}/>}
    </BaseModal>
  );
};

export default RankingModal;
