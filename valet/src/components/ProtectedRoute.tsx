import { Navigate, useLocation } from "react-router-dom"
import { useFrappeAuth } from "frappe-react-sdk"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, isLoading } = useFrappeAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!currentUser) {
    // Redirect to login page with the current path as redirect_url
    return (
      <Navigate 
        to={`/login?redirect_url=${encodeURIComponent(location.pathname)}`} 
        state={{ from: location }} 
        replace 
      />
    )
  }

  return <>{children}</>
} 