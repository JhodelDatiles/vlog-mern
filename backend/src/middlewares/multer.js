import { v2 as cloudinary } from 'cloudinary'; // Ensure 'v2' is aliased
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// This setup allows the v4 middleware to talk to the v2 library
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ipaskil_avatars',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });
export default upload;