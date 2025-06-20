import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Setting {
    id: number | null;
    name: string;
    value: string;
    type: string;
    description: string;
    created_at: string;
    updated_at: string;
    // [key: string]: unknown; // This allows for additional properties...
}

// Tipe untuk state form baru (misalnya untuk penambahan)
// Properti 'id' tidak diperlukan saat membuat baru
export type NewSettingFormData = Omit<Setting, 'id' | 'created_at' | 'updated_at'>;

// Tipe untuk state form edit (properti 'id' wajib)
export type EditSettingFormData = Omit<Setting, 'created_at' | 'updated_at'>;
