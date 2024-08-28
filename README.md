<div align="center">

  <br/><br/>
  <img width="180" src="https://github.com/user-attachments/assets/43be0f17-7800-4633-b94c-6c44662519d0" alt="logo">
  <br/>
  <i> 우리도 연애 프로그램의 주인공,
  <br> 끝없는 의심 속 진짜 사랑을 찾기 위한 연애 심리 게임 </i>
  <br/><br/>

</div>

## 💗 서비스 소개

<div align="center">
  	<img src="https://github.com/user-attachments/assets/4cd88dfb-b578-4c44-aa46-1df2a2d3430c" alt="main">
</div>

> 어색한 분위기를 깨기 위해 대화주제를 찾아 헤매는 에너지, 돈, 시간적 문제를 해결하기 위한 새로운 형식의 소개팅.
>
> 사용자가 무언가를 억지로 쥐어짜내서 하지 않아도 마치 자신이 연애 프로그램의 주인공처럼, 정해진 컨텐츠속에서 진행되는 게임 속의 소개팅.

<br>

## 🧡 핵심 기능

**:clapper: 얼굴 점수 측정**

> :heavy_check_mark: Tensorflow.js 기반의 Teachable Machine을 활용하여 얼굴 점수 측정
>
> :heavy_check_mark: 여자와 남자를 구분하여 학습시킨 AI는 사진을 크롭하여 얼굴 부분만을 인식
>
> :heavy_check_mark: 총 7가지 클래스로 구분되어 각각 가중치를 적용하고 환산하여 점수를 산출
>
> <img src="https://github.com/user-attachments/assets/4bb48be1-1c43-4bfd-9e7f-d6ebabbee021">

<br/><br/><br/>

**:clapper: 몽타주 생성**

> :heavy_check_mark: 얼굴 점수 측정 시 찍히는 사진 기반으로 몽타주 이미지 생성
>
> :heavy_check_mark: RGB 값을 분석하여 비슷한 이모지를 붙여 몽타주화
>
> :heavy_check_mark: 몽타주는 S3에 저장되며 랭킹에서 랭커 이미지로 표시
>
> <img src="https://github.com/user-attachments/assets/63d55fe6-c8dc-4441-a5a8-9604a8c68bc3">

<br/><br/><br/>

**:clapper: 다양한 매칭 타입**

> :heavy_check_mark: 3가지 매칭타입으로 두 사용자가 매칭될 수 있는 경우의 수는 총 36가지
>
> :heavy_check_mark: Redis의 sortedSet 자료구조를 활용하여 우선순위 적용 및 중복 방지
>
> :heavy_check_mark: Cache로 데이터 관리를 하여 효율성을 높임
>
> :heavy_check_mark: 서버에 계속적으로 요청을 보내는게 단점인 폴링 방법 대신 롱폴링 방식과 비동기 작업으로 빠르게 데이터를 처리
>
> <img src="https://github.com/user-attachments/assets/bac4419d-ba81-4422-969e-b4e388221ed1">

<br/><br/><br/>

**:clapper: 이모티콘 채팅**

> :heavy_check_mark: 사용자들은 서로의 표정을 나타내는 이모지 기반의 채팅을 진행
>
> :heavy_check_mark: face API를 활용한 얼굴 표정 분석
>
> <img src="https://github.com/user-attachments/assets/aa3abfb0-9459-473f-9137-28a86eaa4f9e">

<br/><br/><br/>

**:clapper: 왓츠잇투야**

> :heavy_check_mark: 사용자들은 서로의 가치관을 알아가는 아이스브레이킹 게임 진행
>
> :heavy_check_mark: React DnD를 사용한 카드 드래그 앤 드롭 방식과 CSS 3D transform을 사용한 카드 애니메이션을 통해 사용자 사용성 높임
>
> <img src="./readme_assets/card.gif">

<br>

<br>

## 💚 기술스택

<table>
   <tr>
      <td colspan="2" align="center">
        Frontend 
      </td>
      <td colspan="4">
      <div>
          <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/> 
          <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/>
          <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white"/> 
          <img src="https://img.shields.io/badge/yarn-2C8EBB?style=flat-square&logo=yarn&logoColor=white"/>
          <img src="https://img.shields.io/badge/React Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white"/>
          <img src="https://img.shields.io/badge/React Query-FF4154?style=flat-square&logo=reactquery&logoColor=white"/> 
          <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
          <img src="https://img.shields.io/badge/Recoil-3578E5?style=flat-square&logo=&logoColor=white"/>
          <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white"/>
          <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=white"/>
         </div>
      </td>
   </tr>
  <tr>
      <td colspan="2" align="center">
        Backend
      </td>
      <td colspan="4">
        <div>
            <img src="https://img.shields.io/badge/java-007396?style=flat-square&logo=java&logoColor=white">
            <img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white"/> 
            <img src="https://img.shields.io/badge/Spring Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white"/> 
            <img src="https://img.shields.io/badge/Spring Data JPA-6DB33F?style=flat-square&logo=spring&logoColor=white"/> 
        </div>
      </td>
   </tr>
   <tr>
      <td colspan="2" align="center">
        DataBase 
      </td>
      <td colspan="4">
      <img src="https://img.shields.io/badge/mysql-4479A1?style=flat-square&logo=mysql&logoColor=white"/> 
                                     <img src="https://img.shields.io/badge/redis-FF4438?style=flat-square&logo=redis&logoColor=white"/>
                                     <img src="https://img.shields.io/badge/mongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white">
                                     <img src="https://img.shields.io/badge/amazonS3-e15343?style=flat-square&logo=amazons3&logoColor=white">
      </td>
   </tr>
   <tr>
      <td colspan="2" align="center">
        DevOps
      </td>
      <td colspan="4">
                     <img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=flat-square&logo=amazonec2&logoColor=white"/>
                                        <img src="https://img.shields.io/badge/nginx-009639?style=flat-square&logo=nginx&logoColor=white"/> 
                        <img src="https://img.shields.io/badge/jenkins-D24939?style=flat-square&logo=jenkins&logoColor=white"/> 
                                <img src="https://img.shields.io/badge/docker-2496ED?style=flat-square&logo=docker&logoColor=white"/> 
      </td>
   </tr>
     <tr>
      <td colspan="2" align="center">
        WebRTC
      </td>
      <td colspan="4">
                                        <img src="https://img.shields.io/badge/OpenVidu-412991?style=flat-square&logo=&logoColor=white"/> 
      </td>
   </tr>
   <tr>
      <td colspan="2" align="center">
        Tool
      </td>
      <td colspan="4">
                                        <img src="https://img.shields.io/badge/Intellij IDEA-000000?style=flat-square&logo=intellijidea&logoColor=white"/> 
                                        <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white"/> 
      </td>
   </tr>
   <tr>
      <td colspan="2" align="center">
        etc.
      </td>
      <td colspan="4">
          <img src="https://img.shields.io/badge/GitLab-FC6D26?style=flat-square&logo=gitlab&logoColor=white"/> 
      </td>
   </tr>
   <tr>
      <td colspan="2" align="center">
		DevOps
      </td>
      <td colspan="4">
                     <img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=flat-square&logo=amazonec2&logoColor=white"/>
                                        <img src="https://img.shields.io/badge/nginx-009639?style=flat-square&logo=nginx&logoColor=white"/> 
                        <img src="https://img.shields.io/badge/jenkins-D24939?style=flat-square&logo=jenkins&logoColor=white"/> 
                                <img src="https://img.shields.io/badge/docker-2496ED?style=flat-square&logo=docker&logoColor=white"/> 
      </td>
   </tr>
     <tr>
      <td colspan="2" align="center">
        WebRTC
      </td>
      <td colspan="4">
                                        <img src="https://img.shields.io/badge/OpenVidu-412991?style=flat-square&logo=&logoColor=white"/> 
      </td>
   </tr>
   <tr>
      <td colspan="2" align="center">
        Tool
      </td>
      <td colspan="4">
                                        <img src="https://img.shields.io/badge/Intellij IDEA-000000?style=flat-square&logo=intellijidea&logoColor=white"/> 
                                        <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white"/> 
      </td>
   </tr>
   <tr>
      <td colspan="2" align="center">
        etc.
      </td>
      <td colspan="4">
          <img src="https://img.shields.io/badge/GitLab-FC6D26?style=flat-square&logo=gitlab&logoColor=white"/> 
      </td>
   </tr>
</table>

<br>

## 💙 시스템 아키텍처

![architecture](https://github.com/user-attachments/assets/97fbd407-ffe1-466c-8704-11c6749b80d7)

<br>

## 💜 ERD

![erd](https://github.com/user-attachments/assets/fa81d2c2-0124-4c0d-91f2-cb10cd002216)

<br>

## 🤍 번다운 차트

![chart](https://github.com/user-attachments/assets/995255a4-5c11-4bae-a639-9ff7af1bdf54)

<br>

## 👥 Team 'ㄴ' 🖤

<table align="center">
    <tr align="center">
        <td style="min-width: 150px;">
            <a href="https://github.com/seongY0-0n">
                <img src="https://avatars.githubusercontent.com/u/65865606?v=4" width="150" style="border-radius: 30%">
                <br />
                <b>seongY0-0n</b>
            </a>
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/kaxadlec">
                <img src="https://avatars.githubusercontent.com/u/122510632?v=4" width="150" style="border-radius: 30%">
                <br />
                <b>kaxadlec</b>
            </a> 
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/songsongyejin">
                <img src="https://avatars.githubusercontent.com/u/148851703?v=4" width="150" style="border-radius: 30%">
                <br />
                <b>songsongyejin</b>
            </a> 
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/Lee9Bin">
              <img src="https://avatars.githubusercontent.com/u/116883491?v=4" width="150" style="border-radius: 30%">
              <br />
              <b>Lee9Bin</b>
            </a>
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/stophwan">
              <img src="https://avatars.githubusercontent.com/u/64758861?v=4" width="150" style="border-radius: 30%">
              <br />
              <b>stophwan</b>
            </a> 
        </td>
    </tr>
    <tr align="center">
        <td>
           김성윤
        </td>
        <td>
           오현진
        </td>
        <td>
           송예진
        </td>
        <td>
           이규빈
        </td>
        <td>
           정지환
        </td>
    </tr>
  <tr align="center">
    <td>
      FE Developer
    </td>
    <td>
      FE Developer
    </td>
    <td>
      BE Developer
    </td>
        <td>
      BE Developer
    </td>
    <td>
      BE Developer
    </td>
  </tr>
</table>
