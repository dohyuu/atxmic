import { randomUUID } from "node:crypto"
import type { Identified } from "../types"

export const identifyClient = <T extends Record<string, unknown>>(
  tx: T,
  identifier: () => string = randomUUID,
): Identified<T> => {
  return {
    ...tx,
    id: identifier(),
  }
}
