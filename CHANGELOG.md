## [0.1.2] - 2026-07-21

### Changed

- **Internal naming cleanup**: Renamed all legacy `DeepSeek`-prefixed types, functions, and log messages to use `Kimi` naming throughout `src/provider/debug/` and `src/provider/pricing/`.
- **Removed vision proxy dead code**: Dropped ~130 lines of unused `vision.panel.*` / `vision.proxy.*` i18n translations and related constants left over from the original DeepSeek project's vision proxy subsystem.
- **Fixed English model i18n keys**: Changed `model.flash.*` / `model.pro.*` (DeepSeek legacy) to `model.k2.7-code.*` / `model.k2.7-code-highspeed.*` so English-language users see correct model descriptions.
- **Optimized diagnostic adapters**: Removed `adaptUsage` / `adaptRequest` type-adapter functions in `diagnostics.ts`, eliminating unnecessary object allocations on every usage log. Cache hit/miss values are now computed inline from `KimiUsage.cached_tokens`.
- **Fixed tool drift notice URLs**: Updated links in `notice.toolDrift` i18n translations from `github.com/Vizards/...` to `github.com/tsing-xl/...`.
- **Fixed `package.json` scripts**: Corrected `vsce login` publisher name to match `publisher` field.

## [0.1.0] - Initial Release

### Added

- **Kimi K2.7 Code** and **Kimi K2.7 Code Highspeed** models available in the Copilot Chat model picker.
- **Native image/video input**: Kimi K2.7 Code supports `image_url` / `video_url` natively — no separate vision proxy required. `DataPart` → multimodal `content` array conversion in `convert.ts`.
- **Always-on thinking mode**: Thinking is always enabled (K2.7 Code does not support turning it off). Removed `reasoning_effort` parameter and three-level thinking configuration.
- **Prompt cache optimization**: Automatic `prompt_cache_key` using conversation segment IDs to improve Kimi API cache hit rates.
- **Replay Marker system**: Custom MIME data embeds reasoning chain metadata across conversation turns for context continuity.
- **Adaptive token estimation**: Exponential moving average calibration of `charsPerToken` from API-reported usage data.
- **Privacy-safe diagnostics**: Three-tier debug mode (`minimal` / `metadata` / `verbose`) with request dumping and cache-trace analysis.
- **BYOK (Bring Your Own Key)**: API key stored securely in VS Code `SecretStorage`, with settings fallback for CI/automation.
- **Multi-language support**: English and Simplified Chinese (zh-cn) i18n, following VS Code display language.
- **Experimental tool-list stabilization**: Pre-activation of available tools to improve context-cache hit rates across turns.

### Fork

Forked from [deepseek-v4-for-copilot](https://github.com/Vizards/deepseek-v4-for-copilot) and adapted for Kimi K2.7 Code:

- API endpoint: `api.deepseek.com` → `api.moonshot.cn/v1`
- Models: DeepSeek V4 Pro / Flash → Kimi K2.7 Code / Highspeed
- Context window: 1M → 256K tokens
- Cache billing: `prompt_cache_hit/miss_tokens` → `cached_tokens`
- Removed `temperature` / `top_p` (fixed by Kimi API)
- `tool_choice` limited to `auto` / `none` (no `required`)
