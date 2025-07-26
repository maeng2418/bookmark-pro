
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export const GOOGLE_CLIENT_ID = 'your-google-client-id';

export const initializeGoogleAuth = () => {
  return new Promise<void>((resolve) => {
    // 임시로 바로 resolve
    resolve();
  });
};

export const signInWithGoogle = (): Promise<User> => {
  return new Promise((resolve) => {
    // 임시 사용자 데이터로 바로 로그인 처리
    const user: User = {
      id: 'demo-user-123',
      email: 'demo@gmail.com',
      name: '데모 사용자',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20person%20profile%20avatar%2C%20clean%20minimal%20design%2C%20modern%20style%2C%20friendly%20face%2C%20business%20attire%2C%20high%20quality%20portrait&width=100&height=100&seq=avatar-demo&orientation=squarish'
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    resolve(user);
  });
};

export const signOut = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};