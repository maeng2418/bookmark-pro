import { Loader2 } from 'lucide-react'

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

const LoadingSpinner = ({ size = 'md', className = '', text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <Loader2 className={`text-blue-500 animate-spin ${sizeClasses[size]}`} />
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
