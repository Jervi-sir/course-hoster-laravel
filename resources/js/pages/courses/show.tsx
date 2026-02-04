import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Course } from '@/types';
import { Star, StarHalf } from 'lucide-react';

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        profile_photo_url?: string;
    };
}

interface CourseWithError extends Course {
    modules?: {
        id: number;
        title: string;
        lessons: {
            id: number;
            title: string;
            duration_minutes: number;
        }[];
    }[];
    lessons_count?: number;
    reviews?: Review[];
    reviews_avg_rating?: string; // Laravel avg returns string sometimes? usually float but let's be safe
}

interface CourseShowProps {
    course: CourseWithError;
    isEnrolled: boolean;
    canReview: boolean;
}

export default function CourseShow({ course, isEnrolled, canReview }: CourseShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Courses',
            href: '/courses',
        },
        {
            title: course.title,
            href: `/courses/${course.slug}`,
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        comment: '',
    });

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/courses/${course.id}/reviews`, {
            onSuccess: () => reset(),
        });
    };

    const avgRating = parseFloat(course.reviews_avg_rating || '0');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />
            <div className="flex flex-col gap-8 p-4 md:p-8 max-w-5xl mx-auto w-full">

                {/* Hero Section */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 capitalize">
                                    {course.level}
                                </span>
                                {avgRating > 0 && (
                                    <div className="flex items-center text-yellow-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="ml-1 text-sm font-medium text-foreground">{avgRating.toFixed(1)}</span>
                                        <span className="ml-1 text-sm text-muted-foreground">({course.reviews?.length} reviews)</span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{course.title}</h1>
                            <p className="text-lg text-muted-foreground">{course.description}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{course.lessons_count} Lessons</span>
                            <span>•</span>
                            <span>Updated {new Date(course.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden sticky top-4">
                            <div className="aspect-video w-full bg-muted">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                        No Thumbnail
                                    </div>
                                )}
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="text-3xl font-bold">
                                    {isEnrolled ? (
                                        <span className="text-green-600">Enrolled</span>
                                    ) : (
                                        parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`
                                    )}
                                </div>

                                {isEnrolled ? (
                                    <Link
                                        href={`/courses/${course.slug}/learn`}
                                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                                    >
                                        Continue Learning
                                    </Link>
                                ) : (
                                    <Link
                                        href={`/courses/${course.slug}/checkout`}
                                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                                    >
                                        Enroll Now
                                    </Link>
                                )}

                                <p className="text-xs text-muted-foreground text-center">
                                    30-day money-back guarantee
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                            <div className="space-y-4">
                                {course.modules?.map((module) => (
                                    <div key={module.id} className="border rounded-lg overflow-hidden">
                                        <div className="bg-muted/50 p-4 font-medium border-b flex justify-between items-center">
                                            <span>{module.title}</span>
                                            <span className="text-xs text-muted-foreground">{module.lessons.length} lessons</span>
                                        </div>
                                        <div className="divide-y">
                                            {module.lessons.map(lesson => (
                                                <div key={lesson.id} className="p-4 flex items-center gap-3 text-sm">
                                                    <div className="h-6 w-6 rounded-full border flex items-center justify-center shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-muted-foreground">
                                                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <span>{lesson.title}</span>
                                                    <span className="ml-auto text-muted-foreground text-xs">{lesson.duration_minutes}m</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="border-t pt-8">
                            <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>

                            {/* Review Form */}
                            {canReview && (
                                <div className="mb-8 p-6 bg-muted/30 rounded-lg border">
                                    <h3 className="font-semibold mb-4">Leave a Review</h3>
                                    <form onSubmit={submitReview} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Rating</label>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setData('rating', star)}
                                                        className={`p-1 focus:outline-none`}
                                                    >
                                                        <Star
                                                            className={`w-6 h-6 ${star <= data.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Comment</label>
                                            <textarea
                                                className="w-full p-2 rounded-md border text-sm"
                                                rows={3}
                                                placeholder="Share your experience..."
                                                value={data.comment}
                                                onChange={(e) => setData('comment', e.target.value)}
                                            ></textarea>
                                            {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Reviews List */}
                            <div className="space-y-6">
                                {course.reviews && course.reviews.length > 0 ? (
                                    course.reviews.map((review) => (
                                        <div key={review.id} className="border-b pb-6 last:border-0">
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                    {review.user.profile_photo_url ? (
                                                        <img src={review.user.profile_photo_url} alt={review.user.name} />
                                                    ) : (
                                                        <span className="font-medium text-muted-foreground">
                                                            {review.user.name.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold">{review.user.name}</h4>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-yellow-500 my-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-sm text-foreground/80 mt-2">{review.comment}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No reviews yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
