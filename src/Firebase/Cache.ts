import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

export type Cache = {
  get: <T>(path: string) => T | null
  update: <T>(path: string, value: T) => void,
}

export const Cache = {
  Create: (id: string): Cache => {
    const data = JSON.parse(localStorage.getItem(id) || '{}')
    const signal = new Subject<void>()

    signal.pipe(debounceTime(1000))
      .subscribe(() => {
        localStorage.setItem(id, JSON.stringify(data))
      })

    return {
      get: (path: string) => {
        path = path[0] === '/' ? path.substr(1) : path
        const parts = path.split('/')
        let res = data
        for (const key of parts) {
          res = res[key]
          if (res == null) return null
        }
        return res
      },
      update: (path: string, value: any) => {
        path = path[0] === '/' ? path.substr(1) : path
        const parts = path.split('/')

        let bucket = data
        for (var i = 0; i < parts.length; i++) {
          const key = parts[i]
          if (i === parts.length - 1) {
            bucket[key] = value
          } else {
            bucket = bucket[key] = bucket[parts[i]] || {}
          }
        }
        signal.next()
      }
    }
  }
}