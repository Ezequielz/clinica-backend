import { Response } from 'express';

export const handleError = (error: unknown, res: Response) => {
    if (error instanceof Error && 'statusCode' in error) {
        const customError = error as Error & { statusCode: number };
        return res.status(customError.statusCode).json({ ok: false, error: customError.message });
    };

    console.error("Unexpected Error:", error);
    return res.status(500).json({ ok: false, error: "Internal server error" });
};