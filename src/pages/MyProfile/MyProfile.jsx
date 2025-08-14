// MyProfile.jsx
import React from 'react';
import Header from '../../components/common/Header';  // 경로 확인!
import ProfileCard from '../../components/profile/ProfileCard';
import AccountInfoCard from '../../components/profile/AccountInfoCard';
import ActivityCard from '../../components/profile/ActivityCard';

const MyProfile = () => {
  const handleEditPassword = () => alert('비밀번호 수정 예정!');
  const handleDeleteAccount = () => alert('탈퇴 기능 연결 예정!');

  return (
    <div>
      {/* 프로필 화면에서는 로그아웃만 노출 */}
      <Header title="내 프로필" showActions={true} onlyLogout={true} />

      <main className="max-w-screen-lg mx-auto px-4 py-4 space-y-6">
        <ProfileCard nickname="홍길동" country="Korea" school="홍익대학교" />
        <div className="flex gap-6">
          <AccountInfoCard
            userId="abcd123"
            onEditPassword={handleEditPassword}
            onDeleteAccount={handleDeleteAccount}
          />
          <ActivityCard />
        </div>
      </main>
    </div>
  );
};

export default MyProfile;

