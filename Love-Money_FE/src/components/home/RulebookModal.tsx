import React, { useState, useEffect } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import BaseModal from "./BaseModal";
import "./ruleBook.css"
interface RulebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulebookModal: React.FC<RulebookModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // 각 페이지의 제목
  const titles = [
    "💰게임 소개💝",
    "🎮게임 방식🎮",
    "🎮게임 방식🎮",
    "🎮게임 방식🎮",
    "🎮게임 방식🎮",
    "💰포인트 소개💰",
  ];

  // 룰북 페이지 내용
  const pages = [
    `<span style="font-size: 1.2em; font-weight: bold;">💓끝없는 의심 속 진짜 사랑을 찾아라!💓</span> <br/><br/> 
     <span style="font-size: 0.9em;"> \"Money and Love\"는 Money 혹은 Love 포지션을 가진 참가자들이 펼치는 심리전으로, 상대방의 마음을 읽고 속임수와 전략을 통해 진정한 사랑을 찾는 연애 심리 게임입니다. </br></br> 게임의 목표는 간단합니다. </br><span style="font-weight: bold;">당신은 진실한 사랑을 찾을 것인가, 아니면 상대를 속여 최대의 포인트를 얻을 것인가? </span></span>
     <br/><br/>
     <span style="font-size: 13px; font-weight: bold;">🎮[게임방식]</span><span style="font-size: 12px;">   다음 페이지 --></span>`,
    ` <span style="font-size: 20px; font-weight: bold;">[게임 규칙]</span> <br /> <br />
      <span style="font-size: 17px; font-weight: bold;">1. 외모 점수:</span><br/>
      <span style="font-size: 17px; display: block; text-align: left;">AI가 보는 내 외모는 어떨까?</span>
      <span style="font-size: 17px; display: block; text-align: left;">게임 시작 전, 참가자들은 자신의 외모를 AI 얼굴 점수 판독기를 통해 확인하게 됩니다. 이 과정을 통해 AI가 당신의 외모를 어떻게 평가하는지 알 수 있습니다. 단, 이 판독기를 한 번도 사용해본 적이 없는 참가자만 해당됩니다.</span><br/>
      <br/>
      <span style="font-size: 17px; font-weight: bold;">2. 포지션 배정:</span><br/>
      <span style="font-size: 17px; display: block; text-align: left;">게임이 시작되면 참가자들은 자신의 포지션을 선택하게 됩니다.
        <br/>● Love: 사랑을 찾고자 하는 참가자
        <br/>● Money: 포인트를 모으기 위해 상대를 속이는 참가자
        <br/>● Money는 절대 상대방에게 자신의 포지션을 들켜서는 안 됩니다!<span/><br/>
        <span style="font-size: 14px;">※만약 처음에 Money를 선택하고 끝까지 자신은 Money, 상대방이 Love인 상태로 게임이 종료된다면, 최대의 포인트를 얻게 됩니다.※</span><br/>`,
      `
      <span style="font-size: 17px; font-weight: bold;">3. 매칭 타입 선택:</span><br/>
      <span style="font-size: 17px;display: block; text-align: left;">참가자들은 3가지 매칭 방식 중 하나를 선택해야 합니다.
        </br>● 랜덤 매칭: 무작위로 참가자와 매칭됩니다.
        </br>● 러브 매칭: 1번에서 Love 포지션을 선택한 참가자들끼리 매칭됩니다.
        </br>● 프리미엄 매칭: AI 얼굴 점수 상위 30%의 참가자들끼리 매칭됩니다. 매칭 타입에 따라 참가 비용이 달라집니다.  </span><br/>
      <br/>
      <span style="font-size: 17px; font-weight: bold;">4. 이모티콘 채팅:</span><br/>
      <span style="font-size: 17px;display: block; text-align: left;">최대 3분동안 참가자들은 서로의 표정만을 본 상태에서 채팅을 진행하게 됩니다. 채팅에서는 서로가 Love임을 어필해야 합니다. 상대방의 표정과 말 속에 숨겨진 진짜 마음을 읽어내세요. 
      <br/>그러나 조심하세요! 상대도 당신을 속이기 위해 치밀한 전략을 세우고 있을지 모릅니다.
      </span><br/>`,
      `
      <span style="font-size: 17px; font-weight: bold;">5. 화상 채팅:</span><br/>
      <span style="font-size: 17px;display: block; text-align: left;">이모티콘 채팅이 끝나면, 참가자들은 화상 채팅으로 넘어갑니다. 여기서 "왓츠잇투야"라는 게임을 통해 서로의 가치관을 탐색합니다.
      <br/>하지만 긴장을 늦추지 마세요! 상대방은 매력적인 말들로 당신을 속이고 있을지 모릅니다. 특히 랭킹에 있는 Money Hunter들을 조심하세요! </span>  
        <br/><span style="font-size: 14px;display: block; text-align: left;">● 왓츠잇투야: 랜덤으로 제시되는 낱말카드 5개에 대한 서로의 우선순위를 맞히는 게임입니다. 자신의 차례에는 낱말카드 5개에 대한 자신의 우선순위를 매긴 후, 상대방이 묻는 질문에 대답을 하며 자신의 우선순위 힌트를 주면 됩니다. 상대차례에 대화를 통해 상대방의 우선순위를 맞힙니다.</span><br/><br/>
      <span style="font-size: 17px; font-weight: bold;">6. 최종 발언 시간:</span><br/>
      <span style="font-size: 17px;display: block; text-align: left;">"왓츠잇투야"가 끝나면, 게임에 대한 간단한 대화를 나누며 상대방을 유혹하세요. 이 시간은 자신이 Love임을 어필할 마지막 기회이자, 상대방이 Love를 선택하도록 유도할 마지막 찬스입니다.</span><br/>`,
      `
      <span style="font-size: 17px; font-weight: bold;">7.최종 선택:</span><br/>
      <span style="font-size: 17px;display: block; text-align: left;">연애 심리 게임이 종료되었습니다. 상대방이 자신의 마음을 변화시켰다면 새로운 포지션을 선택하고, 그렇지 않다면 처음 선택한 포지션을 유지하세요.</span><br/><br/>
      <span style="font-size: 17px; font-weight: bold;">8. 게임 종료:</span><br/>
      <span style="font-size: 17px;display: block; text-align: left;">
        총 4가지 경우의 결과가 있습니다.<br/></br>
        [상대 vs 나]
        </br>● Love & Love : 진정한 사랑을 찾았습니다! 이제 둘은 커플이 되어 메인 페이지의 커플 채팅을 통해 관계를 이어가세요. 상금 포인트는 동등하게 나누어집니다.
        </br>● Love & Money : 당신은 상대방을 속이는 데 성공했습니다! 상금 포인트는 모두 당신에게 돌아갑니다.
        </br>● Money & Love : 상대방이 당신을 속였습니다. 상금 포인트는 상대방에게 돌아갑니다. 다음 게임에서는 더욱 신중하게 판단하세요!
        </br>● Money Money : 서로를 속이려 했지만 실패했습니다. 상금 포인트는 소멸됩니다.</span><br/>
        </br>
        <span style="font-size: 13px; font-weight: bold;">💰[포인트 소개]</span><span style="font-size: 12px;">   다음 페이지 --></span>
        `,
        `<span style="font-size: 20px; font-weight: bold;">[포인트 획득 방식]</span> <br />
        <span style="font-size: 17px;display: block; text-align: left;">1. 매일매일 출석체크를 통해 얻을 수 있습니다.</span>
        <span style="font-size: 17px;display: block; text-align: left;">2. 게임에서 승리하면 (자신은 Money 상대는 Love) 얻게 됩니다.</span><br/>
        <br />
        <br/>
        <span style="font-size: 20px; font-weight: bold;">[포인트 사용처]</span> <br />
        <span style="font-size: 17px;display: block; text-align: left;">1. 포인트를 사용해 Money&Love 게임에 참가할 수 있습니다.</span>
        <span style="font-size: 17px;display: block; text-align: left;">2. 매칭 모드를 업그레이드 할 수 있습니다.</span>
        <span style="font-size: 17px;display: block; text-align: left;">3. 커플목록 최대 커플 수를 늘릴 수 있습니다.</span><br/>
        <br/>`
      ];


  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    // 페이지가 바뀔 때마다 스크롤을 맨 위로 이동
    const modalContent = document.getElementById('modal-content');
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
  }, [currentPage]);

   // 룰북 모달창 하단: 페이지 이전 다음
   const footer = (
    <div className="mt-4 flex items-center justify-between">
      <button
        className={`${
          currentPage === 0 ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={handlePreviousPage}
        disabled={currentPage === 0}
      >
        <FaArrowCircleLeft size={45} color="#8B6CAC" />
      </button>
      <span
        className="text-2xl"
        style={{ fontFamily: "DNFBitBitv2", color: "#8B6CAC" }}
      >
        {currentPage + 1} / {pages.length}
      </span>
      <button
        className={`${
          currentPage === pages.length - 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={handleNextPage}
        disabled={currentPage === pages.length - 1}
      >
        <FaArrowCircleRight size={45} color="#8B6CAC" />
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={titles[currentPage]}  // 페이지에 따른 제목 설정
      footer={footer}
    >
      <div
        id="modal-content"
        className="p-4 text-center text-xl text-black overflow-y-auto scrollbar_rule w-full"
        style={{ fontFamily: "DungGeunMo", maxHeight: "400px" }}
        dangerouslySetInnerHTML={{ __html: pages[currentPage] }}
      ></div>
    </BaseModal>
  );
};
export default RulebookModal;
