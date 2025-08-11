import Header from '../../components/profile/Header';
import ProfileCard from '../../components/profile/ProfileCard';
import AccountInfoCard from '../../components/profile/AccountInfoCard';
import ActivityCard from '../../components/profile/ActivityCard';
import React, { useEffect, useState } from 'react';
// import ProfileHeader from '../../components/profile/ProfileHeader';
// import ProfileImageBox from '../../components/profile/ProfileImageBox';
// import AccountInfoCard from '../../components/profile/AccountInfoCard';

const MyProfile = () => {
  const handleEditPassword = () => alert('비밀번호 수정 예정!');
  const handleDeleteAccount = () => alert('탈퇴 기능 연결 예정!');

  return (
    <div>
      <Header />
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
