import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryNavigation = ({ currentCategory = '', onCategoryChange }) => {
  const navigate = useNavigate();

  const categories = [
    '소속국가',
    '소속학교', 
    '자유게시판',
    '정보게시판',
    '중고거래 게시판',
    '모임게시판'
  ];

  const handleCategoryClick = (category) => {
    // 해당 카테고리 게시판으로 이동
    navigate(`/board/${category}`);
    
    // 부모 컴포넌트에 카테고리 변경 알림
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div className="bg-blue-500 py-2">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`flex-1 px-3 py-1 font-medium transition-all bg-blue-500 border-none outline-none ${
                currentCategory === category
                  ? 'text-blue-900'
                  : 'text-white hover:text-blue-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;