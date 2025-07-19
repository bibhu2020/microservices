// catches exceptions raised by async function calls.

const catchAsync = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;
