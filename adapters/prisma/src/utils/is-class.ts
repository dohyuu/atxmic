export function isClass<T>(value: unknown): value is new (...args: any[]) => T {
  if (value === null || value === undefined) {
    return false
  }

  // 객체이고 생성자 함수가 자기 자신인 경우 클래스로 간주
  return (
    typeof value === "function" &&
    value.prototype !== undefined &&
    value.prototype.constructor === value
  )
}
