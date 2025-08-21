// src/pages/Auth/FindId.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { sendFindIdCode, verifyFindIdCode } from '../../api/findId';

const BRAND = '#2e8ada';

export default function FindId() {
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [code, setCode]   = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [foundId, setFoundId] = useState('');

  const onSendCode = async () => {
    setError('');
    setFoundId('');
    if (!email.trim()) return setError('이메일을 입력해 주세요.');
    try {
      setSending(true);
      await sendFindIdCode(email.trim());
      setSent(true);
    } catch (e) {
      setSent(false);
      setError(e?.message || '코드 발송 중 오류가 발생했어요.');
    } finally {
      setSending(false);
    }
  };

  const onVerify = async (e) => {
    e.preventDefault();
    setError('');
    setFoundId('');
    if (!email.trim()) return setError('이메일을 입력해 주세요.');
    if (!code.trim()) return setError('인증코드를 입력해 주세요.');
    try {
      setVerifying(true);
      const { loginId } = await verifyFindIdCode(email.trim(), code.trim());
      setFoundId(loginId);
    } catch (e) {
      setError(e?.message || '인증에 실패했어요.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header title="아이디 찾기" />
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* 카드 */}
        <form
          onSubmit={onVerify}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-8"
        >
          {/* 이메일 */}
          <div>
            <label className="block text-base font-semibold mb-3">이메일</label>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@g.hongik.ac.kr"
                className="flex-1 h-14 px-4 rounded-xl border border-gray-200 bg-gray-50
                           focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': BRAND }}
              />
              <button
                type="button"
                onClick={onSendCode}
                disabled={sending || !email.trim()}
                className="h-14 px-5 rounded-xl text-white font-semibold disabled:opacity-60"
                style={{ backgroundColor: BRAND }}
              >
                {sending ? '발송 중…' : sent ? '재발송' : '코드 발송'}
              </button>
            </div>
            {sent && (
              <p className="mt-2 text-sm text-green-600">인증코드를 이메일로 보냈어요.</p>
            )}
          </div>

          {/* 인증코드 */}
          <div>
            <label className="block text-base font-semibold mb-3">인증코드</label>
            <input
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="6자리"
              className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50
                         text-center text-xl tracking-widest font-medium
                         focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': BRAND }}
            />
          </div>

          {/* 에러 */}
          {error && (
            <div className="rounded-xl bg-red-50 text-red-700 text-sm px-4 py-3">
              {error}
            </div>
          )}

          {/* 결과 */}
          {foundId && (
            <div className="rounded-xl border p-5 bg-[#f8fbff]">
              <div className="text-sm text-gray-500 mb-1">확인된 아이디</div>
              <div className="text-2xl font-extrabold">{foundId}</div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={verifying}
              className="w-full h-12 rounded-xl text-white font-semibold disabled:opacity-60"
              style={{ backgroundColor: BRAND }}
            >
              {verifying ? '확인 중…' : '인증 및 아이디 확인'}
            </button>
            <button
              type="button"
              onClick={() => nav('/login')}
              className="w-full h-12 rounded-xl font-semibold bg-[#e8f0ff]"
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
