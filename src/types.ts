/**
 * Shared types for the Kimi K2.7 Code Copilot extension.
 */

// ---- API request/response types ----

export interface KimiMessage {
	role: 'system' | 'user' | 'assistant' | 'tool';
	content: string | KimiContentPart[];
	tool_call_id?: string;
	tool_calls?: KimiToolCall[];
	reasoning_content?: string;
}

/** Content part for multimodal input (images, video). */
export interface KimiContentPart {
	type: 'text' | 'image_url' | 'video_url';
	text?: string;
	image_url?: { url: string } | string;
	video_url?: { url: string } | string;
}

export interface KimiToolCall {
	id: string;
	type: 'function';
	function: {
		name: string;
		arguments: string;
	};
}

export interface KimiTool {
	type: 'function';
	function: {
		name: string;
		description?: string;
		parameters?: Record<string, unknown>;
	};
}

/**
 * Kimi API usage statistics.
 * Uses a single `cached_tokens` field (Kimi API format).
 */
export interface KimiUsage {
	prompt_tokens: number;
	completion_tokens: number;
	total_tokens: number;
	cached_tokens?: number;
}

/**
 * Kimi K2.7 Code request body.
 *
 * Kimi K2.7 Code API differences from typical OpenAI-compatible endpoints:
 * - No temperature / top_p (fixed by API, cannot be overridden)
 * - tool_choice only supports 'auto' | 'none' (no 'required')
 * - thinking is always enabled (no need to pass explicitly)
 * - prompt_cache_key for cache optimization
 */
export interface KimiRequest {
	model: string;
	messages: KimiMessage[];
	stream: boolean;
	max_tokens?: number;
	max_completion_tokens?: number;
	tools?: KimiTool[];
	tool_choice?: 'none' | 'auto';
	stream_options?: {
		include_usage: boolean;
	};
	prompt_cache_key?: string;
}

export interface KimiStreamChunk {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Array<{
		index: number;
		delta: {
			role?: string;
			content?: string;
			reasoning_content?: string;
			tool_calls?: Array<{
				index: number;
				id?: string;
				type?: string;
				function?: {
					name?: string;
					arguments?: string;
				};
			}>;
		};
		finish_reason: string | null;
	}>;
	usage?: KimiUsage;
}

// ---- Stream callbacks ----

export interface StreamCallbacks {
	onContent: (content: string) => void;
	onThinking: (text: string) => void;
	onToolCall: (toolCall: KimiToolCall) => void;
	onError: (error: Error) => void;
	onDone: () => void;
	onUsage?: (usage: KimiUsage) => void;
}

// ---- Model definitions ----

export type PricingCurrency = 'CNY';

export type PriceCategory = 'low' | 'medium' | 'high' | 'very_high';

export interface ModelPricing {
	input: number;
	output: number;
	cachedInput?: number;
}

export interface ModelDefinition {
	id: string;
	name: string;
	family: string;
	version: string;
	detail: string;
	maxInputTokens: number;
	maxOutputTokens: number;
	capabilities: {
		toolCalling: boolean | number;
		imageInput: boolean;
		thinking: boolean;
	};
	requiresThinkingParam: boolean;
	pricing?: Readonly<Record<PricingCurrency, ModelPricing>>;
	priceCategory?: PriceCategory;
}
