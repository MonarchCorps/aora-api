const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
    const accessToken = jwt.sign(
        {
            userId: userId
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "100d"
        }
    );

    return accessToken
}

const generateRefreshToken = (userId) => {
    try {
        return jwt.sign(
            {
                userId
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "365d"
            }
        );
    } catch (error) {
        console.error(
            "Error generating refresh token:",
            error
        );
        return "";
    }
};

module.exports = { generateAccessToken, generateRefreshToken };
