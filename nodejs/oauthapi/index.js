import './utility/logger.js'; // Ensure this line is included to initialize the logger
import Server from './app.js'; // Import your Server class

// Start the App
const server = new Server();
server.start();