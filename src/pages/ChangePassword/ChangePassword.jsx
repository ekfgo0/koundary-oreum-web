// src/pages/Auth/ChangePassword.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { changePassword } from '../../api/user';

const BRAND = '#2e8ada';

export default function ChangePassword() {
  const nav = useNavigate();

  const [current, setCurrent] = useState(''); // 현재 비밀번호
  const [pw1, setPw1] = useState('');         // 새 비밀번호
  const [pw2, setPw2] = useState('');         // 새 비밀번호 확인
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  // ResetConfirm의 규칙을 그대로 사용
  const pwError = useMemo(() => {
    if (!pw1 && !pw2) return '';
    if (pw1.length < 8) return '비밀번호는 8자 이상이어야 해요.';
    if (!/[A-Za-z]/.test(pw1) || !/[0-9]/.test(pw1))
      return '영문과 숫자를 모두 포함해 주세요.';
    if (pw1 !== pw2) return '새 비밀번호와 확인이 일치하지 않아요.';
    return '';
  }, [pw1, pw2]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDone(false);

    if (!current.trim()) {
      setError('현재 비밀번호를 입력해 주세요.');
      return;
    }
    const msg = pwError;
    if (typeof msg === 'string' && msg) {
      setError(msg);
      return;
    }

    try {
      setSubmitting(true);
      await changePassword(current.trim(), pw1, pw2);
      setDone(true);
      setCurrent('');
      setPw1('');
      setPw2('');
    } catch (e) {
      setError(e?.message || '비밀번호 변경에 실패했어요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header title="비밀번호 변경" />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-8"
        >
          {/* 현재 비밀번호 */}
          <div>
            <label className="block text-base font-semibold mb-3">현재 비밀번호</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="현재 비밀번호"
              className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50
                         focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': BRAND }}
              autoComplete="current-password"
              disabled={submitting}
            />
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label className="block text-base font-semibold mb-3">새 비밀번호</label>
            <input
              type="password"
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
              placeholder="영문+숫자 포함 8자 이상"
              className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50
                         focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': BRAND }}
              autoComplete="new-password"
              disabled={submitting}
            />
          </div>

          {/* 새 비밀번호 확인 */}
          <div>
            <label className="block text-base font-semibold mb-3">새 비밀번호 확인</label>
            <input
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="다시 한 번 입력"
              className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50
                         focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': BRAND }}
              autoComplete="new-password"
              disabled={submitting}
            />
          </div>

          {/* 에러/완료 메시지 */}
          {error && (
            <div className="rounded-xl bg-red-50 text-red-700 text-sm px-4 py-3">
              {error}
            </div>
          )}
          {!!pwError && !error && (
            <div className="rounded-xl bg-yellow-50 text-yellow-800 text-sm px-4 py-3">
              {pwError}
            </div>
          )}
          {done && (
            <div className="rounded-xl bg-green-50 text-green-700 text-sm px-4 py-3">
              비밀번호가 변경되었어요.
            </div>
          )}

          {/* 버튼 */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl text-white font-semibold disabled:opacity-60 focus:outline-none"
              style={{ backgroundColor: BRAND }}
            >
              {submitting ? '변경 중…' : '비밀번호 변경'}
            </button>
            <button
              type="button"
              onClick={() => nav('/myprofile')}
              className="w-full h-12 rounded-xl font-semibold bg-[#e8f0ff] focus:outline-none"
              style={{ color: BRAND }}
              disabled={submitting}
            >
              내 프로필로 가기
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
