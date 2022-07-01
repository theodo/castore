import { counterEventStore as $counterEventStore } from '@castore/demo-blueprint';
import { DynamoDbEventStorageAdapter } from '@castore/dynamodb-event-storage-adapter';

export const counterEventStore = $counterEventStore;

counterEventStore.storageAdapter = new DynamoDbEventStorageAdapter({
  tableName: process.env.COUNTER_EVENTS_TABLE_NAME as string,
});
