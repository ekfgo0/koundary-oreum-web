import React from 'react';

const ActivityCard = () => {
  return (
   <div className="w-full max-w-3xl border p-6">
    <h3 className="text-xl font-bold mb-4">나의 활동</h3>
    <ul className="space-y-2 list-none text-gray-800">
    <li>내가 쓴 글</li>
    <li>댓글 단 글</li>
    <li>스크랩한 글</li>
  </ul>
</div>
  );
};


export default ActivityCard;
