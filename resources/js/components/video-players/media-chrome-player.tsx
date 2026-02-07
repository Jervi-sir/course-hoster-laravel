import React, { useEffect, useRef } from 'react';
import 'media-chrome';
import 'hls-video-element';

// TypeScript declarations for custom elements if needed
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'media-controller': any;
            'media-control-bar': any;
            'media-play-button': any;
            'media-mute-button': any;
            'media-volume-range': any;
            'media-time-range': any;
            'media-time-display': any;
            'media-seek-backward-button': any;
            'media-seek-forward-button': any;
            'media-playback-rate-button': any;
            'media-fullscreen-button': any;
            'hls-video': any;
            'media-loading-indicator': any;
        }
    }
}

interface MediaChromePlayerProps {
    title: string;
    videoUrl?: string;
    hlsUrl?: string;
    processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
    poster?: string;
}

export default function MediaChromePlayer({ title, videoUrl, hlsUrl, processingStatus, poster }: MediaChromePlayerProps) {

    const src = hlsUrl && processingStatus === 'completed'
        ? hlsUrl
        : videoUrl;

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
            <media-controller className="w-full h-full">
                {src.endsWith('.m3u8') ? (
                    <hls-video
                        slot="media"
                        src={src}
                        poster={poster}
                        crossOrigin="anonymous"
                        playsInline
                    ></hls-video>
                ) : (
                    <video
                        slot="media"
                        src={src}
                        poster={poster}
                        crossOrigin="anonymous"
                        playsInline
                    ></video>
                )}

                <media-loading-indicator slot="centered-chrome" no-autohide></media-loading-indicator>

                {/* Top Bar for Title */}
                <media-control-bar>
                    <div className="text-white text-sm font-medium px-4 py-2 truncate flex-1">{title}</div>
                    <media-playback-rate-button></media-playback-rate-button>
                </media-control-bar>

                {/* Center Big Play Button (Optional, Media Chrome handles click to play on video) */}

                {/* Bottom Controls */}
                <media-control-bar>
                    <media-play-button></media-play-button>
                    <media-seek-backward-button seek-offset="10"></media-seek-backward-button>
                    <media-seek-forward-button seek-offset="10"></media-seek-forward-button>
                    <media-mute-button></media-mute-button>
                    <media-volume-range></media-volume-range>
                    <media-time-range></media-time-range>
                    <media-time-display show-duration remaining></media-time-display>
                    <media-fullscreen-button></media-fullscreen-button>
                </media-control-bar>
            </media-controller>
        </div>
    );
}
