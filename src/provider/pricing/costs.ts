import type { ModelDefinition, PriceCategory, PricingCurrency } from '../../types';

/**
 * Mapping:
 * - inputCost  <- input, the standard input price.
 * - cacheCost  <- cachedInput, shown separately as the cached-input tier.
 * - outputCost <- output.
 */
export interface ModelCostInformation {
	readonly inputCost?: string;
	readonly outputCost?: string;
	readonly cacheCost?: string;
	readonly priceCategory?: PriceCategory;
}

export function toModelCostInfo(
	model: ModelDefinition,
	currency?: PricingCurrency,
): ModelCostInformation {
	if (!currency) {
		return {};
	}

	const pricing = model.pricing?.[currency];
	if (!pricing) {
		return {};
	}

	return {
		...(model.priceCategory ? { priceCategory: model.priceCategory } : {}),
		inputCost: formatPriceValue(pricing.input, currency),
		outputCost: formatPriceValue(pricing.output, currency),
		cacheCost: pricing.cachedInput !== undefined ? formatPriceValue(pricing.cachedInput, currency) : undefined,
	};
}

function formatPriceValue(value: number, currency: PricingCurrency): string {
	return `${currency === 'CNY' ? '¥' : '$'}${value}`;
}
