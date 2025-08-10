// src/components/auth/PostForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import koundaryLogo from '../common/Koundarylogo.png';

const PostForm = () => {
  // 상태변수를 선언하고 초기값을 소속국가로 가져오기
  const [activeTab, setActiveTab] = useState('소속국가');
  
  // title 변수 정의
  const title = "Koundary";

  // 탭 메뉴에 표시될 카테고리 목록을 배열로 정의
  const tabs = [
    '소속국가',
    '소속학교', 
    '자유게시판',
    '정보게시판',
    '중고거래 게시판',
    '모임게시판'
  ];

  // 탭을 클릭 했을 때 실행되는 함수 (클릭된 탭을 activeTab 상태로 업데이트)
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    // 컴포넌트의 최상위 컨테이너를 반환 (최소 높이를 전체로 설정하고 연한 회색 배경 적용)
    <div className="min-h-screen bg-gray-50">
      {/* 헤더부분 */}
      <header className="border-b py-4">
        <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">
          {/* 로고 + 텍스트 */}
          <div className="flex items-center gap-2">
            <img 
              src={koundaryLogo} 
              alt="Koundary Logo" 
              className="h-8 object-contain"
              onError={(e) => {
                console.error('이미지 로드 실패:', e.target.src);
                // 기본 이미지나 텍스트로 대체
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div 
              className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold" 
              style={{ display: 'none' }}
            >
              K
            </div>
            <span className="text-xl font-semibold">{title}</span>
          </div>
           
          <div className="flex gap-2">
            <button className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-all">
              내 프로필
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white border-2 border-blue-500 rounded hover:bg-blue-600 transition-all">
              로그아웃
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pt-8">
        <div className="w-[400px] bg-white p-8 rounded-lg border border-gray-200">
          {/* Navigation Tabs */}
          <div className="mb-6">
            <div className="flex gap-0">
              {tabs.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleTabClick(category)}
                  className={`flex-1 py-2 px-3 text-xs border-2 border-blue-500 transition-all rounded-none ${
                    activeTab === category
                      ? 'bg-blue-500 text-white z-10'
                      : 'bg-white text-blue-500 hover:bg-blue-50 z-0'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white border-2 border-blue-500 rounded relative min-h-[300px]">
            {/* Content Header */}
            <div className="bg-blue-500 text-white py-2 px-4 font-bold text-center text-sm">
              글 제목
            </div>
            
            {/* Content Body */}
            <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-gray-400">
              글 내용
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  id="bookmark" 
                  className="w-3 h-3"
                />
                <label htmlFor="bookmark" className="text-xs text-gray-600">
                  스크랩
                </label>
              </div>
              <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-all">
                편집
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;