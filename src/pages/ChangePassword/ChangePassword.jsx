import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { changePassword } from '../../api/user';

const ChangePassword = () => {
   const navigate = useNavigate();
   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmNewPassword, setConfirmNewPassword] = useState('');
   const [loading, setLoading] = useState(false);

   const handleCancel = () => navigate('/myprofile');

   const handleSubmit = async (e) => {
     e.preventDefault();
     
     // 디버깅용 로그 추가
     console.log('폼에서 전송하는 값들:', {
       currentPassword: currentPassword,
       newPassword: newPassword,
       confirmNewPassword: confirmNewPassword
     });
     
     // 입력값 검증
     if (!currentPassword || !newPassword || !confirmNewPassword) {
       alert('모든 항목을 입력해주세요.');
       return;
     }
     
     if (newPassword !== confirmNewPassword) {
       alert('새 비밀번호가 일치하지 않습니다.');
       return;
     }
     
     setLoading(true);
     
     try {
       await changePassword(currentPassword, newPassword, confirmNewPassword);
       alert('비밀번호가 성공적으로 변경되었습니다.');
       navigate('/myprofile');
     } catch (error) {
       console.error('비밀번호 변경 오류:', error);
       const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류';
       alert('비밀번호 변경에 실패했습니다: ' + errorMessage);
     } finally {
       setLoading(false);
     }
   };

 return (
   <div>
     <Header title="비밀번호 변경" />
     <main className="max-w-screen-sm mx-auto px-4 py-12">

       <form className="space-y-6" onSubmit={handleSubmit}>
         {/* 현재 비밀번호 */}
         <div>
           <label className="block mb-2 text-sm">현재 비밀번호</label>
           <input
             type="password"
             className="w-full px-4 py-2 border-b focus:outline-none bg-gray-100"
             placeholder="현재 비밀번호 입력"
             value={currentPassword}
             onChange={(e) => setCurrentPassword(e.target.value)}
             disabled={loading}
             required
           />
         </div>

         {/* 새 비밀번호 */}
         <div>
           <label className="block mb-2 text-sm">새 비밀번호</label>
           <input
             type="password"
             className="w-full px-4 py-2 border-b focus:outline-none bg-gray-100"
             placeholder="새 비밀번호 입력"
             value={newPassword}
             onChange={(e) => setNewPassword(e.target.value)}
             disabled={loading}
             required
           />
         </div>

         {/* 새 비밀번호 확인 */}
         <div>
           <label className="block mb-2 text-sm">새 비밀번호 확인</label>
           <input
             type="password"
             className="w-full px-4 py-2 border-b focus:outline-none bg-gray-100"
             placeholder="새 비밀번호 확인"
             value={confirmNewPassword}
             onChange={(e) => setConfirmNewPassword(e.target.value)}
             disabled={loading}
             required
           />
         </div>

         {/* 버튼 */}
         <div className="flex flex-col gap-3 pt-6">
           <button
             type="submit"
             className="w-full py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
             disabled={loading}
           >
             {loading ? '변경 중...' : '비밀번호 변경'}
           </button>
           <button
             type="button"
             className="w-full py-2 bg-blue-100 text-blue-700 rounded disabled:bg-gray-200"
             onClick={handleCancel}
             disabled={loading}
           >
             취소
           </button>
         </div>
       </form>
     </main>
   </div>
 );
};

export default ChangePassword;