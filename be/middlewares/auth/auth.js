const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const User = require('../../model/User');

const authMiddleware = expressAsyncHandler(
    async (req, res, next) => {
        if (req.headers.authorization) {
            const token = req.headers.authorization.startsWith('Bearer');
            try {
                if (token) {
                    const tokenVal = req.headers.authorization.split(' ')[1];
                    if (tokenVal) {
                        const decoded = jwt.verify(tokenVal, process.env.JWT_KEY);
                        if (decoded) {
                            const user = await User.findById(decoded.id).select("-password");
                            req.user = user;
                            next();
                        }
                    } else {
                        throw new Error('Token is not valid')
                    }
                }
                
            }
            catch (error) {
                throw new Error('Token is not available')
            }
        } else {
            throw new Error('There is not token attached!');
        }
    }
);

module.exports = authMiddleware;