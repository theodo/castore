import { EventStoreEventsDetails } from '@castore/core';

import { counterEventStore } from './eventStore';

export const counterIdMock = 'counterId';
export const counterEventsMocks: EventStoreEventsDetails<
  typeof counterEventStore
>[] = [
  {
    aggregateId: counterIdMock,
    version: 1,
    type: 'COUNTER_CREATED',
    timestamp: '2022',
    payload: {
      userId: 'c358dbfb-8a5e-47ca-82f4-ece787ffe224',
    },
  },
  {
    aggregateId: counterIdMock,
    version: 2,
    type: 'COUNTER_INCREMENTED',
    timestamp: '2023',
  },
];
