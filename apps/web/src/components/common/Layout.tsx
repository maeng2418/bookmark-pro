import { ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode
  className?: string
}

const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 ${className}`}
    >
      {children}
    </div>
  )
}

export default Layout
