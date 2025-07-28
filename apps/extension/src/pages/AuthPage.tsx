import AuthScreen from '../components/AuthScreen';
import { useAuthGuard } from '../hooks/useAuthGuard';

export default function AuthPage() {
  const { loading, isAuthenticated } = useAuthGuard(false);

  if (loading) {
    return (
      <div className="w-80 h-60 flex items-center justify-center bg-white">
        <div className="text-gray-500">로딩중...</div>
      </div>
    );
  }

  // 인증된 사용자는 렌더링하지 않음 (useAuthGuard에서 리다이렉트 처리됨)
  if (isAuthenticated) {
    return null;
  }

  return <AuthScreen />;
}