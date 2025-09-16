// src/pages/Auth/ResetConfirm.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import { confirmResetPassword } from '../../api/resetconfirm';

const BRAND = '#2e8ada';

export default function ResetConfirm() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const token = useMemo(() => sp.get('token')?.trim() ?? '', [sp]);

  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const pwError = () => {
    if (pw1.length < 8) return '비밀번호는 8자 이상이어야 해요.';
    if (!/[A-Za-z]/.test(pw1) || !/[0-9]/.test(pw1))
      return '영문과 숫자를 모두 포함해 주세요.';
    if (pw1 !== pw2) return '새 비밀번호와 확인이 일치하지 않아요.';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setDone(false);

    if (!token) return setError('유효하지 않은 링크예요. 다시 요청해 주세요.');
    const msg = pwError();
    if (msg) return setError(msg);

    try {
      setSubmitting(true);
      await confirmResetPassword({ token, newPassword: pw1 });
      setDone(true);
      setPw1(''); setPw2('');
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
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-8">
          {!token && (
            <div className="rounded-xl bg-yellow-50 text-yellow-800 text-sm px-4 py-3">
              링크가 유효하지 않아요. 아이디/이메일로 재요청해 주세요.
            </div>
          )}

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
              disabled={!token}
            />
          </div>

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
              disabled={!token}
            />
          </div>

          {error && <div className="rounded-xl bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>}
          {done && (
            <div className="rounded-xl bg-green-50 text-green-700 text-sm px-4 py-3">
              비밀번호가 변경되었어요. 새 비밀번호로 로그인해 주세요.
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={submitting || !token}
              className="w-full h-12 rounded-xl text-white font-semibold disabled:opacity-60 focus:outline-none"
              style={{ backgroundColor: BRAND }}
            >
              {submitting ? '변경 중…' : '비밀번호 변경'}
            </button>
            <button
              type="button"
              onClick={() => nav('/login')}
              className="w-full h-12 rounded-xl font-semibold bg-[#e8f0ff] focus:outline-none"
              style={{ color: BRAND }}
            >
            로그인하러 가기
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
