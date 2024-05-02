'use client'
import { useEffect, useState } from 'react';
import { useKey } from 'react-use';
import { Volume } from '@/components/video_player/volume';
import { GoBack } from '@/components/video_player/go_back';
import { useRouter, useSearchParams } from 'next/navigation';
import { mirakurun } from '@/gateway/mirakurun';
import { MirakurunProgram } from '@/models/mirakurun';
import { MirakurunChannelList } from '@/models/mirakurun'
import { getNextChannel } from '@/object_value/channels'

// 番組再生ページ
export default function Play() {
  const searchParams = useSearchParams()
  const params = {
    ctype: searchParams.get('ctype'),
    cid: searchParams.get('cid') || "",
    sid: searchParams.get('sid'),
    pid: parseInt(`${searchParams.get('pid')}`, 10),
  }

  const router = useRouter()
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [volume, setVolumeState] = useState(1)
  const [muted, setMuted] = useState(false)
  const [enabledInfoUI, setInfoUI] = useState(false)
  const [programInfo, setProgramInfo] = useState<MirakurunProgram | null>(null)
  const [channels, setChannels] = useState<MirakurunChannelList>([])
  const finalVolume = muted ? 0 : volume ** 2

  // アルファ版(キーボード操作による番組切り替え)
  useKey('ArrowLeft', (e: KeyboardEvent) => {
    console.log('e', e)
  });
  useKey('ArrowRight', (e: KeyboardEvent) => {
    const nextChannel = getNextChannel(params.cid, channels)
    console.log('next', nextChannel)
    // router.push(`/play?ctype=${params.ctype}&cid=${nextChannel.channel}&sid=${nextChannel.services[0].id}&pid=327390104816587`)
    // setTimeout(() => {
    //   location.reload()
    // }, 100)
  }, undefined, [channels]);

  useEffect(() => {
    mirakurun.fetchProgramInfo(params.pid).then((program: MirakurunProgram) => {
      setProgramInfo(program)
    })

    mirakurun.fetchChannels().then(channels => {
      setChannels(channels)
    })
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
    setInfoUI(true)
  }

  const onClickCloseInfo = () => {
    if (video) {
      video.play()
    }
    setInfoUI(false)
  }

  // proxy serverのURL
  // const playableUrl = "http://localhost:8081/stream/GR/16/services/3239123608"
  const playableUrl = `http://localhost:8081/stream/${params.ctype}/${params.cid}/services/${params.sid}`

  return <div className="w-full h-full fixed top-0 left-0 z-10 bg-black">
    <video ref={setVideo} className="w-full h-full">
      <source src={playableUrl} type="video/webm"></source>
    </video>
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
    </button>
    {/* info modal */}
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
