function transformParamsToBody(req, res, next) {
    Object.keys(req.params).forEach((key) => {
        req.body[key] = req.params[key];
    });
    next();
}

module.exports = {
    transformParamsToBody
}