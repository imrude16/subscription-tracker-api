const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.error(err);

        if(error.name === "CastError") {
            const message = "Resource Not Found";
            error = new Error(message);
            error.statusCode = 404;
        }

        if(error.code === 11000) {
            const message = "Duplicate Feild Value Entered";
            error = new Error(message);
            error.statusCode = 400;
        }

        if(error.name === "ValidationError") {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(", "));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal Server Error"
        });

    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;