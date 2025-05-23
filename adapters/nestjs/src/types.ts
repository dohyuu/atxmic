import type { Provider } from "@nestjs/common"

export type RegisterOptions = {
  client: Provider<any>
}
