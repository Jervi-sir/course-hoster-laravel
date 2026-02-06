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
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 3600;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 1;

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
        // Increase memory limit for video processing
        ini_set('memory_limit', '2048M');
        set_time_limit(0); // Prevent PHP max_execution_time limit

        $this->lesson->update(['video_processing_status' => 'processing']);

        $hlsDirectory = 'courses/hls/' . $this->lesson->id;
        $hlsPath = $hlsDirectory . '/playlist.m3u8';

        // Define generic bitrates (you can tune these)
        $bitrate240 = (new X264)->setKiloBitrate(250)->setAdditionalParameters(['-preset', 'veryfast']);   // ~240p
        $bitrate360 = (new X264)->setKiloBitrate(500)->setAdditionalParameters(['-preset', 'veryfast']);   // ~360p
        $bitrate480 = (new X264)->setKiloBitrate(1000)->setAdditionalParameters(['-preset', 'veryfast']);  // ~480p
        $bitrate720 = (new X264)->setKiloBitrate(2500)->setAdditionalParameters(['-preset', 'veryfast']);  // ~720p
        $bitrate1080 = (new X264)->setKiloBitrate(4500)->setAdditionalParameters(['-preset', 'veryfast']); // ~1080p

        FFMpeg::fromDisk('public')
            ->open($this->videoPath)
            ->exportForHLS()
            ->toDisk('local') // Save to private storage
            ->addFormat($bitrate240, function ($media) {
                $media->addFilter('scale=426:240');
            })
            ->addFormat($bitrate360, function ($media) {
                $media->addFilter('scale=640:360');
            })
            ->addFormat($bitrate480, function ($media) {
                $media->addFilter('scale=854:480');
            })
            ->addFormat($bitrate720, function ($media) {
                $media->addFilter('scale=1280:720');
            })
            ->addFormat($bitrate1080, function ($media) {
                $media->addFilter('scale=1920:1080');
            })
            ->save($hlsPath);

        // Get Duration (simple check from original source)
        $media = FFMpeg::fromDisk('public')->open($this->videoPath);
        $durationInSeconds = $media->getDurationInSeconds();

        $this->lesson->update([
            'video_hls_path' => $hlsPath,
            'duration_minutes' => round($durationInSeconds / 60),
            'video_processing_status' => 'completed',
        ]);
    }
}
