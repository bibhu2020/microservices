import { Module } from '@nestjs/common';
import { McpService } from './mcp/mcp.service';

@Module({
  providers: [McpService],
})
export class AppModule {}
