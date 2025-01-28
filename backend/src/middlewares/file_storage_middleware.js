const multer = require('multer');


const storage = multer.memoryStorage();
const memoryStorageUpload = multer({ storage: storage });

module.exports = {
    memoryStorageUpload
};