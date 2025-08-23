import GoogleIcon from '@/assets/images/icon-google.svg?react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthFormData, authSchema } from '@/schemas/auth.schema'
import { Button, Input, Label, ToggleGroup, ToggleGroupItem } from '@bookmark-pro/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bookmark, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm, useController } from 'react-hook-form'

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp, signInWithGoogle } = useAuth()

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { field: emailField } = useController({
    name: 'email',
    control,
  })

  const { field: passwordField } = useController({
    name: 'password',
    control,
  })

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true)
    setError('')

    try {
      const { error } = isLogin
        ? await signIn(data.email, data.password)
        : await signUp(data.email, data.password)

      if (error) {
        setError(error.message)
      } else if (!isLogin) {
        setError('회원가입이 완료되었습니다. 이메일을 확인해주세요.')
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error.message)
      }
    } catch {
      setError('Google 로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="flex flex-col items-center space-x-2">
        <div className="flex justify-center items-center mb-4 w-16 h-16 rounded-2xl bg-primary-500">
          <Bookmark fill="currentColor" className="text-2xl text-white" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">BookmarkPro</h1>
        <p className="text-sm text-gray-500">웹사이트를 쉽게 저장하고 관리하세요</p>
      </div>

      <div className="my-6 text-center">
        <ToggleGroup
          type="single"
          value={isLogin ? 'login' : 'signup'}
          className="flex p-1 mb-6 bg-gray-100 rounded-lg"
        >
          <ToggleGroupItem
            value="login"
            className={`flex flex-1 px-4 py-2 rounded-md ${
              isLogin ? 'text-blue-600 bg-white' : 'text-gray-600 bg-gray-100 hover:text-gray-900'
            }`}
            onClick={() => setIsLogin(true)}
          >
            로그인
          </ToggleGroupItem>
          <ToggleGroupItem
            value="signup"
            className={`flex flex-1 px-4 py-2 rounded-md  ${
              !isLogin ? 'text-blue-600 bg-white' : 'text-gray-600 bg-gray-100 hover:text-gray-900'
            }`}
            onClick={() => setIsLogin(false)}
          >
            회원가입
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            이메일
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
            <Input
              id="email"
              type="email"
              {...emailField}
              placeholder="이메일을 입력하세요"
              className="pl-10 border-gray-300"
            />
          </div>
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            비밀번호
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...passwordField}
              placeholder="비밀번호를 입력하세요"
              className="pr-10 pl-10 border-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 text-gray-400 transform -translate-y-1/2 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
        </div>

        {error && <div className="p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>}
        <Button
          type="submit"
          disabled={!isValid || loading}
          className="px-4 py-3 w-full text-white bg-primary-500 hover:bg-primary-600"
        >
          {loading ? '처리중...' : isLogin ? '로그인' : '회원가입'}
        </Button>

        <div className="relative my-6">
          <div className="flex absolute inset-0 items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="flex relative justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">또는</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex gap-2 items-center px-4 py-3 w-full text-gray-700 bg-white border border-gray-300 items hover:bg-gray-50"
        >
          <GoogleIcon width={16} height={16} />
          <span>Google 계정으로 로그인</span>
        </Button>
      </form>
    </div>
  )
}

export default AuthForm
