import { NextRequest, NextResponse } from 'next/server';

/**
 * Dynamic pRPC Proxy Endpoint
 * Compatible with Next.js 14 and 15
 */

interface RPCRequest {
  jsonrpc: string;
  method: string;
  params?: any;
  id: number;
}

interface RPCResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

const DEFAULT_ENDPOINT = process.env.PRPC_DEFAULT_ENDPOINT || 'http://localhost:6000';
const TIMEOUT = parseInt(process.env.PRPC_TIMEOUT || '30000');

export async function POST(
  request: NextRequest,
  context: { params: { path: string[] } | Promise<{ path: string[] }> }
) {
  try {
    // Handle both Next.js 14 (sync) and Next.js 15 (async) params
    const resolvedParams = context.params instanceof Promise 
      ? await context.params 
      : context.params;
    
    const method = resolvedParams.path.join('-');
    
    if (!method) {
      return NextResponse.json(
        { error: 'Missing method in path' },
        { status: 400 }
      );
    }

    let rpcParams = {};
    try {
      const body = await request.json();
      rpcParams = body.params || body || {};
    } catch {
      // No body is fine
    }

    const endpoint = request.nextUrl.searchParams.get('endpoint') || DEFAULT_ENDPOINT;

    const rpcRequest: RPCRequest = {
      jsonrpc: '2.0',
      method,
      params: rpcParams,
      id: Date.now(),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(`${endpoint}/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rpcRequest),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`pRPC request failed: ${response.status} ${response.statusText}`);
      }

      const data: RPCResponse = await response.json();

      if (data.error) {
        return NextResponse.json(
          { 
            error: data.error.message, 
            code: data.error.code,
            method 
          },
          { status: 500 }
        );
      }

      return NextResponse.json(data.result);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout', timeout: TIMEOUT, method },
          { status: 504 }
        );
      }

      throw fetchError;
    }
  } catch (error: any) {
    console.error('pRPC dynamic proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { path: string[] } | Promise<{ path: string[] }> }
) {
  // Handle both Next.js 14 (sync) and Next.js 15 (async) params
  const resolvedParams = context.params instanceof Promise 
    ? await context.params 
    : context.params;
  
  const method = resolvedParams.path.join('-');
  
  return NextResponse.json({
    method,
    endpoint: DEFAULT_ENDPOINT,
    usage: `POST /api/prpc/${resolvedParams.path.join('/')}`,
    body: { params: {} },
  });
}