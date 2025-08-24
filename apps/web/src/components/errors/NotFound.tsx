'use client'

import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">페이지를 찾을 수 없습니다</p>
        <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default NotFound
