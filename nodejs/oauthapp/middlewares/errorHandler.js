import logger from '../utility/logger.js'; 

const errorHandler = (err, req, res, next) => {
    // Log the error stack for debugging
    logger.logTrace(err.stack);
    //logger.logException(err);
    //{ exception: new Error("This is a manually logged error") }

    // Check if headers are already sent to avoid issues
    if (!res.headersSent) {
        // Different response for development and production
        const response = (process.env.NODE_DEV | 'development') === 'development' ? err.message : 'Something went wrong!';
        
        // Render the error page
        res.status(500).render("error/index", { data: response });
    } else {
        // If headers are sent, delegate to the default error handler
        //console.error(err);
        next(err);
    }
};

export default errorHandler;
