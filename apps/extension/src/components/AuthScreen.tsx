import GoogleIcon from "../assets/images/icon-google.svg?react";
import { useAuth } from "../contexts/AuthContext";
import {
  Button,
  Input,
  Label,
  ToggleGroup,
  ToggleGroupItem,
} from "@bookmark-pro/ui";
import { Bookmark, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        setError(error.message);
      } else if (!isLogin) {
        setError("회원가입이 완료되었습니다. 이메일을 확인해주세요.");
      }
    } catch {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch {
      setError("Google 로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center space-x-2">
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-primary-500">
          <Bookmark fill="currentColor" className="text-2xl text-white" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          BookmarkPro
        </h1>
        <p className="text-sm text-gray-500">
          웹사이트를 쉽게 저장하고 관리하세요
        </p>
      </div>

      <div className="my-6 text-center">
        <ToggleGroup
          type="single"
          value={isLogin ? "login" : "signup"}
          className="flex p-1 mb-6 bg-gray-100 rounded-lg"
        >
          <ToggleGroupItem
            value="login"
            className={`flex flex-1 px-4 py-2 rounded-md ${
              isLogin
                ? "bg-white text-blue-600"
                : "bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setIsLogin(true)}
          >
            로그인
          </ToggleGroupItem>
          <ToggleGroupItem
            value="signup"
            className={`flex flex-1 px-4 py-2 rounded-md  ${
              !isLogin
                ? "bg-white text-blue-600"
                : "bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setIsLogin(false)}
          >
            회원가입
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            이메일
          </Label>
          <div className="relative">
            <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="pl-10 border-gray-300"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            비밀번호
          </Label>
          <div className="relative">
            <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="pl-10 pr-10 border-gray-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-2 text-sm text-red-600 rounded bg-red-50">
            {error}
          </div>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 text-white bg-primary-500 hover:bg-primary-600"
        >
          {loading ? "처리중..." : isLogin ? "로그인" : "회원가입"}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">또는</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center w-full gap-2 px-4 py-3 text-gray-700 bg-white border border-gray-300 items hover:bg-gray-50"
        >
          <GoogleIcon width={16} height={16} />
          <span>Google 계정으로 로그인</span>
        </Button>
      </form>
      <p className="mt-6 text-xs text-center text-gray-500">
        로그인하면 모든 기기에서 북마크를 동기화할 수 있습니다
      </p>
    </div>
  );
}
