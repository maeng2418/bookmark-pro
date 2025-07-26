
'use client';

import { User } from '@/lib/auth';

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <i className="ri-bookmark-fill text-white text-lg"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-900">BookmarkPro</h1>
        </div>
        
        {user && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {user.avatar && (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-7 h-7 rounded-full"
                />
              )}
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
            <button 
              onClick={onSignOut}
              className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
