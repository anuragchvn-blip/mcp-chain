import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

/**
 * MCP Bridge API
 * This API route bridges the browser frontend to the MCP server (which uses stdio transport)
 * It spawns the MCP server as a child process and communicates via JSON-RPC over stdio
 */

export async function POST(request: NextRequest) {
  try {
    const { tool, arguments: args } = await request.json();

    if (!tool || !args) {
      return NextResponse.json(
        { error: 'Missing tool or arguments' },
        { status: 400 }
      );
    }

    // Path to compiled MCP server
    const mcpServerPath = path.join(process.cwd(), 'dist', 'index.js');

    // Call MCP server and get response
    const result = await callMCPServer(mcpServerPath, tool, args);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('MCP Bridge Error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Spawns the MCP server and sends a tool call request via JSON-RPC
 */
async function callMCPServer(
  serverPath: string,
  toolName: string,
  toolArgs: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    // Spawn the MCP server process
    const mcpProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    mcpProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    mcpProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    mcpProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`MCP server exited with code ${code}: ${stderr}`));
        return;
      }

      // Parse the JSON-RPC response from stdout
      try {
        // The MCP server returns JSON-RPC messages
        // We need to parse the response that contains the tool result
        const lines = stdout.split('\n').filter(line => line.trim());
        
        // Look for the tool response (it will be a JSON-RPC result)
        for (const line of lines) {
          try {
            const message = JSON.parse(line);
            if (message.result && message.result.content) {
              // Extract the actual result from the content
              const content = message.result.content[0];
              if (content.type === 'text') {
                const result = JSON.parse(content.text);
                resolve(result);
                return;
              }
            }
          } catch (e) {
            // Skip non-JSON lines
            continue;
          }
        }

        reject(new Error('No valid response from MCP server'));
      } catch (error) {
        reject(new Error(`Failed to parse MCP response: ${error}`));
      }
    });

    mcpProcess.on('error', (error) => {
      reject(new Error(`Failed to start MCP server: ${error}`));
    });

    // Send the JSON-RPC request to the MCP server
    // First, send initialize request
    const initRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'mcp-bridge',
          version: '1.0.0',
        },
      },
    };

    mcpProcess.stdin.write(JSON.stringify(initRequest) + '\n');

    // Wait a bit then send the tool call
    setTimeout(() => {
      const toolRequest = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: toolArgs,
        },
      };

      mcpProcess.stdin.write(JSON.stringify(toolRequest) + '\n');
      mcpProcess.stdin.end();
    }, 100);

    // Timeout after 30 seconds
    setTimeout(() => {
      mcpProcess.kill();
      reject(new Error('MCP server timeout'));
    }, 30000);
  });
}
