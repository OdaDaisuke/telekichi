import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import Hls from "hls.js";

interface Props extends React.HTMLProps<HTMLVideoElement> {
  manifestUrl: string;
}

const _HLSPlayer = forwardRef<HTMLVideoElement, Props>(
  ({ manifestUrl, ...props }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => videoRef.current!);

    useEffect(() => {
      const src = manifestUrl;
      const { current: video } = videoRef;
      if (!video) return;

      let hls: Hls | null;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // safari
        video.src = src;
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      }

      return () => hls?.destroy();
    }, [manifestUrl]);

    return <video
      className="w-full h-full z-20 top-0 left-0"
      {...props}
      playsInline
      autoPlay
      ref={videoRef}
    />;
  }
);

_HLSPlayer.displayName = "HLSPlayer";

export const HLSPlayer = _HLSPlayer;
