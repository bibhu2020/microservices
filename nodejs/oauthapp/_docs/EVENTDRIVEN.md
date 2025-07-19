## Azure Event Grid
Azure Event Grid is a highly scalable, fully managed Pub Sub message distribution service that offers flexible message consumption patterns using the Hypertext Transfer Protocol (HTTP) and Message Queuing Telemetry Transport (MQTT) protocols.

Event Grid can be configured to send events to subscribers (push delivery) or subscribers can connect to Event Grid to read events (pull delivery). Event Grid supports CloudEvents 1.0 specification to provide interoperability across systems.

Event Grid conforms to Cloud Native Computing Foundation’s open standard CloudEvents 1.0 specification using the HTTP protocol binding with JSON format. Event message look like below.

```JSON
{
    "specversion" : "1.0",
    "type" : "com.yourcompany.order.created",
    "source" : "https://yourcompany.com/orders/",
    "subject" : "O-28964",
    "id" : "A234-1234-1234",
    "time" : "2018-04-05T17:31:00Z",
    "comexampleextension1" : "value",
    "comexampleothervalue" : 5,
    "datacontenttype" : "application/json",
    "data" : {
       "orderId" : "O-28964",
       "URL" : "https://com.yourcompany/orders/O-28964"
    }
}
```

**Topic**
A topic holds events that have been published to Event Grid. You typically use a topic resource for a collection of related events. Type of topics:
- System Topic
- Custom Topic
- Partner Topic


