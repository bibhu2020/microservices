
import './utility/logger.js'; // Ensure this line is included to initialize the logger
import Server from './app.js'; // Import your Server class

import dotenv from 'dotenv';
dotenv.config();

// Start the App
const server = new Server();
server.start();