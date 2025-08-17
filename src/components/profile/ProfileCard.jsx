import React from 'react';

const ProfileCard = ({
  nickname = '로딩 중...',
  country = '국가 없음',
  school = '학교 없음',
  profileImage = '',
  onSelectImage,       // (e) => void  ← 변경
  onClickDeleteImage,  // () => void
  uploading = false,
}) => {
  const inputId = 'profileImageInput';

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

        {/* 숨겨진 파일 입력 */}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onSelectImage}
          disabled={uploading}
        />

        {/* 라벨 클릭 → 파일 선택창 */}
        <label
          htmlFor={inputId}
          className={`mt-2 px-3 py-1 text-white text-sm rounded cursor-pointer
            ${uploading ? 'bg-blue-400 opacity-70 pointer-events-none' : 'bg-blue-500 hover:opacity-90'}`}
        >
          {uploading ? '업로드 중...' : '이미지 변경'}
        </label>

        <button
          type="button"
          onClick={onClickDeleteImage}
          className="mt-1 px-3 py-1 text-sm border rounded"
          disabled={uploading}
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
