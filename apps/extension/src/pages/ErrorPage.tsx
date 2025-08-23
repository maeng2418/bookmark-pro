import { Button } from '@bookmark-pro/ui'
import { AlertTriangle, Home } from 'lucide-react'
import { useNavigate, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError() as Error
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/', { replace: true })
  }

  return (
    <div className="w-80 h-60 flex flex-col items-center justify-center bg-white p-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">페이지 오류</h2>
          <p className="text-sm text-gray-600 mb-4">
            요청하신 페이지에서 오류가 발생했습니다.
            <br />
            홈으로 돌아가서 다시 시도해 주세요.
          </p>
        </div>

        <Button
          onClick={handleGoHome}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white"
        >
          <Home className="w-4 h-4" />
          홈으로 이동
        </Button>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 text-xs text-gray-500 max-w-full">
            <summary className="cursor-pointer">오류 상세 정보</summary>
            <pre className="mt-2 whitespace-pre-wrap break-all">
              {error.message}
              {'\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
