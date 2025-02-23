const cloudinary = require('../config/cloudinary');
const { generateColors } = require('../utils/getRandomColor');
const sharp = require('sharp');

const uploadAvatar = async (name) => {
    const { bgColor, color } = generateColors();

    const initials = name.charAt(0).toUpperCase();
    const svgAvatar = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <rect width="100%" height="100%" fill="${bgColor}"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="100" fill="${color}" 
            text-anchor="middle" dominant-baseline="middle" dy=".35em">
            ${initials}
            </text>
        </svg>
    `;

    try {
        // Convert SVG to PNG using sharp
        const pngBuffer = await sharp(Buffer.from(svgAvatar))
            .png()
            .toBuffer();

        // Upload PNG to Cloudinary (Wrap upload_stream in a Promise)
        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "Aora/Avatar",
                        public_id: `avatar_${name}`,
                        format: "png"
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary Upload Error:", error);
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                );
                uploadStream.end(pngBuffer); // Send buffer to Cloudinary
            });
        };

        // Wait for Cloudinary to return the URL
        const avatarUrl = await uploadToCloudinary();
        return avatarUrl;

    } catch (error) {
        console.error("Avatar Generation Error:", error);
        throw error;
    }
};

module.exports = uploadAvatar;
