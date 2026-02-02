'use client'

import { useUser } from '@clerk/nextjs'

export default function HomePage() {
  const { isSignedIn, user, isLoaded } = useUser()

  // Handle loading state
  if (!isLoaded) return <div>Loading...</div>

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {isSignedIn ? (
        <p>Hello, {user?.firstName}!</p> // Show username if signed in
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  );
}
