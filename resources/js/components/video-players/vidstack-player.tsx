import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

interface VidstackPlayerProps {
    title: string;
    videoUrl?: string;
    hlsUrl?: string;
    processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
    poster?: string;
}

export default function VidstackPlayer({ title, videoUrl, hlsUrl, processingStatus, poster }: VidstackPlayerProps) {
    if (processingStatus === 'processing' || processingStatus === 'pending') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-900 aspect-video rounded-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-4"></div>
                <p>Processing Video...</p>
                <p className="text-xs text-gray-400 mt-2">This may take a few minutes.</p>
            </div>
        );
    }

    if (!videoUrl && !hlsUrl) {
        return (
            <div className="w-full h-full flex items-center justify-center text-white bg-gray-800 aspect-video rounded-lg">
                Video source not available
            </div>
        );
    }

    const src = hlsUrl && processingStatus === 'completed'
        ? hlsUrl
        : videoUrl;

    return (
        <MediaPlayer
            title={title}
            src={src}
            viewType="video"
            streamType="on-demand"
            logLevel="warn"
            crossOrigin
            playsInline
            load="visible"
            className="w-full h-full aspect-video bg-black rounded-lg overflow-hidden"
            poster={poster}
        >
            <MediaProvider
                onProviderSetup={(provider) => {
                    if (provider.type === 'hls') {
                        provider.config = {
                            maxBufferLength: 30,
                            maxMaxBufferLength: 60,
                        };
                    }
                }}
            />
            <DefaultVideoLayout
                icons={defaultLayoutIcons}
                seekStep={10}
            />
        </MediaPlayer>
    );
}
