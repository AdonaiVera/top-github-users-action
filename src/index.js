/*!
 * top-github-users-monitor 2.0.0
 * https://github.com/gayanvoice/top-github-users-monitor
 * (c) 2021 gayanvoice
 * Released under the MIT License
 */
const pullGit = require('./helper/git/pull-git');
const commitGit = require('./helper/git/commit-git');
const pushGit = require('./helper/git/push-git');
const configFile = require('./helper/file/config_file');
const outputCheckpoint = require('./helper/checkpoint/output_checkpoint');
const outputCache = require('./helper/cache/output_cache');
const requestOctokit = require('./helper/octokit/request_octokit');
const formatMarkdown = require('./helper/markdown/format_markdown');

let Index = function () {
    // const AUTH_KEY = "";
    // const GITHUB_USERNAME_AND_REPOSITORY = 'gayanvoice/top-github-users';
    const AUTH_KEY = process.env.CUSTOM_TOKEN;
    const GITHUB_USERNAME_AND_REPOSITORY = process.env.GITHUB_REPOSITORY;
    const MAXIMUM_ERROR_ITERATIONS = 4;
    
    let getCheckpoint = async function (locationsArray, country, checkpoint) {
        let indexOfTheCountry = locationsArray.findIndex(location => location.country === country);
        if(indexOfTheCountry === checkpoint){
            console.log("checkpoint set", country)
            return true;
        } else {
            console.log("checkpoint not set", country)
            return false;
        }
    }
    
    let saveCache = async function (readConfigResponseModel, readCheckpointResponseModel) {
        console.log(`########## SaveCache ##########`)
        for await(const locationDataModel of readConfigResponseModel.locations){
            let isCheckpoint = await getCheckpoint(readConfigResponseModel.locations, locationDataModel.country, readCheckpointResponseModel.checkpoint);
            if(isCheckpoint){
                let json = await requestOctokit.request(AUTH_KEY, MAXIMUM_ERROR_ITERATIONS, locationDataModel.locations);
                let readCacheResponseModel = await outputCache.readCacheFile(locationDataModel.country);
                if(readCacheResponseModel.status){
                    if(readCacheResponseModel.users.length > json.length){
                        if(json.length > 750) {
                            console.log(`request success minimum:750 cache:${readCacheResponseModel.users.length} octokit:${json.length}`);
                            await outputCache.saveCacheFile(locationDataModel.country, json);
                        }
                        else
                        {
                            console.log(`octokit error minimum:750 cache:${readCacheResponseModel.users.length} octokit:${json.length}`);
                        }
                    } else {
                        console.log(`request success cache:${readCacheResponseModel.users.length} octokit:${json.length}`);
                        await outputCache.saveCacheFile(locationDataModel.country, json);
                    }
                } else {
                    console.log(`request success octokit:${json.length}`);
                    await outputCache.saveCacheFile(locationDataModel.country, json);
                }
            }
        }
    }
    
    let updateCheckpoint = async function (readConfigResponseModel, readCheckpointResponseModel) {
        console.log(`########## Update Checkpoint ##########`)
        for await(const locationDataModel of readConfigResponseModel.locations){
            let isCheckpoint = await getCheckpoint(readConfigResponseModel.locations, locationDataModel.country, readCheckpointResponseModel.checkpoint)
            if(isCheckpoint){
                // Only read cache file if needed for checkpoint logic
                let readCacheResponseModel = await outputCache.readCacheFile(locationDataModel.country);
                if(readCacheResponseModel.status) {
                    console.log(`Processing checkpoint for ${locationDataModel.country}`);
                }
            }
            // Update checkpoint file
            await outputCheckpoint.saveCheckpointFile(readConfigResponseModel.locations, locationDataModel.country, readCheckpointResponseModel.checkpoint)
        }
    }
    
    let main = async function () {
        let readConfigResponseModel = await configFile.readConfigFile();
        let readCheckpointResponseModel = await outputCheckpoint.readCheckpointFile();
        if(readConfigResponseModel.status && readCheckpointResponseModel.status){
            if(!readConfigResponseModel.devMode) await pullGit.pull();
            let checkpointCountry = readConfigResponseModel.locations[readCheckpointResponseModel.checkpoint].country
            
            // Only run cache and checkpoint operations
            await saveCache(readConfigResponseModel, readCheckpointResponseModel);
            await updateCheckpoint(readConfigResponseModel, readCheckpointResponseModel);
            
            if(!readConfigResponseModel.devMode) await commitGit.commit(`Update ${formatMarkdown.capitalizeTheFirstLetterOfEachWord(checkpointCountry)}`);
            if(!readConfigResponseModel.devMode) await pushGit.push();
        }
    }
    
    return {
        main: main,
    };
}();

Index.main().then(() => { });