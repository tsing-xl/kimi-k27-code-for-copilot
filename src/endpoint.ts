export const OFFICIAL_KIMI_API_HOST = 'api.moonshot.cn';

export function isOfficialKimiBaseUrl(baseUrl: string): boolean {
	try {
		return new URL(baseUrl).hostname.toLowerCase() === OFFICIAL_KIMI_API_HOST;
	} catch {
		return false;
	}
}

export function normalizeBaseUrl(baseUrl: string): string {
	return baseUrl.trim().replace(/\/+$/u, '');
}
