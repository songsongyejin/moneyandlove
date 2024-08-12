import React, { useEffect } from "react";
import BaseModal from "../home/BaseModal";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { cancelMatching, matching } from "../../utils/matchingAPI";

interface MatchingProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  selectedPosition: string;
  gameMode: string;
}

const Matching: React.FC<MatchingProps> = ({
  isOpen,
  onClose,
  token,
  selectedPosition,
  gameMode,
}) => {
  const navigate = useNavigate();
  const {
    data: matchData,
    error: e,
    isLoading: l,
  } = useQuery({
    queryKey: ["matching", token, selectedPosition, gameMode],
    queryFn: () =>
      matching(token as string, selectedPosition as string, gameMode as string),
    enabled: !!token && isOpen,
    staleTime: 0, // 데이터를 캐시하지 않고 매번 새롭게 패치
  });
  console.log(matchData);
  console.log(selectedPosition);

  console.log(gameMode);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="매칭 중">
      <div className="flex flex-col items-center">
        <p
          className="mb-24 text-2xl"
          style={{
            fontFamily: "DNFBitBitv2",
            WebkitTextStroke: "0.01px #8B6CAC",
          }}
        >
          상대방을 찾고 있습니다
        </p>
        <div className="h-20 w-20 animate-spin rounded-full border-b-2 border-t-2 border-custom-purple-color"></div>
        <div className="flex flex-row space-x-4">
          {matchData?.status === "success" && (
            <button
              onClick={() => navigate("/room", { state: { matchData } })}
              className="mt-8 rounded-lg bg-fuchsia-700 px-8 py-3 text-lg text-white hover:bg-fuchsia-800"
              style={{
                fontFamily: "DNFBitBitv2",
              }}
            >
              매칭 수락
            </button>
          )}
        </div>
        <button
          onClick={() => {
            onClose();
            cancelMatching(token, selectedPosition, gameMode);
          }}
          className="mt-8 rounded-lg bg-fuchsia-700 px-8 py-3 text-lg text-white hover:bg-fuchsia-800"
          style={{
            fontFamily: "DNFBitBitv2",
          }}
        >
          매칭 취소
        </button>
      </div>
    </BaseModal>
  );
};

export default Matching;
