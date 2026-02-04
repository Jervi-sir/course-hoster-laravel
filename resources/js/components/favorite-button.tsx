import { router } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Course } from '@/types';
import { MouseEvent } from 'react';

interface FavoriteButtonProps {
    course: Course;
    className?: string;
}

export function FavoriteButton({ course, className }: FavoriteButtonProps) {
    const toggleFavorite = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        router.post(
            `/courses/${course.id}/favorite`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "rounded-full hover:bg-white/20 hover:text-red-500 transition-colors",
                course.is_favorited ? "text-red-500 fill-red-500" : "text-white/70",
                className
            )}
            onClick={toggleFavorite}
            title={course.is_favorited ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart className={cn("h-5 w-5", course.is_favorited && "fill-current")} />
            <span className="sr-only">{course.is_favorited ? "Unfavorite" : "Favorite"}</span>
        </Button>
    );
}
