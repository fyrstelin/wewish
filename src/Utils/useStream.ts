import { Observable } from 'rxjs'
import { useState, useEffect } from 'react'

export const useStream = <T>(stream: Observable<T>) => {
  const [state, setState] = useState<T>()

  useEffect(() => {
    setState(undefined)
    const s = stream.subscribe(setState)
    return () => s.unsubscribe()
  }, [stream])

  return state
}
