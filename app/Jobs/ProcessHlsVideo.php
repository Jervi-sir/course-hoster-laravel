<?php

namespace App\Jobs;

use App\Models\Lesson;
use FFMpeg\Format\Video\X264;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class ProcessHlsVideo implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Lesson $lesson, public string $videoPath)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->lesson->update(['video_processing_status' => 'processing']);

        $hlsDirectory = 'courses/hls/' . $this->lesson->id;
        $hlsPath = $hlsDirectory . '/playlist.m3u8';

        // Ensure directory exists (optional, store handles it usually)

        // Single bitrate for dev speed, can add more for production
        $lowBitrate = (new X264)->setKiloBitrate(1000);

        FFMpeg::fromDisk('public')
            ->open($this->videoPath)
            ->exportForHLS()
            ->addFormat($lowBitrate)
            ->save($hlsPath);

        // Get Duration
        $media = FFMpeg::fromDisk('public')->open($this->videoPath);
        $durationInSeconds = $media->getDurationInSeconds();

        $this->lesson->update([
            'video_hls_path' => $hlsPath,
            'duration_minutes' => round($durationInSeconds / 60),
            'video_processing_status' => 'completed',
        ]);

        // Cleanup original if desired? User might want to keep it. 
        // "support large video without fully download it" -> implies streaming HLS is the goal.
    }
}
