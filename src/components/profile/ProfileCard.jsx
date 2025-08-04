import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';  // 서버 연결 예정이라 axios 미리 import

const ProfileCard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState('');    // 상태로 관리
  const [country, setCountry] = useState('');
  const [school, setSchool] = useState('');
  const fileInputRef = useRef(null);

  // ✅ 서버에서 유저 정보 받아오기 (곧 연결될 API 예시)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/user/profile');  // ← API 주소에 맞게 수정
        const { nickname, country, school } = response.data;

        setNickname(nickname);
        setCountry(country);
        setSchool(school);
      } catch (err) {
        console.error('유저 정보 불러오기 실패:', err);
      }
    };

    fetchUserInfo();
  }, []);

  // 로컬스토리지 이미지 불러오기
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // 이미지 업로드
  const handleChangeImage = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem('profileImage', reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 이미지 삭제
  const handleDeleteImage = () => {
    setProfileImage(null);
    localStorage.removeItem('profileImage');
  };

  return (
    <div className="border p-6 flex gap-6 items-center">
      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center">
        <div className="w-28 h-28 rounded-full bg-gray-300 overflow-hidden">
          {profileImage && (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />

        <button
          onClick={handleChangeImage}
          className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded"
        >
          이미지 변경
        </button>
        <button
          onClick={handleDeleteImage}
          className="mt-1 px-3 py-1 text-sm border rounded"
        >
          이미지 삭제
        </button>
      </div>

      {/* 텍스트 정보 */}
      <div className="flex flex-col justify-center my-15">
        <h2 className="text-2xl font-bold mb-1">{nickname || '로딩 중...'}</h2>
        <p>{country || '국가 없음'}</p>
        <p>{school || '학교 없음'}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
