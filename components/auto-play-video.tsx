"use client";

import { useRef, useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";

export default function AutoPlayVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.currentTime = 0;
            video.muted = true;
            setIsMuted(true);
            video.play().then(() => {
              setIsPlaying(true);
              if (hasInteracted) {
                video.muted = false;
                setIsMuted(false);
              }
            }).catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(container);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      observer.disconnect();
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [hasInteracted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    setHasInteracted(true);

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    setHasInteracted(true);
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;

    setHasInteracted(true);
    video.currentTime = 0;
    video.muted = false;
    setIsMuted(false);
    video.play();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] bg-black"
    >
      <video
        ref={videoRef}
        src="/videos/final-demo.mp4"
        className="w-full h-full object-contain"
        playsInline
        muted
      />

      {isPlaying && isMuted && !hasInteracted && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 cursor-pointer"
          onClick={() => {
            const video = videoRef.current;
            if (video) {
              setHasInteracted(true);
              video.muted = false;
              setIsMuted(false);
            }
          }}
        >
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
              <Volume2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <p className="text-white text-base sm:text-lg font-light">Click to unmute</p>
          </div>
        </div>
      )}

      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 cursor-pointer"
          onClick={togglePlay}
        >
          <button className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300 border border-white/30">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 text-white" />
          </button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-4 px-4 z-30">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={restart}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/25 transition-all duration-300 border border-white/20"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            ) : (
              <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 text-white" />
            )}
          </button>

          <button
            onClick={toggleMute}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
