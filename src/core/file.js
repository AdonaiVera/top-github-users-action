const fs = require('fs-extra')
const OutputFileResponseModel = require('../model/file/OutputFileResponseModel');
const ReadFileResponseModel = require('../model/file/ReadFileResponseModel');
let file = (function () {
    let outputJson = async function (fileName, json) {
        // Skip all JSON file writing operations
        console.log(`[SKIPPED] JSON file write operation: ${fileName}`);
        
        // Only allow writing to checkpoint.json and cache files
        if (fileName === 'checkpoint.json' || fileName.startsWith('cache/')) {
            try {
                await fs.outputJson(fileName, json)
                return new OutputFileResponseModel(true, `Json file has been updated at ${fileName}`);
            } catch (error) {
                return new OutputFileResponseModel(false, `Json file has not been updated at ${fileName}`)
            }
        } else {
            // For all other files, pretend the operation succeeded but don't actually write
            return new OutputFileResponseModel(true, `[SKIPPED] Json file write operation for ${fileName}`)
        }
    }
    
    let outputOther = async function (fileName, file) {
        // Skip all non-JSON file writing operations (markdown, HTML, etc.)
        console.log(`[SKIPPED] File write operation: ${fileName}`);
        
        // Don't write any files, just return success
        return new OutputFileResponseModel(true, `[SKIPPED] File write operation for ${fileName}`)
        
        // Original code commented out
        // try {
        //     await fs.outputFile(fileName, file)
        //     return new OutputFileResponseModel(true, `Other file has been updated at ${fileName}`)
        // } catch (error) {
        //     return new OutputFileResponseModel(false, `Other file has not been updated at ${fileName}`)
        // }
    }
    
    let readJson = async function (fileName) {
        try {
            let json = await fs.readJson(fileName);
            return new ReadFileResponseModel(true, `Json file has been read at ${fileName}`, json);
        } catch (error) {
            return new ReadFileResponseModel(false, `Json file has not been read at ${fileName}`);
        }
    }
    
    return {
        outputJson: outputJson,
        outputOther: outputOther,
        readJson: readJson,
    };
})();
module.exports = file;
