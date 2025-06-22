import { AppError } from "../errors/handle_error.js";

export function validate(schema, property = "body") {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property]);
        if (error) {
            const simplifiedErrors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            }));

            return next(new AppError("Validation Error", 400, simplifiedErrors));
        }

        req[property] = value;
        next();
    };
}