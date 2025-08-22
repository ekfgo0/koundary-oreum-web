// src/components/profile/ActivityCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ActivityCard = () => {
  return (
    <div className="w-full max-w-3xl border rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-xl font-bold mb-4">나의 활동</h3>
      <ul className="space-y-3 list-none text-gray-800">
        <li>
          <Link
            to="/myactivity/posts"
            className="block hover:underline hover:text-blue-600"
          >
            내가 쓴 글
          </Link>
        </li>
        <li>
          <Link
            to="/myactivity/comments"
            className="block hover:underline hover:text-blue-600"
          >
            댓글 단 글
          </Link>
        </li>
        <li>
          <Link
            to="/myactivity/scraps"
            className="block hover:underline hover:text-blue-600"
          >
            스크랩한 글
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ActivityCard;
