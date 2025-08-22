import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { sendPwCode, verifyPwCode, resetPassword } from '../../api/resetpassword';

const BRAND = '#2e8ada';

export default function FindPassword() {
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [reseting, setReseting] = useState(false);

  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');

  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const onSend = async () => {
    setError('');
    setDone(false);
    setVerified(false);
    if (!email.trim()) return setError('이메일을 입력해 주세요.');
    try {
      setSending(true);
      await sendPwCode(email.trim());
      setSent(true);
    } catch (e) {
      setSent(false);
      setError(e?.message || '코드 발송 중 오류가 발생했어요.');
    } finally {
      setSending(false);
    }
  };

  const onVerify = async () => {
    setError('');
    setDone(false);
    if (!email.trim()) return setError('이메일을 입력해 주세요.');
    if (!code.trim()) return setError('인증코드를 입력해 주세요.');
    try {
      setVerifying(true);
      await verifyPwCode(email.trim(), code.trim());
      setVerified(true);
    } catch (e) {
      setVerified(false);
      setError(e?.message || '인증 실패했어요.');
    } finally {
      setVerifying(false);
    }
  };

  const pwError = () => {
    if (pw1.length < 8) return '비밀번호는 8자 이상이어야 해요.';
    if (!/[A-Za-z]/.test(pw1) || !/[0-9]/.test(pw1))
      return '영문과 숫자를 포함해 주세요.';
    if (pw1 !== pw2) return '새 비밀번호와 확인이 일치하지 않아요.';
    return '';
  };

  const onReset = async (e) => {
    e.preventDefault();
    setError('');
    setDone(false);
    if (!verified) return setError('이메일 인증을 먼저 완료해 주세요.');
    const msg = pwError();
    if (msg) return setError(msg);

    try {
      setReseting(true);
      await resetPassword(email.trim(), pw1);
      setDone(true);
      // 입력값 정리
      setPw1(''); setPw2('');
    } catch (e) {
      setError(e?.message || '비밀번호 변경에 실패했어요.');
    } finally {
      setReseting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header title="비밀번호 찾기" />
      <main className="max-w-3xl mx-auto px-6 py-12">

        <form onSubmit={onReset} className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-8">
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
                onClick={onSend}
                disabled={sending || !email.trim()}
                className="h-14 px-5 rounded-xl text-white font-semibold disabled:opacity-60 focus:outline-none"
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
            <div className="flex gap-3">
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="6자리"
                className="flex-1 h-14 px-4 rounded-xl border border-gray-200 bg-gray-50
                           text-center text-xl tracking-widest font-medium
                           focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': BRAND }}
              />
              <button
                type="button"
                onClick={onVerify}
                disabled={verifying || !email.trim() || !code.trim()}
                className="h-14 px-5 rounded-xl text-white font-semibold disabled:opacity-60 focus:outline-none"
                style={{ backgroundColor: BRAND }}
              >
                {verifying ? '확인 중…' : (verified ? '인증 완료' : '코드 확인')}
              </button>
            </div>
            {verified && <p className="mt-2 text-sm text-blue-600">이메일 인증이 완료되었어요.</p>}
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
              disabled={!verified}
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
              disabled={!verified}
            />
          </div>

          {/* 오류/완료 */}
          {error && (
            <div className="rounded-xl bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
          )}
          {done && (
            <div className="rounded-xl bg-green-50 text-green-700 text-sm px-4 py-3">
              비밀번호가 변경되었어요. 새 비밀번호로 로그인해 주세요.
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={reseting}
              className="w-full h-12 rounded-xl text-white font-semibold disabled:opacity-60 focus:outline-none"
              style={{ backgroundColor: BRAND }}
            >
              {reseting ? '변경 중…' : '비밀번호 변경'}
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
