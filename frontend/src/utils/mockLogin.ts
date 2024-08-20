import { UserInfo } from "../atom/store";

// 테스트 유저 mock 로그인
export const mockLogin = (): UserInfo => {
  return {
    nickname: "테스트유저",
    age: 28,
    profileURL: "https://via.placeholder.com/150",
    gender: "MALE",
    points: 900,
  };
};
