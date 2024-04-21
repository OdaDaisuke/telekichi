'use client'
import { useState } from 'react';
import { HLSPlayer } from '@/components/video_player/player';

// 番組再生ページ
export default function Play() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  return <div>
    <HLSPlayer
      playsInline
      controls
      manifestUrl="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      ref={setVideo}
    />
  </div>
}
