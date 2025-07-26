
'use client';

import { useState } from 'react';

interface LoginScreenProps {
  onSignIn: () => void;
}

export default function LoginScreen({ onSignIn }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await onSignIn();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="ri-bookmark-fill text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">BookmarkPro</h1>
          <p className="text-gray-500 text-sm">웹사이트를 쉽게 저장하고 관리하세요</p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <i className="ri-save-line text-green-600 text-xl"></i>
                </div>
                <span className="text-xs text-gray-600">URL 저장</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <i className="ri-folder-line text-purple-600 text-xl"></i>
                </div>
                <span className="text-xs text-gray-600">카테고리</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <i className="ri-price-tag-3-line text-orange-600 text-xl"></i>
                </div>
                <span className="text-xs text-gray-600">태그</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2 !rounded-button"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <i className="ri-google-fill text-lg"></i>
                <span>구글로 로그인</span>
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            로그인하면 모든 기기에서 북마크를 동기화할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
