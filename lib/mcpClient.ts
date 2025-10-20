// MCP Client for communicating with the MCP server from the frontend
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

let mcpClient: Client | null = null;

export async function initMCPClient() {
  if (mcpClient) return mcpClient;

  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js'],
  });

  mcpClient = new Client(
    {
      name: 'chainmind-web-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  await mcpClient.connect(transport);
  console.log('MCP Client connected to server');
  
  return mcpClient;
}

export async function callMCPTool(toolName: string, args: any) {
  const client = await initMCPClient();
  
  const result = await client.callTool({
    name: toolName,
    arguments: args,
  });

  return result;
}

export async function listMCPTools() {
  const client = await initMCPClient();
  const tools = await client.listTools();
  return tools;
}
