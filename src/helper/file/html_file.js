const file = require('../../core/file');
let htmlFile = function () {
    let outputHtmlFile = async function (fileName, html) {
        // Skip file operations to prevent creating HTML files
        console.log(`Skipped writing HTML file: ${fileName}`);
        return { status: true, message: `File writing skipped for ${fileName}` };
        
        // Original code commented out
        // let outputFileResponseModel = await file.outputOther(fileName, html);
        // console.log(outputFileResponseModel.message)
    }
    let outputJsonFile = async function (fileName, json) {
        // Skip file operations to prevent creating JSON files
        console.log(`Skipped writing JSON file: ${fileName}`);
        return { status: true, message: `File writing skipped for ${fileName}` };
        
        // Original code commented out
        // let outputFileResponseModel = await file.outputJson(fileName, json);
        // console.log(outputFileResponseModel.message)
    }
    return {
        outputHtmlFile: outputHtmlFile,
        outputJsonFile: outputJsonFile
    };
}();
module.exports = htmlFile;