import { User } from 'lucide-react'

type LoadingSpinnerProps = {
  message?: string
}

const LoadingSpinner = ({ message = '로딩 중...' }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-primary rounded-2xl animate-pulse">
          <User className="w-8 h-8 text-white" />
        </div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
