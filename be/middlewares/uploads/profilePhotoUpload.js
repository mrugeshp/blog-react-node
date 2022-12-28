const multer = require("multer");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    console.log('file', file);
    if (file.mimetype.startsWith("image")) {
        cb(null, file)
    } else {
        cb(
            {
                message: "Unsupported file format"
            },
            false
        );
    }
}

const storageProfile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/data/uploads/')
    },
    filename: function (req, file, cb) {
        const fileName =  `user-${Date.now()}-${file.originalname}`;
        cb(null, fileName)
    }
})

const storagePosts = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/data/posts/')
    },
    filename: function (req, file, cb) {
        const fileName =  `post-${Date.now()}-${file.originalname}`;
        cb(null, fileName)
    }
})

const profilePhotoUpload = multer({
    storage: storageProfile,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 }
})

const postsPhotoUpload = multer({
    storage: storagePosts,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 }
})

const profilePhotoResize = async (req, res, next) => {
    // if(!req.file) return next();
    // req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
    console.log('Resizing');
    next();
}

module.exports = { profilePhotoUpload, profilePhotoResize, postsPhotoUpload }