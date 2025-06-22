export class AppError extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.errors = errors;
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export const handlerAnyError = (error, res) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
            errors: error.errors
        });
    }

    console.log(error.message);

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};
