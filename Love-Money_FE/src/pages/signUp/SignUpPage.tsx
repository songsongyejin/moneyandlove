import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse, AxiosError } from "axios";
import mainBg from "../../assets/main_bg.png";
const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface SignUpData {
  kakaoId: number;
  email: string;
  nickname: string;
  gender: string;
  region: string;
  age: number;
  profileURL: string;
}

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("MALE");
  const [region, setRegion] = useState("");
  const [age, setAge] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { kakaoId, profileURL } = location.state?.data || {};

  const mutation = useMutation<AxiosResponse, AxiosError, SignUpData>({
    mutationFn: (newUser: SignUpData) =>
      axios.post(`${APPLICATION_SERVER_URL}user/sign`, newUser, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    onSuccess: (data) => {
      console.log(data);
      navigate("/");
    },
    onError: (error) => {
      console.error("Error during user registration:", error);
    },
  });

  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault();

    // 닉네임이 3글자 이상인지 검사
    if (nickname.length < 3) {
      alert("닉네임은 최소 3글자 이상이어야 합니다.");
      return;
    }

    const formData: SignUpData = {
      kakaoId,
      email,
      nickname,
      gender,
      region,
      age,
      profileURL,
    };
    console.log(formData);
    mutation.mutate(formData);
  };

  return (
    <div className="sign-up-page flex h-screen items-center justify-center">
      <img
        src={mainBg}
        alt=""
        className={`absolute inset-0 -z-10 h-screen w-screen bg-cover bg-center`}
      />
      <div className="absolute inset-0 -z-10 bg-black opacity-20"></div>
      <div
        className="justify-betweenp-20 flex-col rounded-md p-20"
        style={{ backgroundColor: "#F0E9F6", fontFamily: "DungGeunMo" }}
      >
        <h2 className="-mt-10 mb-10 text-center text-3xl">회원 가입</h2>
        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label htmlFor="email">이메일:</label>
            <input
              type="email"
              id="email"
              value={email}
              className="ml-4 bg-transparent p-1 pl-4"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="nickname">닉네임:</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              className="ml-4 bg-transparent p-1 pl-4"
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="gender">성별:</label>
            <select
              id="gender"
              value={gender}
              className="ml-4 bg-transparent p-1 pl-4"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="region">지역:</label>
            <input
              type="text"
              id="region"
              value={region}
              className="ml-4 bg-transparent p-1 pl-4"
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="age">나이:</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10))}
              className="ml-4 bg-transparent p-1 pl-4"
            />
          </div>
          <button
            type="submit"
            className="mx-auto w-full hover:scale-125 hover:font-bold"
          >
            고고씽!!!!
          </button>
        </form>
        {mutation.isError && <p>Error: {mutation.error?.message}</p>}
        {mutation.isLoading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default SignUpPage;
