import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import mainBg from "../../assets/main_bg.png";
import { userToken } from "../../atom/store";
import { useRecoilState } from "recoil";
const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
const fetchKakaoLogin = async (code: string | null) => {
  if (!code) throw new Error("No code provided");
  console.log(code);

  const res = await axios({
    method: "GET",
    url: `${APPLICATION_SERVER_URL}user/login?code=${code}`,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  return res.data;
};

const LoginHandler: React.FC = () => {
  const [token, setToken] = useRecoilState(userToken);
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const { data, error, isLoading } = useQuery({
    queryKey: ["kakaoLogin", code],
    queryFn: () => fetchKakaoLogin(code),
    enabled: !!code, // code가 존재할 때만 쿼리 실행
    select: (data) => {
      if (data) {
        if (data.signed) {
          setToken(data.token);
          console.log(data);
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
    <div className="LoginHandler relative flex h-screen w-screen items-center justify-center bg-gray-100">
      <img
        src={mainBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="notice z-10 rounded bg-white bg-opacity-80 p-6 text-center shadow-md">
        <p className="text-lg font-semibold">로그인 중입니다.</p>
        <p className="mb-4">잠시만 기다려주세요.</p>
        {isLoading && (
          <div className="spinner mx-auto h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
        )}
        {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
      </div>
    </div>
  );
};

export default LoginHandler;
