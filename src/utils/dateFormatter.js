/**
 * 숫자가 10보다 작을 경우 앞에 '0'을 붙여 두 자리로 만듭니다.
 * @param {number} num - 포맷할 숫자
 * @returns {string} 0이 앞에 붙은 두 자리 문자열
 */
function padZero(num) {
    return String(num).padStart(2, '0');
}

/**
 * Date 객체나 날짜 문자열을 'YYYY-MM-DD HH:mm:ss' 형식의 문자열로 변환합니다.
 * @param {string | Date} dateString - 포맷할 날짜 문자열 또는 Date 객체
 * @returns {string} 포맷된 날짜/시간 문자열
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1); // getMonth()는 0부터 시작하므로 1을 더합니다.
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
