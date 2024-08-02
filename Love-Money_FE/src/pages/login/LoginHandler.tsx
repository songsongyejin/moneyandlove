import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const fetchKakaoLogin = async (code: string | null) => {
  if (!code) throw new Error("No code provided");
  const res = await axios({
    method: "GET",
    url: `http://i11a405.p.ssafy.io:8080/user/login?code=${code}`,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
  return res.data;
};

const LoginHandler: React.FC = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const { data, error, isLoading } = useQuery({
    queryKey: ["kakaoLogin", code],
    queryFn: () => fetchKakaoLogin(code),
    enabled: !!code, // code가 존재할 때만 쿼리 실행
    select: (data) => {
      console.log(data);
      if (data) {
        if (data.signed) {
          navigate("/main");
        } else {
          navigate("/signUp", { state: { data } });
        }
      }
    },
  });

  useEffect(() => {
    if (error) {
      console.error("Error during Kakao login:", error);
    }
  }, [error]);

  return (
    <div className="LoginHandler">
      <div className="notice">
        <p>로그인 중입니다.</p>
        <p>잠시만 기다려주세요.</p>
        <div className="spinner"></div>
        {error && <p>Error: {error.message}</p>}
        {isLoading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default LoginHandler;
