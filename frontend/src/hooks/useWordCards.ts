import { useState, useEffect } from "react";
import { fetchWordCards } from "../utils/whats-it-to-ya"; // API 유틸리티 가져오기
import { userToken } from "../atom/store";
import { useRecoilState } from "recoil";

interface WordCard {
  id: string;
  word: string;
  bgColor: string;
  textColor: string;
}

// 색상 배열
const colors = [
  { bgColor: "#88cce1", textColor: "#2e8bab" },
  { bgColor: "#ffbdbd", textColor: "#bb7c7e" },
  { bgColor: "#FFDE59", textColor: "#bd9a5a" },
  { bgColor: "#9edaae", textColor: "#58a279" },
  { bgColor: "#f5b9f3", textColor: "#bd80ba" },
];

export const useWordCards = () => {
  const [wordCards, setWordCards] = useState<WordCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token] = useRecoilState(userToken);

  useEffect(() => {
    // console.log("Current token:", token); // 토큰 로깅
    const fetchData = async () => {
      if (!token) {
        setError("No token available"); // 토큰이 없는 경우 에러 메시지 설정
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const words = await fetchWordCards(token); // token은 이제 항상 string입니다.
        const keywordList = words.map((word, index) => ({
          id: `word${index + 1}`,
          word,
          ...colors[index % colors.length],
        }));
        setWordCards(keywordList);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { wordCards, loading, error };
};
