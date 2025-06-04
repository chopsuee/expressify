import React from 'react'
import { SignupForm } from '@/components/signup-form'
function page() {
  return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md px-4">
            <SignupForm/>
          </div>
        </div>
  )
}

export default page
