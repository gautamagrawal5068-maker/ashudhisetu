import { NextResponse } from 'next/server';
import { extractFromImage } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, mimeType, apiKey } = body;
    
    if (!image) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    const type = mimeType || 'image/jpeg';
    
    // Call the gemini wrapper function with optional custom API key
    const result = await extractFromImage(image, type, apiKey);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Extraction API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract data from image' },
      { status: 500 }
    );
  }
}
