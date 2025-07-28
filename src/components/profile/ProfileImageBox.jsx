import React, { useRef, useState } from 'react';
import defaultImg from '../common/ProfileImage.jpg';

function ProfileImageBox({ user }) {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(user?.profileImage || defaultImg);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    // ⚠️ 서버 업로드도 필요하면 여기서 FormData로 처리
  };

  const handleDelete = () => {
    setImage(defaultImg);
    // ⚠️ 서버에도 기본 이미지로 바꿔주는 로직 필요
  };

  return (
    <div className="w-[250px] p-4 border rounded-md flex flex-col items-center gap-3">
      <img
        src={image}
        alt="프로필 이미지"
        className="w-[120px] h-[120px] rounded-full object-cover"
      />
      <div className="text-center">
        <p className="font-bold text-base">{user?.name || '이름 없음'}</p>
        <p className="text-sm text-gray-600">{user?.country || '국가 없음'}</p>
        <p className="text-sm text-gray-600">{user?.university || '학교 없음'}</p>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => fileInputRef.current.click()}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          이미지 변경
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 text-sm border rounded text-red-500 hover:bg-red-50"
        >
          삭제
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default ProfileImageBox;