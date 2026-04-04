export declare enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    RESIDENT = "RESIDENT"
}
export interface Building {
    id: string;
    name: string;
    address: string;
    city: string;
    state?: string;
    zip_code?: string;
    created_at: string;
    updated_at: string;
}
export interface Unit {
    id: string;
    building_id: string;
    unit_number: string;
    floor: number;
    type: 'apartment' | 'house' | 'studio' | 'other';
    created_at: string;
    updated_at: string;
}
export interface Resident {
    id: string;
    unit_id: string;
    name: string;
    email: string;
    phone?: string;
    is_owner: boolean;
    created_at: string;
    updated_at: string;
}
export interface User {
    id: string;
    email: string;
    password_hash?: string;
    role: UserRole;
    is_active: boolean;
    resident_id?: string;
    manager_id?: string;
    admin_id?: string;
    created_at: string;
    updated_at: string;
}
export interface Manager {
    id: string;
    building_id: string;
    name: string;
    email: string;
    phone?: string;
    created_at: string;
    updated_at: string;
}
export interface Admin {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}
export declare enum FinancialRecordType {
    INVOICE = "invoice",
    PAYMENT = "payment",
    CREDIT = "credit",
    CHARGE = "charge"
}
export interface FinancialRecord {
    id: string;
    unit_id: string;
    description: string;
    amount: number;
    type: FinancialRecordType;
    due_date?: string;
    paid_date?: string;
    paid_at?: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}
export declare enum MaintenanceStatus {
    PENDING = "pending",
    ASSIGNED = "assigned",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum MaintenancePriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export interface MaintenanceRequest {
    id: string;
    unit_id: string;
    description: string;
    status: MaintenanceStatus;
    priority: MaintenancePriority;
    assigned_to?: string;
    created_by: string;
    created_at: string;
    resolved_at?: string;
    updated_at: string;
}
export interface Announcement {
    id: string;
    building_id: string;
    title: string;
    content: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}
export declare enum ComplaintStatus {
    OPEN = "open",
    ASSIGNED = "assigned",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
export interface Complaint {
    id: string;
    unit_id: string;
    description: string;
    status: ComplaintStatus;
    assigned_to?: string;
    created_by: string;
    created_at: string;
    resolved_at?: string;
    updated_at: string;
}
export interface AccessCode {
    id: string;
    unit_id: string;
    code: string;
    qr_code?: string;
    created_by: string;
    created_at: string;
    expires_at?: string;
}
export interface ActivityLog {
    id: string;
    user_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    created_at: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    user: User;
}
export interface JWTPayload {
    sub: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    per_page: number;
}
//# sourceMappingURL=index.d.ts.map