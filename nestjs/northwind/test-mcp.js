const EventSource = require('eventsource'); // Use CommonJS import

// Initialize the EventSource connection
const eventSource = new EventSource("http://localhost:3000/mcp");

eventSource.onopen = function () {
  console.log("Connection established.");
};

eventSource.onmessage = function (event) {
  console.log("Received event data:", event.data);
};

eventSource.onerror = function (err) {
  console.error("Error in EventSource:", err);
};
