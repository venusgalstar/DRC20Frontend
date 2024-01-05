import React from 'react'

export function MintingPageContainer({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-6 items-start md:grid-cols-2 lg:grid-cols-3">{children}</div>
}
