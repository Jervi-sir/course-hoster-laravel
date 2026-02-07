import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
// import Player from 'video.js/dist/types/player'; // Type only

interface VideoJsPlayerProps {
    title: string;
    videoUrl?: string;
    hlsUrl?: string;
    processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
    poster?: string;
}

export default function VideoJsPlayer({ title, videoUrl, hlsUrl, processingStatus, poster }: VideoJsPlayerProps) {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null); // videojs.Player

    const src = hlsUrl && processingStatus === 'completed'
        ? hlsUrl
        : videoUrl;

    useEffect(() => {
        // Init player
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add('vjs-big-play-centered');
            if (videoRef.current) {
                videoRef.current.appendChild(videoElement);
            }

            const options = {
                autoplay: false,
                controls: true,
                responsive: true,
                fluid: true,
                poster: poster,
                playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
                sources: [{
                    src: src,
                    type: src?.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
                }]
            };

            playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
            });
        } else {
            // Update player
            const player = playerRef.current;
            player.src({
                src: src,
                type: src?.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
            });
            player.poster(poster);
        }
    }, [src, poster, videoRef]);

    useEffect(() => {
        const player = playerRef.current;
        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, []);

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
        <div data-vjs-player className="rounded-lg overflow-hidden shadow-lg w-full aspect-video">
            <div ref={videoRef} className="w-full h-full" />
        </div>
    );
}
