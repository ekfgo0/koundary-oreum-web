import React from 'react';

const ProfileCard = ({
  nickname = '로딩 중...',
  country = '국가 없음',
  school = '학교 없음',
  profileImage = '',
  onClickChangeImage,   // 파일 선택 트리거
  onClickDeleteImage,   // 이미지 삭제
}) => {
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

        <button
          onClick={onClickChangeImage}
          className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded"
        >
          이미지 변경
        </button>
        <button
          onClick={onClickDeleteImage}
          className="mt-1 px-3 py-1 text-sm border rounded"
        >
          이미지 삭제
        </button>
      </div>

      {/* 텍스트 정보 */}
      <div className="flex flex-col justify-center my-15">
        <h2 className="text-2xl font-bold mb-1">{nickname}</h2>
        <p>{country}</p>
        <p>{school}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
