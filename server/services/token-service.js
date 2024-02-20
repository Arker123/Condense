const jwt = require('jsonwebtoken');
const refreshModel = require('../models/refresh-model');


const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

/**
 * Class representing a TokenService.
 */
class TokenService {
  /**
   * Generates access and refresh tokens for the given payload.
   * @param {object} payload - The payload to be signed in the tokens.
   * @return {object} - An object containing the access and refresh tokens.
   */
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: '1m',
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: '1y',
    });
    return {accessToken, refreshToken};
  }

  /**
   * Stores the refresh token for a user.
   *
   * @param {string} token - The refresh token.
   * @param {string} userId - The ID of the user.
   * @return {Promise<void>} - A promise that resolves when
   *                           the refresh token is stored.
   */
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

  /**
   * Verifies the access token.
   * @param {string} token - The access token to be verified.
   * @return {Promise<any>} - A promise that resolves with the
   *                          verified token payload.
   */
  async verifyAccessToken(token) {
    return jwt.verify(token, accessTokenSecret);
  }

  /**
   * Verifies the refresh token.
   *
   * @param {string} refreshToken - The refresh token to verify.
   * @return {Promise<any>} - A promise that resolves with the
   *                          decoded token payload.
   */
  async verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, refreshTokenSecret);
  }

  /**
   * Finds a refresh token for a given user ID and token.
   * @param {string} userId - The ID of the user.
   * @param {string} refreshToken - The refresh token to find.
   * @return {Promise<object|null>} - A promise that resolves to the
   *                                  found refresh token object, or
   *                                  null if not found.
   */
  async findRefreshToken(userId, refreshToken) {
    return await refreshModel.findOne({
      userId: userId,
      token: refreshToken,
    });
  }

  /**
   * Updates the refresh token for a given user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} refreshToken - The new refresh token.
   * @return {Promise} A promise that resolves to the result of the
   *                   update operation.
   */
  async updateRefreshToken(userId, refreshToken) {
    return await refreshModel.updateOne(
        {userId: userId},
        {token: refreshToken},
    );
  }

  /**
   * Removes a token from the database.
   * @param {string} refreshToken - The refresh token to be removed.
   * @return {Promise<Object>} - A promise that resolves to the result
   *                             of the deletion operation.
   */
  async removeToken(refreshToken) {
    return await refreshModel.deleteOne({token: refreshToken});
  }
}

module.exports = new TokenService();
