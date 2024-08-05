import { atom } from "recoil";

export interface UserInfo {
  nickname: string;
  age: number;
  profileURL: string;
  gender: "MALE" | "FEMALE";
  points: number;
}
//유저 정보
export const userInfo = atom<UserInfo | null>({
  key: "user",
  default: null,
});

//유저 token
export const userToken = atom<string | null>({
  key: "token",
  default: null,
});

//최대 감정 값
export const maxExpressionState = atom<string>({
  key: "maxExpressionState",
  default: "",
});

export const warning = atom<string>({
  key: "warning",
  default: "",
});
