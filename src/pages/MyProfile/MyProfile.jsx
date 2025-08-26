import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import ProfileCard from '../../components/profile/ProfileCard';
import AccountInfoCard from '../../components/profile/AccountInfoCard';
import ActivityCard from '../../components/profile/ActivityCard';
import { 
  getMyProfile, 
  uploadProfileImage, 
  deleteProfileImage,
  deleteMyAccount 
} from '../../api/user';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK = (import.meta.env?.VITE_USE_MOCK ?? 'true').toString() === 'true';

export default function MyProfile() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);         // 첫 진입 때만 사용
  const [refreshing, setRefreshing] = useState(false);  // 조용한 재조회 표시(선택)
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);

  // http/https에만 캐시 무력화(blob:/data:는 그대로)
  const bust = (url) => {
    if (!url) return '';
    const s = String(url).toLowerCase();
    const isHttp = s.startsWith('http://') || s.startsWith('https://');
    return isHttp ? `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}` : url;
  };

  // opts.silent=true면 전체 로딩을 띄우지 않음
  const fetchMe = async (opts = { silent: false }) => {
    const { silent } = opts;
    try {
      setErr(null);
      if (silent) setRefreshing(true);
      else setLoading(true);

      const data = await getMyProfile();
      // 머지 + 캐시 무력화된 이미지 적용
      setMe((prev) => ({
        ...prev,
        ...data,
        profileImage: bust(data.profileImageUrl),
      }));
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
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    if (USE_MOCK) {
      fetchMe({ silent: false });
      return;
    }
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
    fetchMe({ silent: false });
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
          <button onClick={() => fetchMe({ silent: false })} className="px-3 py-2 border rounded">
            다시 시도
          </button>
        </main>
      </div>
    );
  }

  // 파일 선택 → 미리보기 즉시 반영 → 업로드 → 조용한 재조회
  const handleSelectImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('5MB 이하의 이미지만 가능합니다.');
      e.target.value = '';
      return;
    }

    // 즉시 미리보기
    const previewUrl = URL.createObjectURL(file);
    setMe((prev) => (prev ? { ...prev, profileImage: previewUrl } : prev));

    try {
      setUploading(true);
      // 수정된 함수명 사용
      await uploadProfileImage(file); // FormData 생성은 함수 내부에서 처리

      // 전체 로딩 없이 최신 데이터만 병합
      await fetchMe({ silent: true });
    } catch (error) {
      console.error(error);
      alert('이미지 업로드에 실패했습니다.');
      await fetchMe({ silent: true }); // 롤백/재동기화
    } finally {
      e.target.value = ''; // 동일 파일 재선택 허용
      try { URL.revokeObjectURL(previewUrl); } catch {}
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!confirm('프로필 이미지를 삭제하시겠습니까?')) return;
    
    try {
      await deleteProfileImage(); // 수정된 함수명 사용
      await fetchMe({ silent: true });
    } catch (e) {
      console.error(e);
      alert('이미지 삭제에 실패했습니다.');
    }
  };

  // 비밀번호 변경 페이지로 이동
  const handleEditPassword = () => {
    navigate('/change-password');
  };

  // 회원탈퇴 기능
  const handleDeleteAccount = async () => {
    if (!confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    
    try {
      await deleteMyAccount();
      alert('탈퇴가 완료되었습니다.');
      // 탈퇴 후 메인 페이지나 로그인 페이지로 이동
      navigate('/');
    } catch (e) {
      console.error(e);
      alert('탈퇴에 실패했습니다: ' + (e.message || '알 수 없는 오류'));
    }
  };

  return (
    <div>
      <Header title="내 프로필" showActions={true} onlyLogout={true} />

      <main className="max-w-screen-lg mx-auto px-4 py-4 space-y-6">
        <ProfileCard
          nickname={me?.nickname || '홍길동'}
          nationality={me?.nationality || 'Korea'}
          university={me?.university || '홍익대학교'}
          profileImage={me?.profileImage || ''}
          onSelectImage={handleSelectImage}
          onClickDeleteImage={handleDeleteImage}
          uploading={uploading || refreshing}
        />

        <div className="flex flex-col md:flex-row gap-6">
          <AccountInfoCard
            userId={me?.loginId || 'abcd123'}
            onEditPassword={handleEditPassword}
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