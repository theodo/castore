# ✨ Better DevX for Event Sourcing in TypeScript

Castore provides a unified interface for implementing Event Sourcing in TypeScript.

Define your events types:

```typescript
import { EventTypesDetails } from 'castore';
import { JSONSchemaEventType } from 'castore/json-schema-event-type';

const counterCreatedEvent = new JSONSchemaEventType({
  type: 'COUNTER_CREATED',
  payloadSchema: {
    type: 'object',
    properties: {
      startCount: { type: 'integer' },
    },
  } as const,
});


// Will infer correct union type 🙌
type CounterEventDetail = EventTypesDetails<typeof eventTypes>;
```

Define your aggregate type and reducer:

```typescript
type CounterAggregate = {
  aggregateId: string;
  version: number;
  count: number;
  status: string;
};

const reducer = (
  aggregate: CounterAggregate,
  event: CounterEventDetail,
): CounterAggregate => {
  const { aggregateId, version } = event;

  switch (event.type) {
    case 'COUNTER_CREATED': {
      const { startCount = 0 } = event.payload;

      return {
        aggregateId,
        version,
        count: startCount,
        status: 'CREATED',
      };
    }
    case 'COUNTER_INCREMENTED':
      return {
        ...aggregate,
        version,
        count: aggregate.count + 1,
      };
    case 'COUNTER_REMOVED':
      return {
        ...aggregate,
        version,
        status: 'REMOVED',
      };
  }
};
```

Finally, initialize an EventStore class and start interacting with your event store:

```typescript
const counterEventStore = new EventStore({
  eventStoreId: 'Counters',
  eventTypes,
  reducer,
  // 👇 See storage adapters section
  storageAdapter,
});

const {
  events, // <= Typed events
  aggregate, // <= Reducer result
} = await counterEventStore.getAggregate(aggregateId);

// 👇 Method input is correctly typed
await counterEventStore.pushEvent({
  aggregateId: '123',
  version: 1,
  type: 'COUNTER_CREATED',
  timestamp: new Date().toISOString(),
  payload: {
    startCount: 18,
  },
});
```

# 🤔 Why use Castore ?

- 💬 **Verbosity**: Castore classes are designed to increase dryness and provide the optimal developer experience. Event Sourcing is hard, don't make it harder!
- 📝 **Strong typings**: We love type inference, we know you will to!
- 🏄‍♂️ **Interfaces before implementations**: Castore provides a standard interface to modelize common event sourcing patterns in TypeScript. But it **DOES NOT enforce any particular implementation** (storage service, messaging system etc...). You can use Castore in React apps, containers or lambdas, it's up to you! Some common implementations are provided, but you are free to use **any implementation you want** via custom classes, as long as they follow the required interfaces.
- 👍 **Enforces best practices**: Gained from years of usage like using int versions instead of timestamps, transactions for multi-store events and state-carrying transfer events for projections.
- 🛠 **Rich suite of helpers**: Like mock events builder to help you write tests.

# Table of content

- [Event](#event)
- [Event Store](#event-store)
- [Storage Adapter](#storage-adapter)
- [Mock Events Builder](#mock-events-builder)

# Event

The first step in your ✨ Castore journey ✨ is to define your business events! 🦫

Castore lets you easily create the Event Types which will constitute your Event Store.
Simply use the EventType class and start defining, once and for all, your events! 🎉

```ts
import { EventType } from "@castore/core"

export const userCreatedEvent = new EventType<
  // Typescript EventType
  'USER_CREATED',
  // Typescript EventDetails
  {
    aggregateId: string;
    version: number;
    type: 'USER_CREATED';
    timestamp: string;
    payload: { name: string; age: number };
  }
>({
  // EventType
  type: 'USER_CREATED',
});

const userRemovedEvent = new EventType({
  type: 'USER_REMOVED',
});

const eventTypes = [
  userCreatedEvent,
  userRemovedEvent,
];

```

Once you're happy with your set of EventTypes you can move on to step 2: attaching the EventTypes to an actual EventStore! 🏪.


# Event Store

Welcome in the heart of Castore: the EventStore ❤️<br/>
The `EventStore` class lets you instantiate an object containing all the methods you will need to interact with your store. 💪

```typescript
const userEventStore = new EventStore({
  eventStoreId: 'Users',
  eventTypes,
  // 👇 See #reducer sub-section
  reducer,
  // 👇 See #storage_adapters section
  storageAdapter,
});
```

The class exposes 3 main methods

`getAggregate`: 


## Reducer

The reducer needed in the EventStore initialization is the function that will be applied to the sorted array of events in order to build the aggregate. ⚙️

Its interface is `(Aggregate, Union of all Events Details) => Aggregate`

Basically, it consists in a function implementing switch cases for all event types and returning the aggregate updated with your business logic. 🧠

Here is an example reducer for our User Event Store.

```ts
export const usersReducer = (
  userAggregate: UserAggregate,
  event: UserEventsDetails,
): UserAggregate => {
  const { version, aggregateId } = event;

  switch (event.type) {
    case 'USER_CREATED': {
      const { name, age } = event.payload;

      return {
        aggregateId,
        version: event.version,
        name,
        age,
        status: 'CREATED',
      };
    }
    case 'USER_REMOVED':
      return {
        ...userAggregate,
        version,
        status: 'DELETED',
      };
  }
};

```
# Storage Adapter

TODO

# Mock Events Builder

TODO
