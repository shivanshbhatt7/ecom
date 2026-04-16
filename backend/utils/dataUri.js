const DataUriParser = require("datauri/parser.js");
const path = require("path");

const parser = new DataUriParser()

const getDataUri = (file)=>{
    if(!file) return null;

    const extName = path.extname(file.originalname).toString();
    return parser.format(extName,file.buffer).content;
}

module.exports = getDataUri