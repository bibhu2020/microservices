import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Pool } from 'pg';
import { IncomingMessage, ServerResponse } from 'http';


@Injectable()
export class McpService implements OnModuleInit {
  private readonly server: Server;
  private readonly pool: Pool;
  private readonly SCHEMA_PATH = 'schema';
  private readonly resourceBaseUrl: URL;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL must be defined in the environment');
    }

    this.resourceBaseUrl = new URL(databaseUrl);
    this.pool = new Pool({ connectionString: databaseUrl });

    this.server = new Server(
      {
        name: 'nestjs-mcp/postgres',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      },
    );
  }

  async onModuleInit() {
    this.registerHandlers();
    console.log('MCP server initialized and ready (SSE mode)');
  }

  async handleSSE(req: IncomingMessage, res: ServerResponse) {
    const transport = new SSEServerTransport('/mcp', res);
    await this.server.connect(transport);
  }

  

  private registerHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const client = await this.pool.connect();
      try {
        const result = await client.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
        );
        return {
          resources: result.rows.map((row) => ({
            uri: new URL(`${row.table_name}/${this.SCHEMA_PATH}`, this.resourceBaseUrl).href,
            mimeType: 'application/json',
            name: `"${row.table_name}" database schema`,
          })),
        };
      } finally {
        client.release();
      }
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const resourceUrl = new URL(request.params.uri);
      const pathComponents = resourceUrl.pathname.split('/');
      const schema = pathComponents.pop();
      const tableName = pathComponents.pop();

      if (schema !== this.SCHEMA_PATH) {
        throw new Error('Invalid resource URI');
      }

      const client = await this.pool.connect();
      try {
        const result = await client.query(
          'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1',
          [tableName],
        );
        return {
          contents: [
            {
              uri: request.params.uri,
              mimeType: 'application/json',
              text: JSON.stringify(result.rows, null, 2),
            },
          ],
        };
      } finally {
        client.release();
      }
    });

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'query',
            description: 'Run a read-only SQL query',
            inputSchema: {
              type: 'object',
              properties: {
                sql: { type: 'string' },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'query') {
        const sql = request.params.arguments?.sql as string;

        const client = await this.pool.connect();
        try {
          await client.query('BEGIN TRANSACTION READ ONLY');
          const result = await client.query(sql);
          return {
            content: [{ type: 'text', text: JSON.stringify(result.rows, null, 2) }],
            isError: false,
          };
        } catch (error) {
          console.error('SQL error:', error);
          throw error;
        } finally {
          client.query('ROLLBACK').catch((err) =>
            console.warn('Could not roll back transaction:', err),
          );
          client.release();
        }
      }
      throw new Error(`Unknown tool: ${request.params.name}`);
    });
  }
}
