<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'price' => ['required', 'numeric', 'min:0'],
            'level' => ['required', 'in:beginner,intermediate,advanced'],
            'status' => ['nullable', 'in:draft,published,archived'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Please provide a course title.',
            'price.required' => 'Please set a price for the course.',
            'price.min' => 'Price cannot be negative.',
            'level.required' => 'Please select a difficulty level.',
            'thumbnail.image' => 'Thumbnail must be an image file.',
            'thumbnail.max' => 'Thumbnail size cannot exceed 2MB.',
        ];
    }
}
