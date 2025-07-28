import React, { useEffect, useState } from 'react';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileImageBox from '../../components/profile/ProfileImageBox';
import AccountInfoCard from '../../components/profile/AccountInfoCard';

function MyProfile() {
     const [user, setUser] = useState(null);

  useEffect(() => {
    // 임시 더미 유저 (백엔드 API 없을 경우)
    const mockUser = {
      name: '이혁',
      country: 'Korea',
      university: '홍익대학교',
      id: 'hhhkdev',
      profileImage: null, // 없으면 기본 이미지 사용됨
    };
    setUser(mockUser);
  }, []);


return (
  <>
    <ProfileHeader />
    {user && (
      <div className="p-8 flex justify-center gap-8">
        <ProfileImageBox user={user} />
        <AccountInfoCard user={user} />
        {/* 👉 여기 다음 카드(활동정보)도 나란히 붙이면 됨 */}
      </div>
    )}
  </>
);
}

export default MyProfile;