const isObject = (o: any) => typeof(o) === 'object' && o != null

export const equals = <T>(t1: T, t2: T): boolean => {
  if (Array.isArray(t1) && Array.isArray(t2)) {
    return t1.length === t2.length && t1.every((v1, i) => {
      const v2 = t2[i]
      return equals(v1, v2)
    })
  }
  if (isObject(t1) && isObject(t2)) {
    const props1 = Object.entries(t1).sort(([k1], [k2]) => k1.localeCompare(k2))
    const props2 = Object.entries(t2).sort(([k1], [k2]) => k1.localeCompare(k2))

    return props1.length === props2.length && props1.every(([k1, v1], i) => {
      const [k2, v2] = props2[i]
      return k1 === k2 && equals(v1, v2)
    })
  }

  return t1 === t2
}
