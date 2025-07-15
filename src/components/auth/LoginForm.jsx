// src/components/auth/LoginForm.jsx
import { useState } from 'react'

function LoginForm() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // 여기서 로그인 API 호출하면 됨
    console.log('로그인 시도!', id, password)
  }

  return (
<form onSubmit={handleSubmit} className="w-full h-screen flex items-center justify-center">
  <div className="flex flex-col gap-3">
    
    {/* ID + PW + 로그인 */}
    <div className="flex">
      {/* 왼쪽 라벨 (폭 맞춤) */}
      <div className="flex flex-col justify-between h-[94px] mr-2 text-black text-sm font-medium w-[75px] text-right">
        <label className="h-[40px] leading-[40px]">ID</label>
        <label className="h-[40px] leading-[40px]">Password</label>
      </div>

      {/* input 두 줄 */}
      <div className="flex flex-col justify-between h-[94px]">
        <input
          type="text"
          // placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-[316px] h-[40px] border border-gray-300 px-3 bg-gray-100 rounded-none"
        />
        <input
          type="password"
          // placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-[316px] h-[40px] border border-gray-300 px-3 bg-gray-100 rounded-none"
        />
      </div>

      {/* 로그인 버튼 */}
      <button 
        type="submit"
        className="ml-2 w-[84px] h-[94px] font-bold text-sm border bg-transparent rounded-none flex items-center justify-center focus:outline-none focus:ring-0"
        style={{ backgroundColor:'#2e8ada', borderColor: '#2e8ada', color: 'white' }}
      >
        로그인
      </button>
    </div>

    {/* 하단 링크 (폭 316px 맞춤) */}
    <div className="flex justify-between w-[316px] ml-[85px] text-sm text-black">
      <a href="#" className="underline">아이디 찾기</a>
      <a href="#" className="underline">비밀번호 찾기</a>
      <a href="#" className="underline">회원가입</a>
    </div>
  </div>
</form>

  )
}

export default LoginForm
