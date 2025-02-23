const Post = require('../../models/Post')

const trendingPosts = async (req, res) => {
    const { limit } = req.params
    if (!limit)
        return res.status(400).json({ message: "Limit is required" })

    try {
        const trendingPosts =
            await Post
                .find()
                .limit(parseInt(limit))

        if (!trendingPosts.length)
            return res.status(200).json({ message: "No trending posts found" })

        res.status(200).json(trendingPosts)

    } catch (error) {
        res.status(500).json({
            message: "Error fetching posts",
            error: error.message
        })
    }
}

module.exports = { trendingPosts }