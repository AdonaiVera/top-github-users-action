const file = require('../../core/file');
let markdownFile = (function () {
    let outputMarkdownFile = async function (fileName, markdown) {
        // Skip file operations to prevent creating markdown files
        console.log(`Skipped writing markdown file: ${fileName}`);
        return { status: true, message: `File writing skipped for ${fileName}` };
        
        // Original code commented out
        // let outputFileResponseModel = await file.outputOther(fileName, markdown);
        // console.log(outputFileResponseModel.message)
    }
    return {
        outputMarkdownFile: outputMarkdownFile,
    };
})();
module.exports = markdownFile;