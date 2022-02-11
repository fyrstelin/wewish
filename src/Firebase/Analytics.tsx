import { useEffect, FC } from 'react'
import { useApp } from './App'
import 'firebase/analytics'

export const Analytics: FC = () => {
  const app = useApp()
  useEffect(() => {
    app.analytics()
  }, [app])
  return null
}
