async function checkBody(params, req, res){
    const missingKeys = params.filter(key=>!(key in req.body));
    if(missingKeys.length > 0){
        res.status(400).json({error: `Missing required keys: ${missingKeys.join(', ')}`});
    }
}

// Wrapper to handle async route handlers and catch errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    checkBody,
    asyncHandler
};