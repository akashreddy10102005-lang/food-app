import { NextRequest, NextResponse } from 'next/server';
import { asr } from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { audio } = await request.json();

    if (!audio) {
      return NextResponse.json({ error: 'No audio provided' }, { status: 400 });
    }

    // Transcribe audio using ASR
    const transcription = await asr.transcribe({
      audio: `data:audio/wav;base64,${audio}`,
    });

    // Parse the transcription to extract food information
    const text = transcription.text || transcription;

    return NextResponse.json({
      text,
      transcription,
    });
  } catch (error) {
    console.error('Error processing voice input:', error);
    return NextResponse.json({ error: 'Failed to process voice input' }, { status: 500 });
  }
}
