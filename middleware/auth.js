const jwt = require(`jsonwebtoken`);

const Auth = {
    verifyToken(req, res, next){
        const token = req.cookies['token'] || req.body.token

        if(token){
            const verified = jwt.verify(token, process.env.SECRET)
            req.verified = verified.userid

            if(verified){
                console.log(`Succesfully Verified`)
                return next()
            }
        } else {
            res.status(403).send({message: `Youre not authenticated, please login first`})
        }
        return next();
    }
}

module.exports = Auth;