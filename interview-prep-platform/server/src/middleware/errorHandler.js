const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
    });

    // Optionally log the error for further analysis
    console.error(err);
};

module.exports = errorHandler;