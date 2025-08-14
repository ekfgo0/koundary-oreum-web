// src/utils/categoryUtils.js

// 카테고리명과 board_id 매핑 (백엔드와 확인 필요)
export const CATEGORY_BOARD_MAP = {
  '소속국가': 1,
  '소속학교': 2,
  '자유게시판': 3,
  '정보게시판': 4,
  '중고거래 게시판': 5,
  '모임게시판': 6
};

// 반대 매핑 (board_id → 카테고리명)
export const BOARD_CATEGORY_MAP = Object.fromEntries(
  Object.entries(CATEGORY_BOARD_MAP).map(([key, value]) => [value, key])
);

// 카테고리명을 board_id로 변환
export const getCategoryBoardId = (categoryName) => {
  return CATEGORY_BOARD_MAP[categoryName] || 1; // 기본값: 1
};

// board_id를 카테고리명으로 변환
export const getBoardCategoryName = (boardId) => {
  return BOARD_CATEGORY_MAP[boardId] || '소속국가'; // 기본값: 소속국가
};

// 언어 ID 매핑 (필요시)
export const LANGUAGE_MAP = {
  'ko': 1, // 한국어
  'en': 2, // 영어
  // 추가 언어들...
};

export const getLanguageId = (languageCode = 'ko') => {
  return LANGUAGE_MAP[languageCode] || 1; // 기본값: 한국어
};