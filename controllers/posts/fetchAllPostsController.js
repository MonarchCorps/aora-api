const Post = require('../../models/Post');

const fetchAllPosts = async (req, res) => {
    try {
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    creator: {
                        username: "$userDetails.name",
                        avatar: "$userDetails.avatar"
                    },
                    title: 1,
                    video: 1,
                    thumbnail: 1,
                    prompt: 1
                }
            }
        ]);

        if (!posts.length)
            return res.status(200).json({ message: "No posts found" });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching posts",
            error: error.message
        });
    }
};

module.exports = { fetchAllPosts }