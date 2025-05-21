// API route helpers and configurations
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Helper function to handle API errors
export function handleApiError(error: any) {
  console.error('API Error:', error);
  return new Response(
    JSON.stringify({
      success: false,
      message: error.message || 'An error occurred',
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Helper function to respond with JSON
export function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 