import { User } from "@supabase/supabase-js";

interface UserProfileProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

export default function UserProfile({ user, size = "md" }: UserProfileProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const isGoogleUser = user.app_metadata?.provider === "google";
  const profileImageUrl = user.user_metadata?.avatar_url;

  if (isGoogleUser && profileImageUrl) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}
      >
        <img
          src={profileImageUrl}
          alt="프로필 이미지"
          className="object-cover w-full h-full"
          onError={(e) => {
            // 이미지 로드 실패 시 이니셜로 대체
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-full bg-primary-500 text-white flex items-center justify-center font-medium">
                  ${getInitial(user.email || "")}
                </div>
              `;
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary-500 text-white flex items-center justify-center font-medium flex-shrink-0`}
    >
      {getInitial(user.email || "")}
    </div>
  );
}
