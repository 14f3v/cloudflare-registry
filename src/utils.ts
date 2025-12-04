import { Context } from 'elysia';

export interface OCIError {
    code: string;
    message: string;
    detail?: any;
}

export class RegistryError extends Error {
    constructor(public code: string, message: string, public status: number = 400, public detail?: any) {
        super(message);
    }
}

export const formatError = (code: string, message: string, detail?: any) => ({
    errors: [
        {
            code,
            message,
            detail
        }
    ]
});

export const handleErrors = (error: any, set: Context['set']) => {
    if (error instanceof RegistryError) {
        set.status = error.status;
        return formatError(error.code, error.message, error.detail);
    }
    console.error(error);
    set.status = 500;
    return formatError('INTERNAL_ERROR', 'Internal Server Error');
};
