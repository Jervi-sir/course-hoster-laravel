<x-mail::message>
    # New Comment

    **{{ $comment->user->name }}** left a comment on **{{ $comment->lesson->title }}**.

    > {{ \Illuminate\Support\Str::limit($comment->content, 100) }}

    <x-mail::button :url="route('lessons.show', [$comment->lesson->module->course->slug, $comment->lesson->slug])">
        View Comment
    </x-mail::button>

    Thanks,<br>
    {{ config('app.name') }}
</x-mail::message>