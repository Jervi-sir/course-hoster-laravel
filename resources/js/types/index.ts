export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export interface Role {
    id: number;
    code: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    role?: Role;
    created_at: string;
    profile_photo_url?: string;
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    creator?: User;
    price: string;
    status: 'draft' | 'published' | 'archived';
    level: string;
    thumbnail: string | null;
    created_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
