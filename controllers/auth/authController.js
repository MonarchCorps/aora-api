const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { generateRefreshToken, generateAccessToken } = require('../../utils/tokens')
const { getUserDetails } = require('../../utils/getUserDetails')

const login = async (req, res) => {
    const { state, password } = req.body
    if (!state || !password)
        return res.status(400).json({ message: "All fields are required" })
    console.log(state)

    try {
        const user = await User.findOne({
            $or: [
                { name: state },
                { email: state }
            ]
        })

        if (!user)
            return res.status(400).json({ message: "Incorrect details or password" })

        const match = await bcrypt.compare(password, user.password)

        if (!match)
            return res.status(400).json({ message: "Incorrect details or password" })

        const refreshToken = generateRefreshToken(user._id)
        const accessToken = generateAccessToken(user._id)
        const userDetails = getUserDetails(user)

        res.status(200).json({
            userDetails,
            refreshToken,
            accessToken
        })

    } catch (error) {
        res.status(500).json({
            message: 'Failed to login',
            error: error.message
        })
    }
}

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken)
        return res.status(400).json({ message: "Refresh token is required" })

    try {
        const { err, decoded } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (err)
            return res.status(401).json({ message: "Invalid refresh token" })

        const user = await User.findById(decoded.userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const accessToken = generateAccessToken(user._id)
        const userDetails = getUserDetails(user)

        res.status(200).json({
            userDetails,
            accessToken
        })

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to logout",
            error: error.message
        })
    }
}

module.exports = { login, refreshToken, logout }