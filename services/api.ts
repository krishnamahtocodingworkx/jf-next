/** Re-exports the shared axios instance + helpers so other modules import from `@/services/api`. */
export {
  api,
  STATUS_CODE,
  interceptorHandledNetworkOrTimeout,
} from "@/utils/service";
export type { ApiResponse, ErrorResponse } from "@/utils/service";
