const CLIENT_ID = import.meta.env.VITE_REACT_APP_REST_API_KEY;
const REDIRECT_URL = import.meta.env.VITE_REACT_APP_REDIRECT_URL;

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code`;
