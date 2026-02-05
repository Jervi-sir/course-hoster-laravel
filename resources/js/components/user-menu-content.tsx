import { Link, router } from '@inertiajs/react';
import { BookOpen, LayoutDashboard, LogOut, Settings, Shield } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {user.role?.code === 'admin' && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link
                                className="block w-full cursor-pointer"
                                href="/admin/dashboard"
                                prefetch
                                onClick={cleanup}
                            >
                                <Shield className="mr-2 h-4 w-4" />
                                Admin Dashboard
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                className="block w-full cursor-pointer"
                                href="/instructor/dashboard"
                                prefetch
                                onClick={cleanup}
                            >
                                <BookOpen className="mr-2 h-4 w-4" />
                                Instructor Dashboard
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
                {user.role?.code === 'instructor' && (
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer"
                            href="/instructor/dashboard"
                            prefetch
                            onClick={cleanup}
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Instructor Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}
                {(!user.role || user.role.code === 'student') && (
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer"
                            href="/dashboard"
                            prefetch
                            onClick={cleanup}
                        >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
