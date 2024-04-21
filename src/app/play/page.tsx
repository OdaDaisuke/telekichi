'use client'
import { useEffect, useState } from 'react';
import { HLSPlayer } from '@/components/video_player/player';
import { Volume } from '@/components/video_player/volume';
import { GoBack } from '@/components/video_player/go_back';
import { useRouter } from 'next/navigation';
import { mirakurun } from '@/gateway/mirakurun';
import { MirakurunEvent } from '@/models/mirakurun';
import { useRef } from 'react';
import mpegts from 'mpegts.js'

// 番組再生ページ
export default function Play() {
  const router = useRouter()
  const tsRef = useRef<HTMLVideoElement>(null)
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [volume, setVolumeState] = useState(1)
  const [muted, setMuted] = useState(false)
  const [enabledInfoUI, setInfoUI] = useState(false)
  const [programInfo, setProgramInfo] = useState<MirakurunEvent | null>(null)
  const finalVolume = muted ? 0 : volume ** 2

  useEffect(() => {
    const programId = 0
    mirakurun.fetchEventInfo(programId).then((program: MirakurunEvent) => {
      setProgramInfo(program)
    })

    if (mpegts.getFeatureList().mseLivePlayback) {
      var videoElement = document.getElementById('videoElement');
      var player = mpegts.createPlayer({
          type: 'mse',  // could also be mpegts, m2ts, flv
          isLive: true,
          url: 'http://192.168.40.71:40772/api/channels/GR/16/stream'
      });
      if (videoElement) {
        player.attachMediaElement(videoElement as HTMLMediaElement);
        player.load();
      }
  }
  }, [])

  const setVolume = (volume: number) => {
    if (video) {
      setVolumeState(volume)
      video.volume = volume
      if (volume <= 0.0) {
        setMuted(true)
      }
    }
  }

  const onClickPlay = () => {
    try {
      if (video) {
        if (video.paused) {
          video.play()
        } else {
          video.pause()
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onChangeVolume = (volume: number) => {
    setVolume(volume)
  }

  const onToggleMute = () => {
    setMuted(!muted)
    setVolume(muted ? 1 : 0)
  }

  const onClickGoback = () => {
    // 番組表ページに固定移動
    router.push('/')
  }

  const onClickOpenInfo = () => {
    if (video) {
      video.pause()
    }
    setInfoUI(true)
  }

  const onClickCloseInfo = () => {
    if (video) {
      video.play()
    }
    setInfoUI(false)
  }

  const manifetsUrl = "http://192.168.40.71:40772/api/iptv/playlist"
  // const manifetsUrl = "http://192.168.40.71:40772/api/channels/GR/16/stream"
  // const manifestUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"

  return <div className="w-full h-full fixed top-0 left-0 z-10 bg-black">
    <video controls className="absolute z-50 l-0 t-0 w-full h-full block" id="videoElement" ref={tsRef}/>
    {/* <HLSPlayer
      manifestUrl={manifetsUrl}
      ref={setVideo}
    />
    <header className="absolute top-0 left-0 pt-4 pl-4 w-full h-24 bg-gradient-to-b from-gray-500 to-blugraye-300 to-transparent">
      <GoBack onClick={onClickGoback}/>
      <h3 className="absolute text-2xl font-bold left-24 pt-3">{programInfo?.name}</h3>
    </header>
    <Volume
      volume={finalVolume}
      muted={muted}
      onChange={onChangeVolume}
      onToggleMute={onToggleMute}
    />
    <button
      type="button"
      onClick={onClickPlay}
      className="absolute left-4 bottom-4 z-20 text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-lg px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      <span className="i-lucide-play"></span>
    </button>
    <button
      type="button"
      onClick={onClickOpenInfo}
      className="absolute left-24 bottom-4 z-20 text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-lg px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      <span className="i-lucide-info"></span>
    </button> */}
    {enabledInfoUI && programInfo && <div className="absolute right-0 top-0 h-screen w-96 p-4 bg-gray-800">
      <div onClick={onClickCloseInfo} className="cursor-pointer">
        <span className="text-5xl i-lucide-circle-x mb-2"></span>
      </div>
      <h3 className="text-2xl font-bold mb-2">{programInfo.name}</h3>
      <p className="mb-2">{programInfo.description}</p>
      <div className="text-gray-200 text-xs">{(new Date(programInfo.startAt).toDateString())}</div>
    </div>}
  </div>
}
