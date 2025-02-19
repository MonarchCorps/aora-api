const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const { generateRefreshToken, generateAccessToken } = require('../../utils/tokens')
const { getUserDetails } = require('../../utils/getUserDetails')

const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password)
        return res.status(400).json({ message: "All fields are required" })

    try {
        const duplicateDetails = await User.findOne({
            $or: [
                { name },
                { email }
            ]
        })

        if (duplicateDetails)
            return res.status(400).json({ message: "Email or name is already in use!" })

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const refreshToken = generateRefreshToken(newUser._id)
        const accessToken = generateAccessToken(newUser._id)
        const userDetails = getUserDetails(newUser)

        res.status(200).json({
            userDetails,
            refreshToken,
            accessToken
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to create account",
            error: error.message
        })
    }
}

module.exports = { register }