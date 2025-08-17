interface Request {
    method: string;
    url: string;
    body?: any;
    query?: any;
}
interface Response {
    status: number;
    headers: Record<string, string>;
    body: any;
}
export declare class EmailEndpoint {
    static handle(request: Request): Promise<Response>;
    private static handleGet;
    private static handlePost;
    private static handlePut;
    private static handleDelete;
    private static successResponse;
    private static errorResponse;
}
export {};
//# sourceMappingURL=EmailEndpoint.d.ts.map