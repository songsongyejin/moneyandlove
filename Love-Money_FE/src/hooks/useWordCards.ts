import { useState, useEffect } from "react";

// 목업 데이터를 훅 내부에 직접 정의
interface WordCard {
  id: string;
  word: string;
  bgColor: string;
  textColor: string;
}

const mockWordCards: WordCard[] = [
  { id: "word1", word: "여행", bgColor: "#88cce1", textColor: "#2e8bab" },
  { id: "word2", word: "햄버거", bgColor: "#ffbdbd", textColor: "#bb7c7e" },
  { id: "word3", word: "신발", bgColor: "#FFDE59", textColor: "#bd9a5a" },
  { id: "word4", word: "미용실", bgColor: "#9edaae", textColor: "#58a279" },
  { id: "word5", word: "책", bgColor: "#f5b9f3", textColor: "#bd80ba" },
];

export const useWordCards = () => {
  const [wordCards, setWordCards] = useState<WordCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        setLoading(true);
        // 실제 API 호출 대신 목업 데이터 사용
        setWordCards(mockWordCards);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMockData();
  }, []);

  return { wordCards, loading, error };
};

// interface WordCard {
//   word: string;
// }

// interface WordCardWithColors extends WordCard {
//   id: string;
//   bgColor: string;
//   textColor: string;
// }

// const colors = [
//   { bgColor: "#88cce1", textColor: "#2e8bab" },
//   { bgColor: "#ffbdbd", textColor: "#bb7c7e" },
//   { bgColor: "#FFDE59", textColor: "#bd9a5a" },
//   { bgColor: "#9edaae", textColor: "#58a279" },
//   { bgColor: "#f5b9f3", textColor: "#bd80ba" },
// ];

// export const useWordCards = () => {
//   const [wordCards, setWordCards] = useState<WordCardWithColors[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchWordCards = async () => {
//       try {
//         const response = await fetch("/api/whatsItToYa", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("jwt")}`, // JWT token from local storage or context
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch word cards");
//         }

//         const data = await response.json();
//         const keywordList = data.keywordList.map(
//           (keyword: WordCard, index: number) => ({
//             ...keyword,
//             id: `word${index + 1}`,
//             ...colors[index % colors.length],
//           })
//         );

//         setWordCards(keywordList);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWordCards();
//   }, []);

//   return { wordCards, loading, error };
// };
