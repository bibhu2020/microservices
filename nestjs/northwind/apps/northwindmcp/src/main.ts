import { config } from 'dotenv';
config();

import * as http from 'http';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './northwindmcp.module';
import { McpService } from './mcp/mcp.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const mcpService = appContext.get(McpService);

  const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/mcp') 
      
      await mcpService.handleSSE(req, res);
     else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(3000, () => {
    console.log('MCP SSE server is listening at http://localhost:3000/mcp');
  });
}
bootstrap();
