<h1 align="center">Kimi K2.7 Code for Copilot Chat</h1>

本项目 Fork 于 [deepseek-v4-for-copilot](https://github.com/Vizards/deepseek-v4-for-copilot)，将原项目的 DeepSeek V4 API 替换为 Kimi K2.7 Code API，并基于 Kimi 特性做了相应调整。

### API 与模型

- **API 端点**：`api.deepseek.com` → `api.moonshot.cn/v1`
- **模型**：DeepSeek V4 Pro / Flash → Kimi K2.7 Code / Highspeed（高速版 ~180 tok/s）
- **上下文窗口**：1M → 256K Token
- **缓存计费**：`prompt_cache_hit/miss_tokens` → `cached_tokens`

### 视觉能力

- **移除视觉代理子系统**（`src/provider/vision/`）：Kimi K2.7 Code 原生支持 `image_url` / `video_url` 输入
- 消息转换层（`convert.ts`）新增 `DataPart` → 多模态 `content` 数组的转换逻辑

### 思考模式

- **简化为始终开启**：Kimi K2.7 Code 不支持关闭思考模式，移除了原项目的 `none/high/max` 三级思考和 `reasoning_effort` 参数
- 移除了 `models.ts` 中的思考力度配置 Schema 和相关路由逻辑

### 请求参数

- 移除 `temperature` / `top_p`：Kimi K2.7 Code 固定使用 1.0 / 0.95，不可覆盖
- `tool_choice` 仅支持 `auto` / `none`（不支持 `required`）
- 新增 `prompt_cache_key`，利用会话 segment ID 提升缓存命中率

## 技术要点

- **零运行时依赖**：纯 VS Code API + Node.js 内置模块
- **自适应 Token 估算**：通过 API 返回的实际 usage 数据，指数移动平均校准 `charsPerToken`
- **Replay Marker**：通过自定义 MIME 数据在消息中嵌入推理链和图片描述，实现跨轮上下文回放
- **Prompt 缓存优化**：自动使用会话 segment ID 作为 `prompt_cache_key`，提高 Kimi 缓存命中率

## 许可证

MIT License，详见 [LICENSE](LICENSE)。
本项目基于 [Vizards/deepseek-v4-for-copilot](https://github.com/Vizards/deepseek-v4-for-copilot)。

本项目由 Deepseek V4 Pro 生成。