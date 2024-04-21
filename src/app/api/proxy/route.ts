import { NextApiRequest, NextApiResponse } from 'next';
import http from 'http';
import { Readable } from 'node:stream';

// MPEG2-TSのストリームを中継する
// 動かない
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // MPEG2-TSストリームのソースURL
    const streamUrl = 'http://192.168.40.71:40772/api/channels/GR/16/stream'; // ここに実際のストリームのURLを入力してください
    
    // ソースURLからストリームを取得
    http.get(streamUrl, (streamRes) => {
      res.setHeader('Content-Type', 'video/mp2t');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Connection', 'keep-alive');
  
      streamRes.pipe(res);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
