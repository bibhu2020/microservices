import Server from '../server.js'; // Import your Server class

// It's a Singleton Test WebServer. A wrapper on the actual server.
// It ensure you have only one instance of the web server is running. 

class SingletonWebServer {
  constructor() {
    if (!SingletonWebServer.instance) {
      this.server = new Server();
      this.isServerStarted = false; // Flag to track server start state
      SingletonWebServer.instance = this;
    }
    return SingletonWebServer.instance;
  }

  start() {
    if (!this.isServerStarted) {
      // Code to start the web server
      this.server.start();
      console.log("Web server started");
      this.isServerStarted = true; // Update flag
    } else {
      console.log("Web server is already running");
    }
  }

  stop() {
    if (this.isServerStarted) {
      // Code to stop the web server
      console.log("Web server stopped");
      this.isServerStarted = false; // Update flag
    } else {
      console.log("Web server is not running");
    }
  }
}

const server = new SingletonWebServer();

export default server;
