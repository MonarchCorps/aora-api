const getUserDetails = (user) => {
    const userDetails = {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
    }

    return userDetails
}

module.exports = { getUserDetails }