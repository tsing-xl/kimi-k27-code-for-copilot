import type { KimiRequest } from '../types';

export interface ErrorActionUrls {
	configureApiKey?: string;
	showLogs?: string;
}

export interface RequestErrorContext {
	baseUrl: string;
	request: KimiRequest;
}

export interface ErrorActionLink {
	labelKey: string;
	url: string;
}

export interface HttpErrorLinkDefinition {
	labelKey: string;
	url: string;
}

export type ApiProviderId = 'moonshot';
export type HttpErrorLinkStatusKey = 401 | 402 | '5xx';

export type KimiRequestErrorKind = 'http' | 'network' | 'unknown';

export type NetworkErrorCategory =
	| 'dns'
	| 'unreachable'
	| 'interrupted'
	| 'timeout'
	| 'tls'
	| 'aborted'
	| 'protocol'
	| 'configuration'
	| 'generic';
