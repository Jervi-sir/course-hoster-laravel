import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Course } from '@/types';
import {
    Star,
    PlayCircle,
    Clock,
    Award,
    TrendingUp,
    Lock,
    CheckCircle2,
    FileText,
    User2
} from 'lucide-react';

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
            type: 'video' | 'article' | 'quiz';
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
    const totalDuration = course.modules?.reduce((acc, module) =>
        acc + module.lessons.reduce((lAcc, lesson) => lAcc + lesson.duration_minutes, 0), 0) || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />

            <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* 1. Header (Mobile Order: 1, Desktop Order: 1) */}
                    <div className="lg:col-span-8 order-1">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm flex-wrap">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize
                                    ${course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                                        course.level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                                            'bg-red-100 text-red-700'}`}>
                                    {course.level}
                                </span>
                                {course.category && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                        {course.category.name}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium text-foreground">{avgRating.toFixed(1)}</span>
                                    <span>({course.reviews?.length} reviews)</span>
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{course.title}</h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">{course.description}</p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-6">
                                <span className="flex items-center gap-1.5">
                                    <User2 className="w-4 h-4" />
                                    Created by <span className="font-medium text-foreground">{course.creator?.name}</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    Last updated {new Date(course.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Sidebar / Price Card (Mobile Order: 2, Desktop Order: 2) */}
                    <div className="lg:col-span-4 lg:row-span-2 order-2">
                        <div className="sticky top-8 space-y-6">
                            {/* Course Card */}
                            <div className="border bg-card rounded-xl overflow-hidden shadow-sm">
                                <div className="aspect-video bg-muted relative">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Preview</div>
                                    )}
                                    {!isEnrolled && (
                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                            <div className="bg-background/90 p-3 rounded-full shadow-lg">
                                                <PlayCircle className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <div className="text-3xl font-bold">
                                            {isEnrolled ? (
                                                <span className="text-green-600 dark:text-green-500 font-semibold text-xl flex items-center gap-2">
                                                    <CheckCircle2 className="w-5 h-5" /> Enrolled
                                                </span>
                                            ) : (
                                                parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`
                                            )}
                                        </div>
                                        {isEnrolled && <div className="text-sm text-green-600 font-medium mt-1">You own this course</div>}
                                    </div>

                                    {!isEnrolled ? (
                                        <Link
                                            href={`/courses/${course.slug}/checkout`}
                                            className="w-full bg-primary text-primary-foreground h-11 rounded-md font-medium text-sm hover:bg-primary/90 flex items-center justify-center transition-colors shadow-sm"
                                        >
                                            Enroll Now
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/courses/${course.slug}/learn`}
                                            className="w-full bg-primary text-primary-foreground h-11 rounded-md font-medium text-sm hover:bg-primary/90 flex items-center justify-center transition-colors shadow-sm"
                                        >
                                            Continue Learning
                                        </Link>
                                    )}

                                    <div className="space-y-3 text-sm">
                                        <h4 className="font-semibold">This course includes:</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li className="flex items-center gap-2">
                                                <PlayCircle className="w-4 h-4" />
                                                {course.lessons_count} video lessons
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {Math.round(totalDuration)} mins on-demand video
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                Certificate of completion
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4" />
                                                Full lifetime access
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="pt-4 border-t border-border flex flex-col gap-2 text-center">
                                        <p className="text-xs text-muted-foreground font-medium">30-Day Money-Back Guarantee</p>
                                        <p className="text-xs text-muted-foreground">Full Lifetime Access</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Course Content & Reviews (Mobile Order: 3, Desktop Order: 3) */}
                    <div className="lg:col-span-8 order-3 space-y-8">

                        {/* Course Content */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold tracking-tight">Course Content</h2>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                <span>{course.modules?.length} sections</span>
                                <span>•</span>
                                <span>{course.lessons_count} lectures</span>
                                <span>•</span>
                                <span>{Math.round(totalDuration)}m total length</span>
                            </div>

                            <div className="border rounded-lg divide-y">
                                {course.modules?.map((module, index) => (
                                    <div key={module.id} className="group">
                                        <div className="bg-muted/30 p-4 flex justify-between items-center font-medium">
                                            <span className="flex items-center gap-2">
                                                {module.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{module.lessons.length} lessons</span>
                                        </div>
                                        <div className="divide-y">
                                            {module.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className={`p-3 pl-6 flex items-center justify-between text-sm transition-colors
                                                        ${isEnrolled ? 'hover:bg-muted/50 cursor-pointer' : 'opacity-80'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {lesson.type === 'video' ?
                                                            <PlayCircle className="w-4 h-4 text-muted-foreground" /> :
                                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                                        }

                                                        {isEnrolled ? (
                                                            <Link href={`/courses/${course.slug}/lessons/${lesson.id}`} className="hover:underline hover:text-primary">
                                                                {lesson.title}
                                                            </Link>
                                                        ) : (
                                                            <span className="flex items-center gap-2">
                                                                {lesson.title}
                                                                <Lock className="w-3 h-3 text-muted-foreground" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{lesson.duration_minutes}m</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="space-y-6 pt-6 border-t">
                            <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>

                            {canReview && (
                                <div className="bg-muted/20 rounded-lg p-6 border">
                                    <h3 className="font-medium mb-4">Write a Review</h3>
                                    <form onSubmit={submitReview} className="space-y-4">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setData('rating', star)}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    <Star className={`w-6 h-6 ${star <= data.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            className="w-full min-h-[100px] p-3 rounded-md border text-sm bg-background resize-y"
                                            placeholder="Tell us about your own personal experience taking this course..."
                                            value={data.comment}
                                            onChange={(e) => setData('comment', e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                                        >
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="grid gap-6 md:grid-cols-2">
                                {course.reviews && course.reviews.length > 0 ? (
                                    course.reviews.map((review) => (
                                        <div key={review.id} className="border rounded-lg p-5 space-y-3 bg-card">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                    {review.user.profile_photo_url ? (
                                                        <img src={review.user.profile_photo_url} alt={review.user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold">{review.user.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{review.user.name}</p>
                                                    <div className="flex text-yellow-400 text-xs">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-muted-foreground/30'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="ml-auto text-xs text-muted-foreground">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-4">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8 text-muted-foreground">No reviews yet.</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
