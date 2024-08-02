import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse, AxiosError } from "axios";

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
      axios.post("http://i11a405.p.ssafy.io:8080/user/sign", newUser, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }),
    onSuccess: (data) => {
      console.log(data);
      navigate("/main");
    },
    onError: (error) => {
      console.error("Error during user registration:", error);
    },
  });

  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault();
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
    <div className="sign-up-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="region">Region:</label>
          <input
            type="text"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10))}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {mutation.isError && <p>Error: {mutation.error?.message}</p>}
      {mutation.isLoading && <p>Loading...</p>}
    </div>
  );
};

export default SignUpPage;
