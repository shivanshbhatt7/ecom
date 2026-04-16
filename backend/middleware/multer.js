const multer = require('multer');

const storage = multer.memoryStorage();

// single file upload
const singleUpload = multer({storage}).single("file")

// multiple file upload
const multipleUpload = multer({storage}).array("files", 5)

module.exports = { singleUpload ,multipleUpload }