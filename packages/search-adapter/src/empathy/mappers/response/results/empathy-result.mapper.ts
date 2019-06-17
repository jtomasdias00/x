import { getSafePropertyChain } from '@empathy/get-safe-property-chain';
import { Result, ResultTagging, Tagging } from '@empathy/search-types';
import { inject, injectable, multiInject } from 'inversify';
import { EmpathyAdapterConfig, TrackingResultConfig } from '../../../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { Logger } from '../../../logger';
import { EmpathyResult } from '../../../models';
import { pipeMappers } from '../../pipe-mappers';

@injectable()
export class EmpathyResultMapper implements ResponseMapper<EmpathyResult, Result> {
  private readonly highlightWithQuery: MapFn<string, string>;
  private readonly logger = Logger.child('EmpathyResultMapper');
  private readonly mapTagging: MapFn<string, Tagging>;
  private readonly trackingResultConfig: TrackingResultConfig;

  constructor(
    @inject(DEPENDENCIES.config) config: EmpathyAdapterConfig,
    @multiInject(DEPENDENCIES.ResponseMappers.Helpers.tagging) taggingMappers: ResponseMapper<string, Tagging>[],
    @multiInject(DEPENDENCIES.ResponseMappers.Helpers.queryHighlighting) queryHighlightingMappers: ResponseMapper<string, string>[]
  ) {
    this.mapTagging = pipeMappers(...taggingMappers);
    this.highlightWithQuery = pipeMappers(...queryHighlightingMappers);
    this.trackingResultConfig = config.mappings.tracking.result;
  }

  map(rawResult: EmpathyResult, result: Result, context: ResponseMapperContext): Result {
    if (!context.queryHighlightingClass) {
      context.queryHighlightingClass = 'ebx-result-identifier__query';
    }
    const value = Number.parseFloat((rawResult.price) as string);
    const originalValue = Number.parseFloat((rawResult.originalPrice || rawResult.price) as string);
    const sku = rawResult.eb_sku || '';
    return Object.assign<Result, Result>(result, {
      callbackInfo: {},
      modelName: 'Result',
      type: 'default',
      id: rawResult.id,
      name: rawResult.name ? rawResult.name.toLowerCase() : '',
      url: rawResult.url,
      images: rawResult.image ? [rawResult.image] : [],
      price: {
        value,
        originalValue,
        hasDiscount: value < originalValue
      },
      rating: {
        value: rawResult.rating !== undefined ? Number.parseFloat((rawResult.rating) as string) : null
      },
      identifier: {
        value: sku,
        html: sku ? this.highlightWithQuery(sku, sku, context) : sku
      },
      tagging: this.createResultTagging(rawResult, result.tagging || {}, context)
    });
  }

  private createResultTagging(rawResult: EmpathyResult, initialResultTagging: ResultTagging,
    context: ResponseMapperContext): ResultTagging {
    return Object.entries(this.trackingResultConfig).reduce((resultTagging, [key, path]) => {
      const rawTagging = getSafePropertyChain(rawResult, path);
      if (rawTagging) {
        resultTagging[key] = this.mapTagging(rawTagging, {} as Tagging, context);
      } else {
        this.logger.warn(`Tagging for event "${ key }" at path "${ path }" not found when mapping for feature "${ context.feature }"`);
      }
      return resultTagging;
    }, initialResultTagging);
  }
}
