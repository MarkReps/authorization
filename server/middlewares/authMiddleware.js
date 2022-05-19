const ApiError = require('../exceptions/apiError.js')
const tokenService = require('../services/tokenService.js')

module.exports = function(req,res,next){
    try {
        const authorizationhaeder = req.headers.authorization;

        if(!authorizationhaeder){
            return next(ApiError.UnauthorizedError())
        }

        const accessToken = authorizationhaeder.split(" ")[1]

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData){
            return next(ApiError.UnauthorizedError()) 
        }

        req.user = userData;
        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError())
    }
}