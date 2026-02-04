<x-mail::message>
    # Welcome, {{ $user->name }}!

    You have successfully enrolled in **{{ $course->title }}**. We are excited to have you on board.

    <x-mail::button :url="route('courses.show', $course->slug)">
        Go to Course
    </x-mail::button>

    Happy Learning,<br>
    {{ config('app.name') }}
</x-mail::message>