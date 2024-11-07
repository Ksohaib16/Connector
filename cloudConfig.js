const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//this is default code to config cloudinary to app & key name will be same as here but we can change the name of .env file keys
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'connector_DEV',
        allowedFormats: ['jpg', 'png', 'jpeg'],
    },
});

module.exports = {
    cloudinary,
    storage
}