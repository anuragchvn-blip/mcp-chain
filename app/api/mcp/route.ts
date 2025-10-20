// API route that proxies requests to the MCP server
import { NextRequest, NextResponse } from 'next/server';
import { callMCPTool, listMCPTools } from '@/lib/mcpClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, toolName, args } = body;

    if (action === 'listTools') {
      const tools = await listMCPTools();
      return NextResponse.json({ success: true, tools });
    }

    if (action === 'callTool') {
      const result = await callMCPTool(toolName, args);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action. Use "listTools" or "callTool"' 
    }, { status: 400 });

  } catch (error) {
    console.error('MCP API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
