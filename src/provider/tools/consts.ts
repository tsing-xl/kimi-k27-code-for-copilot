// Kimi Chat Completions API supports a max of 128 functions.
// https://platform.kimi.com/docs/api/chat#tool-use
export const KIMI_TOOLS_LIMIT = 128;

export const ACTIVATE_TOOL_PREFIX = 'activate_';
export const PREFLIGHT_ACTIVATE_CALL_ID_PREFIX = 'kimi_preflight_activate_';
export const MAX_PREFLIGHT_ROUNDS_PER_USER_REQUEST = 3;

export const TOOL_DRIFT_NOTICE_START = '[kimi-copilot-tool-drift-notice-start]: #';
export const TOOL_DRIFT_NOTICE_END = '[kimi-copilot-tool-drift-notice-end]: #';
export const VISION_PROXY_NOTICE_START = '[kimi-copilot-vision-proxy-notice-start]: #';
export const VISION_PROXY_NOTICE_END = '[kimi-copilot-vision-proxy-notice-end]: #';
