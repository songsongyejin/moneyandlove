import React from "react";

// 세션 참가 폼 컴포넌트
const JoinSessionForm = ({
  joinSession,
  myUserName,
  mySessionId,
  handleChangeUserName,
  handleChangeSessionId,
}: {
  joinSession: (e: React.FormEvent) => void; // 세션 참가 함수
  myUserName: string; // 사용자 이름 상태 변수
  mySessionId: string; // 세션 ID 상태 변수
  handleChangeUserName: (e: React.ChangeEvent<HTMLInputElement>) => void; // 사용자 이름 변경 핸들러
  handleChangeSessionId: (e: React.ChangeEvent<HTMLInputElement>) => void; // 세션 ID 변경 핸들러
}) => (
  <div id="join" className="flex h-screen flex-col items-center justify-center">
    <div
      id="join-dialog"
      className="jumbotron rounded-lg bg-white p-6 shadow-lg"
    >
      <h1 className="text-center text-2xl font-bold text-gray-700">
        Join a video session
      </h1>
      <form className="form-group mt-4" onSubmit={joinSession}>
        <p>
          <label className="text-teal-600">Participant: </label>
          <input
            className="form-control mt-1 w-full rounded border border-gray-300 px-3 py-2 font-bold text-teal-600 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
            type="text"
            id="userName"
            value={myUserName}
            onChange={handleChangeUserName}
            required
          />
        </p>
        <p className="mt-4">
          <label className="text-teal-600">Session: </label>
          <input
            className="form-control mt-1 w-full rounded border border-gray-300 px-3 py-2 font-bold text-teal-600 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
            type="text"
            id="sessionId"
            value={mySessionId}
            onChange={handleChangeSessionId}
            required
          />
        </p>
        <p className="mt-6 text-center">
          <input
            className="btn btn-lg rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-400"
            name="commit"
            type="submit"
            value="JOIN"
          />
        </p>
      </form>
    </div>
  </div>
);

export default JoinSessionForm;
