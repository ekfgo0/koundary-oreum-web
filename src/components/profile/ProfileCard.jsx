import React from 'react';

const ProfileCard = ({
  nickname = '여기는닉네임',
  country = 'Korea',
  school = '홍익대학교',
  profileImage,
  onChangeImage,
  onDeleteImage
}) => {
  return (
    <div className="border p-6 flex gap-6 items-center">
      {/* 이미지 */}
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
          onClick={onChangeImage}
          className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded"
        >
          이미지 변경
        </button>
        <button
          onClick={onDeleteImage}
          className="mt-1 px-3 py-1 text-sm border rounded"
        >
          이미지 삭제
        </button>
      </div>

      {/* 텍스트 정보 */}
      <div className="flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-1">{nickname}</h2>
        <p>{country}</p>
        <p>{school}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
