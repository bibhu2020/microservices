import logger from '../utility/logger.js'; 

const errorHandler = (err, req, res, next) => {
    // Log the error stack for debugging
    logger.logTrace(err.stack);

    // Check if headers are already sent to avoid issues
    if (!res.headersSent) {
        const response = err.message; //(process.env.NODE_DEV | 'development') === 'development' ? err.message : 'Something went wrong!';
        
        //res.status(500).json({ error: response });

        return res.status(500).json({
            status: 'fail',
            message: response
        })

    } else {
        // If headers are sent, delegate to the default error handler
        next(err);
    }
};

export default errorHandler;
