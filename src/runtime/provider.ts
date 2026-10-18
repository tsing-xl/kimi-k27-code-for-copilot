import vscode from 'vscode';
import { logger } from '../logger';
import { KimiChatProvider } from '../provider';

export function registerProvider(context: vscode.ExtensionContext): KimiChatProvider {
	const provider = new KimiChatProvider(context);

	context.subscriptions.push(
		vscode.commands.registerCommand('kimi-copilot.setApiKey', () => provider.configureApiKey()),
		vscode.commands.registerCommand('kimi-copilot.clearApiKey', () => provider.clearApiKey()),
		vscode.lm.registerLanguageModelChatProvider('moonshot', provider),
	);

	// Make models discoverable without waiting for Copilot, which may itself
	// be waiting for BYOK provider activation to finish (deadlock avoidance).
	provider.refreshModelPicker();
	context.subscriptions.push(refreshModelsAfterCopilotActivation(provider));

	return provider;
}

function refreshModelsAfterCopilotActivation(provider: KimiChatProvider): vscode.Disposable {
	let disposed = false;

	// Copilot Chat can serve cached model info without configurationSchema.
	// Refresh again once Copilot activates so the live listener re-queries us.
	Promise.resolve(vscode.extensions.getExtension('github.copilot-chat')?.activate())
		.then(() => {
			if (!disposed) {
				provider.refreshModelPicker();
			}
		})
		.catch((error) => {
			if (!disposed) {
				logger.warn('Failed to activate Copilot Chat or refresh model information', error);
			}
		});

	// Ignore late activation results after this extension is disposed.
	return new vscode.Disposable(() => {
		disposed = true;
	});
}
