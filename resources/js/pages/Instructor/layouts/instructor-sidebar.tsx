import { Link } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Settings } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import AppLogo from '@/components/app-logo';
import type { NavItem } from '@/types';
import { NavFooter } from '@/components/nav-footer';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/instructor/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Courses',
        href: '/instructor/courses',
        icon: BookOpen,
    },
];


const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
];

export function InstructorSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/instructor/dashboard" prefetch>
                                <AppLogo title="Instructor" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
