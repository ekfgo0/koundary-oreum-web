import React from 'react';
import Header from '../../components/profile/Header';

const dummyBoardTitles = [
  '자유게시판이 최고의 듯...',
  'GDG가 역시 최고인듯...',
  '카운더리 팀 프로젝트 트랙 화이팅',
  '와이프레임 좋아요',
  '내용 채우기 귀찮아요',
];

const boardNames = [
  '소속 국가',
  '소속 학교',
  '자유게시판',
  '정보게시판',
  '중고/나눔 게시판',
  '모임게시판'
];

const Main = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header title=""/>

      <div className="max-w-[1024px] mx-auto px-4 py-8">
        {/* 글 작성 버튼 - 우측 정렬 + 작고 깔끔하게 */}
        <div className="flex justify-end mb-6">
          <button className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition">
            글 작성 ✏️
          </button>
        </div>

        {/* 게시판 카드들 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boardNames.map((boardTitle, index) => (
            <div
              key={index}
              className="bg-white rounded-md shadow-sm border border-gray-200 p-4"
            >
              <h2 className="text-md font-semibold mb-3">{boardTitle}</h2>
              <ul className="space-y-1">
                {dummyBoardTitles.map((title, idx) => (
                  <li
                    key={idx}
                    className="border px-2 py-1 text-sm text-gray-800 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;