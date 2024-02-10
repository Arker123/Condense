const jwt = require('jsonwebtoken');
const refreshModel = require('../models/refresh-model')
// const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
// const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

// console.log('accessTokenSecret:', accessTokenSecret);
// console.log('refreshTokenSecret:', refreshTokenSecret);

const accessTokenSecret = 'edb2908b09d80e4af13182737f14e9e977792367cf9bc0e020eaa48b3a9ef653';
const refreshTokenSecret = 'f3322d46d37ad6c539432415d06abbd67c62cb946a35c0c0ab7a11ce91378c48';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '1m',
        });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '1y',
        });
        return { accessToken, refreshToken };
     }

     async storeRefreshToken(token, userId) {
        try {
            await refreshModel.create({
                token,
                userId,
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, accessTokenSecret);
    }

    async verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, refreshTokenSecret);
    }

    async findRefreshToken(userId, refreshToken) {
        return await refreshModel.findOne({
            userId: userId,
            token: refreshToken,
        });
    }

    async updateRefreshToken(userId, refreshToken) {
        return await refreshModel.updateOne(
            { userId: userId },
            { token: refreshToken }
        );
    }

    async removeToken(refreshToken) {
        return await refreshModel.deleteOne({ token: refreshToken });
    }
}

module.exports = new TokenService();