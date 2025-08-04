import React, { useState } from 'react';
import KoundaryLogoImg from '../../components/common/Koundarylogo.png';

const PostForm = () => {
  const [activeTab, setActiveTab] = useState('소속국가');

  const tabs = [
    '소속국가',
    '소속학교', 
    '자유게시판',
    '정보게시판',
    '중고거래 게시판',
    '모임게시판'
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center">
      {/* Header */}
      <div className="flex flex-col items-center justify-center grow">
        <div className="flex flex-col items-center justify-center">
          <img 
            src={KoundaryLogoImg} 
            alt="Koundary"
            className="h-20 mb-8"
          />
        </div>
        
        <div className="w-[400px] bg-white p-8 rounded-lg border border-gray-200">
          {/* Navigation Tabs */}
          <div className="mb-6">
            <div className="flex gap-0">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`flex-1 py-2 px-3 text-xs border-2 border-blue-500 transition-all ${
                    index !== 0 ? '-ml-0.5' : ''
                  } ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  {tab}
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
                  장보기
                </label>
              </div>
              <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-all">
                ✏️
              </button>
            </div>
          </div>

          {/* User Controls */}
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-all text-sm">
              Profile
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white border-2 border-blue-500 rounded hover:bg-blue-600 transition-all text-sm">
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Frame label */}
      <div className="mb-4 text-gray-400 text-sm">
        Frame
      </div>
    </div>
  );
};

export default PostForm;