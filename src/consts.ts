import { KIMI_TOOLS_LIMIT } from './provider/tools/consts';
import type { ModelDefinition } from './types';

/**
 * Compile-time constants shared across the extension.
 *
 * These do NOT depend on the VS Code runtime (no workspace configuration,
 * no secrets API). For run-time settings reads see `config.ts`.
 */

/** VS Code configuration section prefix for all extension settings. */
export const CONFIG_SECTION = 'kimi-copilot';

export const EXTERNAL_URLS = {
	kimi: {
		apiKeys: 'https://platform.kimi.com/console/api-keys',
		usage: 'https://platform.kimi.com/console/usage',
		status: 'https://status.moonshot.cn',
	},
} as const;

/** URI path handled by this extension to reveal the output log. */
export const SHOW_LOGS_URI_PATH = '/showLogs';

/** URI path handled by this extension to open API key configuration. */
export const CONFIGURE_API_KEY_URI_PATH = '/setApiKey';

// VS Code's internal LanguageModelChatMessageRole.System is not exposed in @types/vscode.
export const LANGUAGE_MODEL_CHAT_SYSTEM_ROLE = 3;

// ---- Secret keys ----

/** SecretStorage key for the Kimi API key. */
export const API_KEY_SECRET = 'kimi-copilot.apiKey';

/** memento key tracking whether the welcome walkthrough has been shown. */
export const WELCOME_SHOWN_KEY = 'kimi-copilot.welcomeShown';

// ---- Walkthrough ----

/** Walkthrough contribution ID. */
/** Publisher kept from original project. */
export const WALKTHROUGH_ID = 'Vizards.kimi-k27-code-for-copilot#kimiGettingStarted';

// ---- Model registry ----

/** Available Kimi models exposed through the language model provider. */
export const MODELS: ModelDefinition[] = [
	{
		id: 'kimi-k2.7-code',
		name: 'Kimi K2.7 Code',
		family: 'kimi',
		version: 'k2.7',
		detail: 'General-purpose coding model with thinking and vision',
		maxInputTokens: 262144,
		maxOutputTokens: 32768,
		capabilities: {
			toolCalling: KIMI_TOOLS_LIMIT,
			imageInput: true,
			thinking: true,
		},
		requiresThinkingParam: false,
		pricing: {
			CNY: { input: 4, output: 12 },
		},
		priceCategory: 'low',
	},
	{
		id: 'kimi-k2.7-code-highspeed',
		name: 'Kimi K2.7 Code Highspeed',
		family: 'kimi',
		version: 'k2.7',
		detail: 'High-speed variant, 5-6× faster output',
		maxInputTokens: 262144,
		maxOutputTokens: 32768,
		capabilities: {
			toolCalling: KIMI_TOOLS_LIMIT,
			imageInput: true,
			thinking: true,
		},
		requiresThinkingParam: false,
		pricing: {
			CNY: { input: 4, output: 12 },
		},
		priceCategory: 'low',
	},
];
