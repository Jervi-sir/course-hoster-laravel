import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap justify-end gap-1 py-4">
            {links.map((link, i) => {
                const isPrevious = link.label.includes('Previous');
                const isNext = link.label.includes('Next');

                // If it's a URL link
                if (link.url) {
                    return (
                        <Button
                            key={i}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            asChild
                        >
                            <Link href={link.url}>
                                {isPrevious ? (
                                    <>
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </>
                                ) : isNext ? (
                                    <>
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </>
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </Link>
                        </Button>
                    );
                }

                // If it's not a URL (e.g. current page disabled "Previous" or "Next" or ellipsis)
                return (
                    <Button
                        key={i}
                        variant="ghost"
                        size="sm"
                        disabled
                        className={cn("cursor-not-allowed", link.active && "border-primary")}
                    >
                        {isPrevious ? (
                            <>
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </>
                        ) : isNext ? (
                            <>
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </>
                        ) : (
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        )}
                    </Button>
                );
            })}
        </div>
    );
}
