import { FromSchema, JSONSchema } from 'json-schema-to-ts';

import { EventDetail } from '../eventDetail';
import { EventType } from '../eventType';

export class JSONSchemaEventType<
  T extends string = string,
  // Metadata
  MS extends JSONSchema | undefined = JSONSchema | undefined,
  PS extends JSONSchema | undefined = JSONSchema | undefined,
  $D = undefined extends MS
    ? undefined extends PS
      ? // No metadata + No payload
        { aggregateId: string; version: number; type: T; timestamp: string }
      : PS extends JSONSchema
      ? // No metadata + With payload
        {
          aggregateId: string;
          version: number;
          type: T;
          timestamp: string;
          payload: FromSchema<PS>;
        }
      : never
    : MS extends JSONSchema
    ? undefined extends PS
      ? // With metadata + No payload
        {
          aggregateId: string;
          version: number;
          type: T;
          timestamp: string;
          metadata: FromSchema<MS>;
        }
      : PS extends JSONSchema
      ? // With metadata + With payload
        {
          aggregateId: string;
          version: number;
          type: T;
          timestamp: string;
          payload: FromSchema<PS>;
          metadata: FromSchema<MS>;
        }
      : never
    : never,
  D extends EventDetail = $D extends EventDetail ? $D : never,
> implements EventType<T, D>
{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  _types: {
    detail: D;
  };
  type: T;
  payloadSchema?: PS;
  metadataSchema?: MS;

  constructor({
    type,
    payloadSchema,
    metadataSchema,
  }: {
    type: T;
    payloadSchema?: PS;
    metadataSchema?: MS;
  }) {
    this.type = type;
    this.payloadSchema = payloadSchema;
    this.metadataSchema = metadataSchema;
  }
}
