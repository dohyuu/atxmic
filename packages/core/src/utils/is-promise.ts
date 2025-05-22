export function isPromise(input: unknown): input is Promise<unknown> {
  return (
    !!input &&
    typeof input === "object" &&
    "then" in input &&
    typeof input.then === "function"
  )
}
