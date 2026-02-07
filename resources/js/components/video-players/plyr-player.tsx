import React, { useRef, useEffect } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Hls from 'hls.js';

interface VideoPlayerProps {
    title: string;
    videoUrl?: string;           // Fallback or MP4 URL
    hlsUrl?: string;             // Secure HLS URL
    processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
    poster?: string;
}

export default function PlyrPlayer({ title, videoUrl, hlsUrl, processingStatus, poster }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<Plyr | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    // Determine the effective source URL
    // If HLS is completed and available, use it. Otherwise fallback to videoUrl.
    const src = hlsUrl && processingStatus === 'completed'
        ? hlsUrl
        : videoUrl;

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        const defaultOptions: Plyr.Options = {
            controls: [
                'play-large', // The large play button in the center
                'play',       // Play/pause playback
                'progress',   // The progress bar and scrubber for playback and buffering
                'current-time', // The current time of playback
                'duration',   // The full duration of the media
                'mute',       // Toggle mute
                'volume',     // Volume control
                'captions',   // Toggle captions
                'settings',   // Settings menu
                'pip',        // Picture-in-picture (supported browsers only)
                'airplay',    // Airplay (supported browsers only)
                'fullscreen', // Toggle fullscreen
            ],
            settings: ['captions', 'quality', 'speed', 'loop'],
            speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        };

        const initPlyr = () => {
            // Destroy existing player if any to avoid duplicates on re-render
            if (playerRef.current) return;
            playerRef.current = new Plyr(video, defaultOptions);
        };

        if (src.endsWith('.m3u8') && Hls.isSupported()) {
            // HLS Setup
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hlsRef.current = hls;

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                // Get available quality levels
                const availableQualities = hls.levels.map((l) => l.height);
                // Add 'Auto' (0 or empty string might be preferred but let's stick to heights first, maybe add 0 if we want 'Auto' handling logic)
                // Plyr expects numbers. Often 0 is used for 'Auto'.
                // But HLS.js auto level is -1.

                // Let's prepend '0' for Auto if we want.
                // However, Plyr's quality menu is just a list of numbers. 
                // We'll create a mapping or just pass levels.

                // Sort descending
                availableQualities.sort((a, b) => b - a);

                defaultOptions.quality = {
                    default: availableQualities[0],
                    options: availableQualities,
                    forced: true,
                    onChange: (newQuality: number) => {
                        hls.levels.forEach((level, levelIndex) => {
                            if (level.height === newQuality) {
                                hls.currentLevel = levelIndex;
                            }
                        });
                    },
                };
                initPlyr();
            });
        } else {
            // Native Video (MP4/Youtube/Vimeo)
            // For Youtube/Vimeo, Plyr handles it via source prop usually, but here we treat it as direct file.
            // If we want Youtube support, we need to pass standard Plyr source object.
            // But for now assuming direct file or HLS.
            video.src = src;
            initPlyr();
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        }
    }, [src, title]);

    // Processing State UI
    if (processingStatus === 'processing' || processingStatus === 'pending') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-900 aspect-video rounded-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-4"></div>
                <p>Processing Video...</p>
                <p className="text-xs text-gray-400 mt-2">This may take a few minutes.</p>
            </div>
        );
    }

    if (!src) {
        return (
            <div className="w-full h-full flex items-center justify-center text-white bg-gray-800 aspect-video rounded-lg">
                Video source not available
            </div>
        );
    }

    return (
        <div className="rounded-lg overflow-hidden shadow-lg w-full aspect-video">
            <video
                ref={videoRef}
                className="plyr-react plyr"
                playsInline
                controls
                crossOrigin="anonymous"
                poster={poster}
            />
        </div>
    );
}
