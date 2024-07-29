import { atom } from "recoil";

export interface UserInfo {
  nickname: string;
  age: number;
  profileURL: string;
  gender: "MALE" | "FEMALE";
  points: number;
}

export const userInfo = atom<UserInfo | null>({
  key: "user",
  default: null,
});

// export const userInfo = atom({
//   key: "user",
//   default: false,
// });
