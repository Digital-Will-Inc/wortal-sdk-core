/** @hidden */
export type PermissionStatusLink = 'ALLOWED' | 'DENIED'

/** @hidden */
export interface PermissionLink {
    name: string
    status: PermissionStatus
}

/** @hidden */
export interface PermissionNameLink {
    [key: string]: string
}

/** @hidden */
export interface PermissionDataLink {
    [key: string]: PermissionLink
}

/** @hidden */
export interface CustomPermissionLink {
    name: PermissionNameLink
    data: PermissionDataLink
}
