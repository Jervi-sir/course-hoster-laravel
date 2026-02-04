<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:video,article,quiz,file'],
            'content' => ['nullable', 'string'],
            'video' => ['nullable', 'file', 'mimes:mp4,mov,avi,wmv', 'max:102400'], // 100MB max
            'video_url' => ['nullable', 'string'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'is_preview' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Please provide a lesson title.',
            'type.required' => 'Please select a lesson type.',
            'video.mimes' => 'Video must be in MP4, MOV, AVI, or WMV format.',
            'video.max' => 'Video size cannot exceed 100MB.',
        ];
    }
}
