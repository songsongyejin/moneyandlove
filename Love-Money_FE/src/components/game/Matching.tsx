import React, { useEffect, useState } from "react";
import BaseModal from "../home/BaseModal";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelMatching, matching } from "../../utils/matchingAPI";
import "./matching.css";
import heart from "../../assets/start_heart_icon.svg";

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
  const queryClient = useQueryClient();
  const [countdown, setCountdown] = useState<number | null>(null);

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

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 matchData 초기화
    return () => {
      queryClient.removeQueries({
        queryKey: ["matching", token, selectedPosition, gameMode],
      });
    };
  }, [token, selectedPosition, gameMode, queryClient]);

  useEffect(() => {
    if (matchData?.status === "success") {
      setCountdown(3); // 카운트다운 시작
    }
  }, [matchData]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate("/room", { state: { matchData } });
    }
  }, [countdown, navigate, matchData]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="매칭 중">
      <div
        className="flex flex-col items-center"
        style={{
          fontFamily: "DNFBitBitv2",
          WebkitTextStroke: "0.01px #8B6CAC",
        }}
      >
        <p className="mb-24 text-2xl">상대방을 찾고 있습니다</p>
        {!matchData && (
          <div className="spinning-coin-fall-container">
            <div className="spinning-coin-fall">
              <img src={heart} alt="" />
            </div>
          </div>
        )}

        <div className="flex flex-row">
          {matchData?.status === "success" && countdown !== null && (
            <div className="mt-6 text-2xl text-fuchsia-700">
              {countdown}초 후 게임 채팅 화면으로 이동합니다!!
            </div>
          )}
        </div>
        {matchData?.status === "timeout" && (
          <div className="text-pink-600">
            매칭 상대가 없습니다. 취소 후 다시 돌려주세요.
          </div>
        )}
        <button
          onClick={() => {
            onClose();
            cancelMatching(token, selectedPosition, gameMode);
          }}
          className="mt-8 rounded-lg bg-custom-purple-color px-8 py-3 text-lg text-white hover:bg-fuchsia-800"
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
