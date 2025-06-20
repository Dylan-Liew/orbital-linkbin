// return the token from the cookie e.g -> token=1234567890
export function getAuthToken(): string | null {  
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }
  
