import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import RankingItem from "./RankingItem";
//
import { userToken } from "../../atom/store"; //회원 토큰 가져오기
import { useRecoilState } from "recoil"; //상태관리
import { fetchRanking } from "../../utils/rankingApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


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

  const { data: s } = useQuery({
    queryKey: ['rankings', token],
    queryFn: () => fetchRanking(token as string),
    enabled: !!token && isOpen,
    select: (data) => data, // 그대로 data를 반환
  });

  // useEffect를 사용하여 데이터가 변경될 때만 ranking 상태를 업데이트합니다.
  useEffect(() => {
    if (s) {
      console.log(s)
      setRanking(s.rankList);
      console.log(ranking)
      setIsLoading(false)
    }
  }, [s]); // 의존성 배열에 s를 추가하여 s가 변경될 때만 실행되도록 합니다.

  const renderContent = () => {
    if (isLoading) {
      return <p>로딩 중...</p>;
    }
    return (
      <div className="flex h-full w-full flex-col">
        {/* 랭킹 박스 */}
        <div className="flex-1 overflow-y-auto rounded-lg bg-white shadow-inner scrollbar-thin scrollbar-webkit">
          {ranking.map((item,index) => (

            <RankingItem
              key={index+1}
              rank={index+1}
              nickName={item.nickName}
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
            rank={1}
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
    </BaseModal>
  );
};

export default RankingModal;
