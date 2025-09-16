// src/pages/Auth/FindId.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { requestFindIdEmail } from '../../api/findId';

const BRAND = '#2e8ada';

export default function FindId() {
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSentMsg('');
    const v = email.trim();
    if (!v) return setError('이메일을 입력해 주세요.');

    try {
      setSending(true);
      const res = await requestFindIdEmail(v);
      setSentMsg(res?.message || '입력하신 이메일로 아이디를 전송했어요.');
    } catch (e) {
      const status = e?.status || e?.response?.status;
      setError(
        status === 404
          ? '등록되지 않은 이메일이에요.'
          : '전송 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header title="아이디 찾기" showActions={false} />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-8"
        >
          {/* 이메일 */}
          <div>
            <label className="block text-base font-semibold mb-3">본인 대학 이메일</label>
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
                type="submit"
                disabled={sending || !email.trim()}
                className="h-14 px-5 rounded-xl text-white font-semibold disabled:opacity-60"
                style={{ backgroundColor: BRAND }}
              >
                {sending ? '전송 중…' : '아이디 이메일로 받기'}
              </button>
            </div>
          </div>

          {/* 안내/에러 */}
          {sentMsg && <p className="text-sm text-green-600">{sentMsg}</p>}
          {error && (
            <div className="rounded-xl bg-red-50 text-red-700 text-sm px-4 py-3">
              {error}
            </div>
          )}

          {/* 액션 */}
          <div className="pt-2">
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
