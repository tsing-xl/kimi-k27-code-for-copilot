import vscode from 'vscode';
import type { KimiMessage, KimiTool } from '../../types';
import { convertTools } from '../convert';

export function prepareRequestTools(
	toolCallingCapability: boolean | undefined,
	options: vscode.ProvideLanguageModelChatResponseOptions,
): KimiTool[] | undefined {
	return toolCallingCapability ? convertTools(options.tools) : undefined;
}

export function collectTrailingToolResultIds(messages: readonly KimiMessage[]): string[] {
	const trailingToolResultIds: string[] = [];
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message.role !== 'tool' || !message.tool_call_id) {
			break;
		}
		trailingToolResultIds.push(message.tool_call_id);
	}
	return trailingToolResultIds.reverse();
}
