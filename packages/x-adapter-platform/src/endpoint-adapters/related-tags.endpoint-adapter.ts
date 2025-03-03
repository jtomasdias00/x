import { endpointAdapterFactory, EndpointAdapterOptions } from '@empathyco/x-adapter-next';
import { BaseRequest } from '../types/request.types';
import { RelatedTagsResponse } from '../types/response.types';
import { relatedTagsResponseMapper } from '../mappers/response/related-tags-response.mapper';
import { baseRequestMapper } from '../mappers/request/base-request.mapper';

export const relatedTagsEndpointAdapterOptions: EndpointAdapterOptions<
  BaseRequest,
  RelatedTagsResponse
> = {
  endpoint: 'https://api.{env(.)}empathy.co/relatedtags/{instance}',
  responseMapper: relatedTagsResponseMapper,
  requestMapper: baseRequestMapper
};

export const relatedTagsEndpointAdapter = endpointAdapterFactory(relatedTagsEndpointAdapterOptions);
