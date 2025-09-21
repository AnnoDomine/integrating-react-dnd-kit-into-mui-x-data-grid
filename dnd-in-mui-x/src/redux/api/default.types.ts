// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type PaginatedRequestParams<R = {}> = R & {
    limit?: number;
    skip?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
}