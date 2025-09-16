// src/api/user.js
import axiosInstance from './axiosInstance';

const USE_MOCK = (import.meta.env?.VITE_USE_MOCK ?? 'true').toString() === 'true';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAGE_ZERO_BASED = String(import.meta.env?.VITE_PAGE_ZERO_BASED ?? 'false').toLowerCase() === 'true';

// --- 로컬스토리지에 mock 상태를 저장(새로고침해도 유지) ---
const LS_KEY = 'mock_me_v1';

const defaultMock = {
  userId: 1,              // 백엔드 키(userId)와 일치시킴
  loginId: 'abcd123',
  nickname: '홍길동',
  university: '홍익대학교',
  email: 'test@example.com',
  nationality: 'Korea',
  profileImageUrl: '',
  isDefaultImage: true,
  activity: { posts: 2, comments: 1, scraps: 1 },
};

function readMock() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : defaultMock;
  } catch {
    return defaultMock;
  }
}

function writeMock(obj) {
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}

// 서버→프론트 정규화
const normalizeProfile = (data = {}) => ({
  userId: data.userId ?? data.userID ?? 0,
  loginId: data.loginId ?? '',
  nickname: data.nickname ?? '',
  university: data.university ?? '',
  email: data.email ?? '',
  nationality: data.nationality ?? '',
  profileImageUrl: data.profileImageUrl ?? data.profileImage ?? '',
  isDefaultImage: data.isDefaultImage ?? true,
  activity: data.activity,
});

// ============ 프로필 조회 ============
export const getMyProfile = async () => {
  if (USE_MOCK) {
    await sleep(250);
    return readMock();
  }
  try {
    const { data } = await axiosInstance.get('/mypage/me');
    const normalized = normalizeProfile(data);
    localStorage.setItem('userInfo', JSON.stringify(normalized));
    return normalized;
  } catch (error) {
    console.error('프로필 조회 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

export const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
  if (USE_MOCK) {
    await sleep(400);
    if (!currentPassword) throw { message: '현재 비밀번호를 입력해 주세요.' };
    if (!newPassword || !confirmNewPassword) throw { message: '새 비밀번호를 모두 입력해 주세요.' };
    if (newPassword.length < 8) throw { message: '비밀번호는 8자 이상이어야 해요.' };
    if (newPassword !== confirmNewPassword) throw { message: '새 비밀번호가 일치하지 않아요.' };
    if (currentPassword === 'wrongpass') throw { message: '현재 비밀번호가 올바르지 않습니다.' };
    return { ok: true };
  }
  try {
    const { data } = await axiosInstance.post('/mypage/password', {
      currentPassword, newPassword, confirmNewPassword,
    });
    return data;
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      '비밀번호 변경에 실패했습니다.';
    throw { message: msg, status: error?.response?.status };
  }
};

// ============ 프로필 이미지 관리 ============
export const uploadProfileImage = async (fileOrFormData) => {
  if (USE_MOCK) {
    await sleep(300);
    let file = fileOrFormData;
    if (fileOrFormData instanceof FormData) file = fileOrFormData.get('profileImage');
    if (!(file instanceof File)) throw new Error('MOCK: 파일이 필요합니다.');
    const toDataURL = (f) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(f);
      });
    const dataUrl = await toDataURL(file);
    const me = readMock();
    me.profileImageUrl = dataUrl;
    me.isDefaultImage = false;
    writeMock(me);
    return { url: dataUrl, isDefaultImage: false };
  }

  try {
    const form = new FormData();
    if (fileOrFormData instanceof FormData) {
      form.append('profileImage', fileOrFormData.get('profileImage'));
    } else {
      form.append('profileImage', fileOrFormData);
    }
    const { data } = await axiosInstance.put('/mypage/profile-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const updatedUser = {
      ...currentUser,
      profileImageUrl: data.profileImageUrl || data.url,
      isDefaultImage: false,
    };
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));

    return data;
  } catch (error) {
    console.error('프로필 이미지 업로드 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

export const deleteProfileImage = async () => {
  if (USE_MOCK) {
    await sleep(150);
    const me = readMock();
    me.profileImageUrl = '';
    me.isDefaultImage = true;
    writeMock(me);
    return { ok: true, isDefaultImage: true };
  }
  try {
    const { data } = await axiosInstance.delete('/mypage/delete-profile-image');

    const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    localStorage.setItem('userInfo', JSON.stringify({
      ...currentUser,
      profileImageUrl: '',
      isDefaultImage: true,
    }));
    return data;
  } catch (error) {
    console.error('프로필 이미지 삭제 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// 캐시된 프로필 정보 새로고침
export const refreshProfile = async () => {
  try {
    return await getMyProfile();
  } catch (error) {
    console.error('프로필 새로고침 실패:', error);
    throw error;
  }
};

// 회원 탈퇴
export const deleteMyAccount = async (password) => {
  try {
    const { data } = await axiosInstance.delete('/mypage/delete-account', {
      data: { password },
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');
    return data;
  } catch (error) {
    throw (error.response?.data ?? error);
  }
};

// ============ 나의 활동 조회 ============
// 엔드포인트 한 곳에서 관리 (필요 시 이곳만 수정)
const ACTIVITY_ENDPOINTS = {
  posts:    { method: 'GET',  path: '/mypage/posts' },
  comments: { method: 'GET',  path: '/mypage/commented-posts' }, // ✅ 수정
  scraps:   { method: 'GET', path: '/mypage/scraps' },           // GET 우선, 실패시 POST 폴백
};

const toServerPage = (p) => (PAGE_ZERO_BASED ? Math.max(0, p - 1) : p);

// ✅ 응답에서 실제 페이로드를 “끝까지” 파고 들어가 꺼내기
function unwrapPayload(raw) {
  let cur = raw;
  // 흔한 래핑 키들 순서대로 벗기기
  const wrappers = ['data', 'result', 'payload', 'response'];
  let guard = 0;
  while (cur && typeof cur === 'object' && !Array.isArray(cur) && guard < 5) {
    if (Array.isArray(cur.content) || Array.isArray(cur.items) || Array.isArray(cur.list) || Array.isArray(cur.records)) break;
    const key = wrappers.find(k => cur && Object.prototype.hasOwnProperty.call(cur, k));
    if (!key) break;
    cur = cur[key];
    guard++;
  }
  return cur;
}

// ✅ 어떤 키를 써도 리스트를 꺼내오도록 강화
function pickArray(container) {
  if (Array.isArray(container)) return container;
  if (!container || typeof container !== 'object') return [];
  return (
    container.content ??
    container.items ??
    container.list ??
    container.records ??
    []
  );
}

// ✅ 총 개수도 다양한 키 지원
function pickTotal(container, listLen) {
  if (!container || typeof container !== 'object') return listLen;
  return (
    container.totalElements ??
    container.total ??
    container.totalCount ??
    container.page?.totalElements ??
    container.page?.total ??
    listLen
  );
}

// ✅ 필드명 다양성 흡수 (writer, authorName, createdDate, regDate, etc.)
function normalizeActivityList(raw) {
  const unwrapped = unwrapPayload(raw);
  const arr = pickArray(unwrapped);
  const list = arr.map((r) => ({
    postId:    r.postId ?? r.id ?? r.postID ?? r.post_id,
    title:     r.title ?? r.subject ?? '(제목 없음)',
    nickname:  r.nickname ?? r.writer ?? r.author ?? r.authorName ?? '',
    createdAt:
      r.createdAt ?? r.created_date ?? r.createdDate ?? r.regDate ??
      r.lastCommentedAt ?? r.last_commented_at ??
      r.scrappedAt ?? r.scrapDate ?? '',
    boardCode: r.boardCode ?? r.category ?? r.board_code ?? null,
    boardName: r.boardName ?? r.board ?? r.board_name ?? '',
  }));
  const total = pickTotal(unwrapped, list.length);
  return { content: list, totalElements: Number.isFinite(total) ? total : list.length };
}

// ✅ GET 호출 헬퍼 (필요 시 콘솔에 RAW 찍어보기)
async function callGet(path, params) {
  const { data } = await axiosInstance.get(path, { params });
  return data;
}

export const getMyActivity = async (activityType, opts = {}) => {
  const { page = 1, size = 12 } = opts;
  const conf = ACTIVITY_ENDPOINTS[activityType];
  if (!conf) throw new Error(`Unknown activityType: ${activityType}`);

  // MOCK 유지 (생략 가능)
  // ...

  const params = { page: toServerPage(page), size };

  // 1차 요청
  let raw = await callGet(conf.path, params);
  let norm = normalizeActivityList(raw);

  // ✅ 첫 페이지가 비었고(내가 쓴 글 이슈 원인일 수 있음) 서버가 1‑base인 줄 알고 보냈다면,
  //    0‑base로 재시도 한번 더 (자동 판별)
  if (!PAGE_ZERO_BASED && page === 1 && norm.content.length === 0) {
    try {
      const rawRetry = await callGet(conf.path, { page: 0, size });
      const retryNorm = normalizeActivityList(rawRetry);
      if (retryNorm.content.length > 0) norm = retryNorm; // 0‑base였던 것: 데이터 채워짐
    } catch {
      // 무시
    }
  }

  return norm;
};