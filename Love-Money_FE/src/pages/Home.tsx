import React, { Component } from "react";
import "../index.css"; // 필요한 CSS 파일 import
class Home extends Component {
  render() {
    return (
      <div className="relative h-screen">
        <div className="bg-main-bg absolute inset-0 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center">
            <h1
              className="text-shadow-custom text-stroke-custom text-8xl font-bold text-white"
              style={{ fontFamily: "DNFBitBitv2" }}
            >
              Money
              <br />& Love
            </h1>
            <button className="bg-btn-color shadow-btn mt-10 w-72 rounded-md py-3 font-bold text-white">
              회원가입
            </button>
            <button className="bg-btn-color shadow-btn mt-10 w-72 rounded-md py-3 font-bold text-white">
              로그인
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
