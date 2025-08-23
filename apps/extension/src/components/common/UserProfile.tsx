import { User } from '@supabase/supabase-js'

type UserProfileProps = {
  user: User
  size?: 'sm' | 'md' | 'lg'
}

const UserProfile = ({ user, size = 'md' }: UserProfileProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  const isGoogleUser = user.app_metadata?.provider === 'google'
  const profileImageUrl = user.user_metadata?.avatar_url

  if (isGoogleUser && profileImageUrl) {
    return (
      <div
        className={`overflow-hidden flex-shrink-0 bg-gray-200 rounded-full ${sizeClasses[size]}`}
      >
        <img
          src={profileImageUrl}
          alt="프로필 이미지"
          className="object-cover w-full h-full"
          onError={(e) => {
            // 이미지 로드 실패 시 이니셜로 대체
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `
                <div class="flex justify-center items-center w-full h-full font-medium text-white bg-primary-500">
                  ${getInitial(user.email || '')}
                </div>
              `
            }
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={`flex flex-shrink-0 justify-center items-center font-medium text-white rounded-full ${sizeClasses[size]} bg-primary-500`}
    >
      {getInitial(user.email || '')}
    </div>
  )
}

export default UserProfile
