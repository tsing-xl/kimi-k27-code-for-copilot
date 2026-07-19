import vscode from 'vscode';
import { AuthManager } from '../auth';
import { KimiClient } from '../client';
import { getApiModelId, getBaseUrl, getMaxTokens } from '../config';
import { MODELS } from '../consts';
import { t } from '../i18n';
import type { KimiRequest } from '../types';
import { convertMessages, countMessageChars } from './convert';
import {
	dumpKimiRequest,
	type CacheDiagnosticsRecorder,
	type CacheDiagnosticsRun,
} from './debug';
import type { ReplayMarkerMetadata } from './replay';
import { classifyKimiRequest, type RequestKind } from './routing';
import type { ConversationSegment } from './segment';
import { collectTrailingToolResultIds, prepareRequestTools } from './tools/request';

export interface PreparedChatRequest {
	client: KimiClient;
	request: KimiRequest;
	isThinkingModel: boolean;
	totalRequestChars: number;
	trailingToolResultIds: string[];
	cacheDiagnostics: CacheDiagnosticsRun;
	requestKind: RequestKind;
	segment: ConversationSegment;
	replayMarkerMetadata: ReplayMarkerMetadata;
	initialResponseNotice?: string;
}

export interface PrepareChatRequestOptions {
	authManager: AuthManager;
	globalStorageUri: vscode.Uri;
	modelInfo: vscode.LanguageModelChatInformation;
	segment: ConversationSegment;
	messages: readonly vscode.LanguageModelChatRequestMessage[];
	options: vscode.ProvideLanguageModelChatResponseOptions;
	token: vscode.CancellationToken;
	cacheDiagnostics: CacheDiagnosticsRecorder;
}

export async function prepareChatRequest({
	authManager,
	globalStorageUri,
	modelInfo,
	segment,
	messages,
	options,
	token,
	cacheDiagnostics,
}: PrepareChatRequestOptions): Promise<PreparedChatRequest> {
	const apiKey = await authManager.getApiKey();
	if (!apiKey) {
		throw new Error(t('auth.notConfigured'));
	}

	const baseUrl = getBaseUrl();
	const client = new KimiClient(baseUrl, apiKey);
	const modelDef = MODELS.find((m) => m.id === modelInfo.id);
	const isThinkingModel = modelDef?.capabilities.thinking ?? false;
	const maxTokens = getMaxTokens();

	// Kimi K2.7 Code supports native image/video input — no vision proxy needed.
	// Messages (including images) are converted directly to Kimi API format.
	const kimiMessages = convertMessages(messages, isThinkingModel);
	const tools = prepareRequestTools(modelDef?.capabilities.toolCalling, options);

	const totalRequestChars = countMessageChars(kimiMessages);

	// Kimi K2.7 Code: thinking is always enabled, no reasoning_effort param.
	// temperature/top_p are fixed by API — don't send them.
	// tool_choice only supports 'auto' and 'none'.
	const request: KimiRequest = {
		model: getApiModelId(modelInfo.id),
		messages: kimiMessages,
		stream: true,
		tools,
		tool_choice: tools && tools.length > 0 ? ('auto' as const) : undefined,
		max_tokens: maxTokens,
		// Use conversation segment ID as cache key so Kimi can reuse
		// cached system prompt + tools across turns in the same session.
		prompt_cache_key: segment.segmentId,
	};

	const requestKind = classifyKimiRequest({
		request,
		inputMessages: messages,
	});

	dumpKimiRequest(request, {
		globalStorageUri,
		segment,
		requestKind,
		vscodeModelId: modelInfo.id,
		isThinkingModel,
		thinkingEffort: 'enabled',
		maxTokens,
		inputMessages: messages,
		resolvedMessages: messages,
		requestOptions: options,
	});

	const diagnosticsRun = cacheDiagnostics.beginRequest({
		request,
		segment,
		requestKind,
		vscodeModelId: modelInfo.id,
		isThinkingModel,
		thinkingEffort: 'enabled',
		maxTokens,
		inputMessages: messages,
		resolvedMessages: messages,
	});

	return {
		client,
		request,
		isThinkingModel,
		totalRequestChars,
		trailingToolResultIds: collectTrailingToolResultIds(kimiMessages),
		cacheDiagnostics: diagnosticsRun,
		requestKind,
		segment,
		replayMarkerMetadata: {},
	};
}
