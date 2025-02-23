const Post = require('../../models/Post')
const { PassThrough } = require("stream"); // used to convert raw binary data into a readable stream
const cloudinary = require('../../config/cloudinary')

const uploadToCloudinary = async (fileBuffer, resourceType, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: resourceType, folder },
            (error, result) => {
                if (result) resolve(result)
                else reject(error)
            }
        )

        const bufferStream = new PassThrough()
        bufferStream.end(fileBuffer);
        bufferStream.pipe(uploadStream);
    })
}

const createPost = async (req, res) => {
    const { title, prompt } = req.body
    const { video: videoFile, thumbnail: thumbnailFile } = req.files

    if (!title || !prompt || !videoFile || !thumbnailFile)
        return res.status(400).json({ message: "All fields are required" })

    let video, thumbnail;


    try {
        if (videoFile) {
            const videoData = await uploadToCloudinary(videoFile[0].buffer, "video", "Aora/Post/videos")
            video = { url: videoData.secure_url, publicId: videoData.public_id }
        }

        if (thumbnailFile) {
            const thumbnailData = await uploadToCloudinary(thumbnailFile[0].buffer, "image", "Aora/Post/thumbnails");
            thumbnail = { url: thumbnailData.secure_url, publicId: thumbnailData.public_id };
        }
    } catch (error) {
        res.status(500).json({
            message: "Error uploading files",
            error: error.message
        })
    }

    try {
        const newPost = await Post.create({
            userId: req.userId,
            video,
            thumbnail,
            title,
            prompt
        })

        res.status(200).json(newPost)
    } catch (error) {
        res.status(500).json({
            message: "Error creating post",
            error: error.message
        })
    }

}

module.exports = { createPost }