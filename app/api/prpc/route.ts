import { NextRequest, NextResponse } from 'next/server';

/**
 * pRPC Proxy Endpoint
 * 
 * This endpoint proxies requests to pNode RPC servers to avoid CORS issues
 * and provide a single entry point for all pRPC calls.
 * 
 * Usage:
 * POST /api/prpc
 * Body: { method: 'get-pods', params: {} }
 * 
 * Environment Variables:
 * - PRPC_DEFAULT_ENDPOINT: Default pRPC endpoint (optional)
 * - PRPC_TIMEOUT: Request timeout in ms (default: 30000)
 */

interface PRPCRequest {
  method: string;
  params?: any;
  endpoint?: string; // Optional: override default endpoint
}

interface PRPCResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

// Default pRPC endpoint (can be overridden via env var or request body)
const DEFAULT_ENDPOINT = process.env.PRPC_DEFAULT_ENDPOINT || 'http://localhost:6000';
const TIMEOUT = parseInt(process.env.PRPC_TIMEOUT || '30000');

export async function POST(request: NextRequest) {
  try {
    const body: PRPCRequest = await request.json();
    const { method, params, endpoint } = body;

    if (!method) {
      return NextResponse.json(
        { error: 'Missing required field: method' },
        { status: 400 }
      );
    }

    // Use provided endpoint or fallback to default
    const targetEndpoint = endpoint || DEFAULT_ENDPOINT;

    // Create JSON-RPC request
    const rpcRequest = {
      jsonrpc: '2.0',
      method,
      params: params || {},
      id: Date.now(),
    };

    // Make request to pRPC endpoint with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(`${targetEndpoint}/rpc`, {
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

      const data: PRPCResponse = await response.json();

      // Check for JSON-RPC error
      if (data.error) {
        return NextResponse.json(
          { error: data.error.message, code: data.error.code },
          { status: 500 }
        );
      }

      return NextResponse.json(data.result);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout', timeout: TIMEOUT },
          { status: 504 }
        );
      }

      throw fetchError;
    }
  } catch (error: any) {
    console.error('pRPC proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Allow GET for health checks
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: DEFAULT_ENDPOINT,
    timeout: TIMEOUT,
    methods: ['POST'],
  });
}