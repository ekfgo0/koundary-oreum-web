// src/pages/MyProfile/MyProfile.jsx
import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import ProfileCard from '../../components/profile/ProfileCard';
import AccountInfoCard from '../../components/profile/AccountInfoCard';
import ActivityCard from '../../components/profile/ActivityCard';
import { getMyProfile, uploadMyAvatar, deleteMyAvatar, deleteMyAccount } from '../../api/user';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export default function MyProfile() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchMe = async () => {
    try {
      setErr(null);
      setLoading(true);
      const data = await getMyProfile();
      setMe(data);
    } catch (e) {
      console.error('getMyProfile error:', e);
      const code = e?.code || '';
      const status = e?.response?.status;
      const msg =
        status === 401
          ? '로그인이 필요합니다.'
          : code === 'ECONNABORTED'
          ? '요청이 시간 초과되었습니다.'
          : code === 'ERR_NETWORK'
          ? '서버에 연결할 수 없습니다. (백엔드 미가동/네트워크)'
          : e?.response?.data?.message || '프로필을 불러오지 못했습니다.';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ 호출 가드: 백엔드 설정 없음 or 목 사용 안 함 + 토큰 없음
    if (!API_BASE) {
      setErr('API 주소가 설정되어 있지 않습니다. (.env 확인)');
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('accessToken');
    if (!token && !USE_MOCK) {
      setErr('로그인이 필요합니다.');
      setLoading(false);
      return;
    }
    // 실제 호출
    fetchMe();
  }, []);

  // 로딩
  if (loading) {
    return (
      <div>
        <Header />
        <main className="max-w-screen-lg mx-auto px-4 py-6">로딩 중…</main>
      </div>
    );
  }

  // 에러
  if (err) {
    return (
      <div>
        <Header />
        <main className="max-w-screen-lg mx-auto px-4 py-6 space-y-4">
          <div className="text-red-600">{err}</div>
          <div className="text-sm text-gray-500">
            API_BASE: {API_BASE || '(미설정)'}
          </div>
          <button
            onClick={() => fetchMe()}
            className="px-3 py-2 border rounded"
          >
            다시 시도
          </button>
        </main>
      </div>
    );
  }

  // 정상 UI
  const handleChangeImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (!input.files?.[0]) return;
      await uploadMyAvatar(input.files[0]);
      await fetchMe();
    };
    input.click();
  };
  const handleDeleteImage = async () => { await deleteMyAvatar(); await fetchMe(); };
  const handleDeleteAccount = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return;
    await deleteMyAccount();
    alert('탈퇴 완료');
  };

  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto px-4 py-4 space-y-6">
        <ProfileCard
          nickname={me?.nickname || '닉네임 없음'}
          country={me?.country || '국가 없음'}
          school={me?.school || '학교 없음'}
          profileImage={me?.profileImageUrl}
          onChangeImage={handleChangeImage}
          onDeleteImage={handleDeleteImage}
        />
        <div className="flex flex-col md:flex-row gap-6">
          <AccountInfoCard
            userId={me?.loginId ?? me?.id ?? '-'}
            onEditPassword={() => alert('비밀번호 수정 예정!')}
            onDeleteAccount={handleDeleteAccount}
          />
          <ActivityCard />
        </div>
      </main>
    </div>
  );
}
