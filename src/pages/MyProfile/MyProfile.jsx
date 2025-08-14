// src/pages/MyProfile/MyProfile.jsx
import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import ProfileCard from '../../components/profile/ProfileCard';
import AccountInfoCard from '../../components/profile/AccountInfoCard';
import ActivityCard from '../../components/profile/ActivityCard';
import {
  getMyProfile,
  uploadMyAvatar,
  deleteMyAvatar,
  deleteMyAccount,
} from '../../api/user';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
// ✅ 문자열 안전 처리 (기본값 true로 두면 백엔드 없어도 잘 뜸)
const USE_MOCK = (import.meta.env?.VITE_USE_MOCK ?? 'true').toString() === 'true';

export default function MyProfile() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchMe = async () => {
    try {
      setErr(null);
      setLoading(true);
      const data = await getMyProfile(); // mock 또는 실제 API
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
    // ✅ mock이면 가드 스킵하고 바로 호출
    if (USE_MOCK) {
      fetchMe();
      return;
    }
    // 실제 API만 가드 적용
    if (!API_BASE) {
      setErr('API 주소가 설정되어 있지 않습니다. (.env 확인)');
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setErr('로그인이 필요합니다.');
      setLoading(false);
      return;
    }
    fetchMe();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="max-w-screen-lg mx-auto px-4 py-6">로딩 중…</main>
      </div>
    );
  }

  if (err) {
    return (
      <div>
        <Header />
        <main className="max-w-screen-lg mx-auto px-4 py-6 space-y-4">
          <div className="text-red-600">{err}</div>
          {!USE_MOCK && (
            <div className="text-sm text-gray-500">
              API_BASE: {API_BASE || '(미설정)'}
            </div>
          )}
          <button onClick={fetchMe} className="px-3 py-2 border rounded">
            다시 시도
          </button>
        </main>
      </div>
    );
  }

  // 이벤트 핸들러
  const handleChangeImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (!input.files?.[0]) return;
      await uploadMyAvatar(input.files[0]); // mock/real 공통
      await fetchMe();
    };
    input.click();
  };

  const handleDeleteImage = async () => {
    await deleteMyAvatar();
    await fetchMe();
  };

  const handleDeleteAccount = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return;
    await deleteMyAccount();
    alert('탈퇴 완료');
  };

  // ✅ 키 이름 매칭: profileImage / account.userId / activity.*
  return (
    <div>
      <Header title="내 프로필" showActions={true} onlyLogout={true} />

      <main className="max-w-screen-lg mx-auto px-4 py-4 space-y-6">
        <ProfileCard
          nickname={me?.nickname || '홍길동'}
          country={me?.country || 'Korea'}
          school={me?.school || '홍익대학교'}
          profileImage={me?.profileImage || ''}       
          onChangeImage={handleChangeImage}
          onDeleteImage={handleDeleteImage}
        />

        <div className="flex flex-col md:flex-row gap-6">
          <AccountInfoCard
            userId={me?.account?.userId || 'abcd123'}    
            onEditPassword={() => alert('비밀번호 수정 예정!')}
            onDeleteAccount={handleDeleteAccount}
          />
          <ActivityCard
            posts={me?.activity?.posts ?? 12}
            comments={me?.activity?.comments ?? 47}
            lastLogin={me?.activity?.lastLogin ?? '2025-08-10T12:34:00+09:00'}
          />
        </div>
      </main>
    </div>
  );
}
