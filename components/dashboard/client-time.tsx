'use client'

import { formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'react'

export default function ClientTime({ date }: { date: string }) {
  const [relative, setRelative] = useState('')

  useEffect(() => {
    setRelative(formatDistanceToNow(new Date(date), { addSuffix: true }))
  }, [date])

  return <span>{relative}</span>
}
