'use client'
import { useEffect, useState, useRef, MouseEventHandler } from 'react';
import { Volume } from '@/components/video_player/volume';
import { GoBack } from '@/components/video_player/go_back';
import { useRouter, useSearchParams } from 'next/navigation';
import { mirakurun } from '@/gateway/mirakurun';
import { MirakurunProgram } from '@/models/mirakurun';
import { apiClient } from '@/gateway/api';

// 番組再生ページ
export default function Play() {
  const searchParams = useSearchParams()
  const params = {
    ctype: searchParams.get('ctype'),
    cid: searchParams.get('cid'),
    sid: searchParams.get('sid'),
    pid: parseInt(`${searchParams.get('pid')}`, 10),
    vod: searchParams.get('vod'),
    recordingId: searchParams.get('recordingId'),
  }

  const isVod = params.vod === '1'

  const router = useRouter()
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);
  const [ssThumbnailRef, setSsThumbnailRef] = useState<HTMLDivElement | null>(null);
  const [seekBarLeft, setSeekBarLeft] = useState<number>(0);
  const [seekBarSize, setSeekBarSize] = useState<number>(0);

  const [volume, setVolumeState] = useState(1)
  const [muted, setMuted] = useState(false)
  const [enabledInfoUI, setInfoUI] = useState(false)
  const [programInfo, setProgramInfo] = useState<MirakurunProgram | null>(null)
  const [playableUrl, setPlayableUrl] = useState<string>("")
  const [ssThumbnailImageUrl, setSsThumbnailImageUrls] = useState<Array<string>>([])
  const finalVolume = muted ? 0 : volume ** 2
  const ssThumbnailWidth = 240

  useEffect(() => {
    if (isVod) {
      const recordingId = params.recordingId || ""
      apiClient.fetchRecordingStatus(recordingId).then(recordingStatus => {
        setPlayableUrl(recordingStatus.playableUrl)
        setSsThumbnailImageUrls(recordingStatus.ssThumbnailImageUrls)
        setProgramInfo(recordingStatus.programInfo.program)
      })

      if (wrapperRef != null) {
        setSeekBarLeft(wrapperRef.getBoundingClientRect().left)
        setSeekBarSize(parseInt(`${wrapperRef.getBoundingClientRect().width}`, 10))
      }
    } else {
      mirakurun.fetchProgramInfo(params.pid).then((program: MirakurunProgram) => {
        setPlayableUrl(`http://localhost:8081/stream/${params.ctype}/${params.cid}/services/${params.sid}`)
        setProgramInfo(program)
      })
    }
  }, [wrapperRef, ssThumbnailRef])

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
    if (isVod) {
      router.push('/recording/list')
    } else {
      router.push('/')
    }
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

  if (playableUrl.length === 0) {
    return <div>loading...</div>
  }

  const onSeekBarMove = (clientX: number) => {
    if (!ssThumbnailRef || !programInfo) {
      return
    }
    const firstThreshold = seekBarLeft + clientX
    const secondThreshold = seekBarLeft + seekBarSize
    const position = (firstThreshold) >= (secondThreshold) ? seekBarSize - ssThumbnailWidth * 2 : clientX - seekBarLeft
    ssThumbnailRef.style.left = `${position}px`

    // const durationSec = programInfo?.duration / 1000
    const durationSec = 13 * 60 + 25
    const cellWidth = 240
    const cellHeight = 135
    // ssThumbnailImageUrl[0] 10秒おき(10x10) 1000秒=1枚
    const targetSecPosition = durationSec * ((clientX - seekBarLeft) / seekBarSize)
    const targetSsThumbnailPage = Math.floor(targetSecPosition / 1000)
    const targetSsThumbnailX = Math.floor((targetSecPosition % 1000) % 10) * cellWidth
    const targetSsThumbnailY = Math.floor((targetSecPosition % 1000) / 10) * cellHeight
    console.log('t', targetSsThumbnailX, targetSsThumbnailY)
    if (!ssThumbnailRef.style.backgroundImage.includes(ssThumbnailImageUrl[targetSsThumbnailPage])) {
      ssThumbnailRef.style.backgroundImage = `url(${ssThumbnailImageUrl[targetSsThumbnailPage]})`
    }
    ssThumbnailRef.style.backgroundPositionX = `${targetSsThumbnailX}px`
    ssThumbnailRef.style.backgroundPositionY = `${targetSsThumbnailY}px`
  }

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
    {isVod && <div className="absolute left-96 bottom-4"  style={{width: '80%'}}>
      <div ref={setWrapperRef} className="cursor-pointer w-full" onMouseMove={(event) => { onSeekBarMove(event.clientX)}}>
        <div ref={setSsThumbnailRef} style={{backgroundColor: '#2f2f2f',width: '240px', height: '130px', position: 'absolute', top: '-120px', }}></div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={1}
          className="w-full"
          style={{width: '80%'}}
          onChange={event => {
            console.log('seeked', event)
          }}
        />
      </div>
    </div>}
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
