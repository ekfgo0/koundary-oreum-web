import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { sendPwCode } from '../../api/resetpassword';

const BRAND = '#2e8ada';

export default function FindPassword() {
  const nav = useNavigate();

  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const onSend = async () => {
    setError('');
    if (!loginId.trim()) return setError('아이디를 입력해 주세요.');
    if (!email.trim()) return setError('이메일을 입력해 주세요.');
    try {
      setSending(true);
      // 아이디 + 이메일 전달 → 백엔드에서 매칭 확인
      await sendPwCode({ loginId: loginId.trim(), email: email.trim() });
      setSent(true);
    } catch (e) {
      setSent(false);
      setError(e?.message || '확인 중 오류가 발생했어요.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header title="비밀번호 찾기" />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-8">

          {/* 아이디 */}
          <div>
            <label className="block text-base font-semibold mb-3">아이디</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50
                         focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': BRAND }}
            />
          </div>

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
                disabled={sending || !loginId.trim() || !email.trim()}
                className="h-14 px-5 rounded-xl text-white font-semibold disabled:opacity-60 focus:outline-none"
                style={{ backgroundColor: BRAND }}
              >
                {sending ? '확인 중…' : '확인'}
              </button>
            </div>
            {sent && (
              <p className="mt-2 text-sm text-green-600">아이디와 이메일이 확인되었어요. 이메일에 전송된 링크로 비밀번호를 변경해주세요.</p>
            )}
          </div>

          {/* 오류 메시지 */}
          {error && (
            <div className="rounded-xl bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
          )}

          {/* 로그인하러 가기 버튼 */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => nav('/login')}
              className="w-full h-12 rounded-xl font-semibold bg-[#e8f0ff] focus:outline-none"
              style={{ color: BRAND }}
            >
              로그인하러 가기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
