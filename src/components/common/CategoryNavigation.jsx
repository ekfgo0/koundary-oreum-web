import React from 'react';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { label: '소속 국가',        slug: 'country' },
  { label: '소속 학교',        slug: 'school'  },
  { label: '자유 게시판',      slug: 'free'    },
  { label: '정보 게시판',      slug: 'info'    },
  { label: '중고거래/나눔 게시판', slug: 'market'  },
  { label: '모임 게시판',      slug: 'meetup'  },
];

const CategoryNavigation = ({ currentCategory = '', onCategoryChange }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (tab) => {
    navigate(`/board/${tab.slug}`);         // 슬러그 기반 라우팅
    onCategoryChange?.(tab.slug);
  };

  return (
    <div className="bg-blue-500 py-2">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between">
          {TABS.map((tab) => {
            const active = currentCategory === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => handleCategoryClick(tab)}
                className={`flex-1 px-3 py-1 font-medium transition-all bg-blue-500 border-none outline-none focus:outline-none
                  ${active ? 'text-blue-900' : 'text-white hover:text-blue-100'}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;
