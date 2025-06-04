import React from 'react'

interface ViewCardProps {
  children: React.ReactNode;
}

function ViewCard({ children }: ViewCardProps) {
  return (
    <div>
      <div className="flex bg-[#1313135d] rounded-3xl mt-10 mb-20 w-2/4 px-20 pt-10 pb-10 m-auto min-h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export default ViewCard