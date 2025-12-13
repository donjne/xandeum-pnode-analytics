import { NextRequest, NextResponse } from 'next/server';

/**
 * Dynamic pRPC Proxy Endpoint
 * 
 * This allows calling pRPC methods via URL paths:
 * POST /api/prpc/get-pods -> calls 'get-pods' method
 * POST /api/prpc/get-pods-with-stats -> calls 'get-pods-with-stats' method
 * 
 * This is more RESTful than the generic /api/prpc endpoint.
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
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params in Next.js 15
    const { path } = await params;
    
    // Extract method from path (e.g., ['get-pods'] or ['get-pods-with-stats'])
    const method = path.join('-');
    
    if (!method) {
      return NextResponse.json(
        { error: 'Missing method in path' },
        { status: 400 }
      );
    }

    // Get request body as params
    let rpcParams = {};
    try {
      const body = await request.json();
      rpcParams = body.params || body || {};
    } catch {
      // No body is fine for methods without params
    }

    // Get optional endpoint override from query params
    const endpoint = request.nextUrl.searchParams.get('endpoint') || DEFAULT_ENDPOINT;

    // Create JSON-RPC request
    const rpcRequest: RPCRequest = {
      jsonrpc: '2.0',
      method,
      params: rpcParams,
      id: Date.now(),
    };

    // Make request with timeout
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

      // Check for JSON-RPC error
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

// GET for method info
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // Await params in Next.js 15
  const { path } = await params;
  const method = path.join('-');
  
  return NextResponse.json({
    method,
    endpoint: DEFAULT_ENDPOINT,
    usage: `POST /api/prpc/${path.join('/')}`,
    body: { params: {} },
  });
}