import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg">Page not found</p>
      <p className="mt-1 text-muted-foreground">The page you are looking for does not exist.</p>
      <Button asChild className="mt-4">
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  )
} 