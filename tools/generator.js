const fs = require('fs').promises;

const platform = process.argv[2];

// If any new modules are added, create a template for them and add them to this map.
const sourcePath = 'tools/templates/';
const filesMap = {
    'achievements-template.txt': 'src/achievements/impl/achievements-template.txt',
    'ads-template.txt': 'src/ads/impl/ads-template.txt',
    'context-template.txt': 'src/context/impl/context-template.txt',
    'core-template.txt': 'src/core/impl/core-template.txt',
    'iap-template.txt': 'src/iap/impl/iap-template.txt',
    'leaderboard-template.txt': 'src/leaderboard/impl/leaderboard-template.txt',
    'notifications-template.txt': 'src/notifications/impl/notifications-template.txt',
    'player-template.txt': 'src/player/impl/player-template.txt',
    'session-template.txt': 'src/session/impl/session-template.txt',
    'stats-template.txt': 'src/stats/impl/stats-template.txt',
    'tournament-template.txt': 'src/tournament/impl/tournament-template.txt',
};

const platformTypePath = 'src/session/types/session-types.ts';
const platformTypeSearchString = 'export type Platform =';

const platformDomainsPath = 'src/data/core-data.ts';
const platformDomainsSearchString = 'export const PLATFORM_DOMAINS: PlatformDomains = {';

async function setupTemplates(platform) {
    //TODO: find a more elegant way to do this, maybe a stream?

    for (const [fileName, destination] of Object.entries(filesMap)) {
        try {
            await fs.copyFile(`${sourcePath}${fileName}`, destination);
        } catch (error) {
            console.error(`Failed to copy ${fileName} to ${destination}.`);
            throw error;
        }

        const newFileName = destination
            .replace('template', platform.toLowerCase())
            .replace('.txt', '.ts');

        try {
            await fs.rename(destination, newFileName);
        } catch (error) {
            console.error(`Failed to rename ${destination} to ${newFileName}.`);
            throw error;
        }

        // This will update the class name and the header docs.
        let fileContent;
        try {
            fileContent = await fs.readFile(newFileName, 'utf-8');
        } catch (error) {
            console.error(`Failed to read ${newFileName}.`);
            throw error;
        }

        fileContent = fileContent.replace(/TEMPLATE/g, platform);

        try {
            await fs.writeFile(newFileName, fileContent, 'utf-8');
        } catch (error) {
            console.error(`Failed to write to ${newFileName}.`);
            throw error;
        }
    }
}

async function addPlatformToPlatformType(filePath, searchString, newPlatform) {
    let fileContent;
    try {
        fileContent = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error(`Failed to read ${filePath}.`);
        throw error;
    }

    // Locate the PlatformType definition in the file.
    const searchRegex = new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const match = fileContent.match(searchRegex);
    if (!match) {
        console.error('Failed to find PlatformType definition.');
        return;
    }

    // Would rather have this appended to the end of the type definition, but this was easier.
    const modifiedContent = fileContent.replace(searchRegex, match[0] + ` "${newPlatform}" |`);

    try {
        await fs.writeFile(filePath, modifiedContent, 'utf-8');
    } catch (error) {
        console.error(`Failed to write to ${filePath}.`);
        throw error;
    }
}

async function addPlatformToPlatformDomains(filePath, searchString, newPlatform) {
    let fileContent;
    try {
        fileContent = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error(`Failed to read ${filePath}.`);
        throw error;
    }

    // Locate the platform domains object in the file.
    const searchRegex = new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 's');
    const match = fileContent.match(searchRegex);
    if (!match) {
        console.error('Failed to find PlatformDomains definition.');
        return;
    }

    // Would rather have this appended to the end of the object, but this was easier.
    const newProperty = `"${newPlatform}": [""],`;
    const modifiedContent = fileContent.replace(searchRegex, match[0] + '\n' + '    ' + newProperty);

    try {
        await fs.writeFile(filePath, modifiedContent, 'utf-8');
    } catch (error) {
        console.error(`Failed to write to ${filePath}.`);
        throw error;
    }
}

function isValidPlatformName(platform) {
    // Platform name should be PascalCase and contain only letters. This is because the platform name will be used
    // to name the classes, and it's easier to force the string to lower for the file name than to force it to pascal
    // case when we don't know what the platform name is or where word breaks will be.
    const platformRegex = /^[A-Z][A-Za-z]*$/;

    return platformRegex.test(platform);
}

if (!platform) {
    console.error('Platform name missing. Please provide a valid platform name as an argument.');
} else if (!isValidPlatformName(platform)) {
    console.error('Invalid platform name. Platform should contain only letters and be in PascalCase.');
} else {
    setupTemplates(platform)
        .then(() => console.log('Templates setup complete.'))
        .catch(error => console.error('Error:', error.message));

    addPlatformToPlatformType(platformTypePath, platformTypeSearchString, platform.toLowerCase())
        .then(() => console.log('Platform appended to PlatformType definition.'))
        .catch(error => console.error('Error:', error.message));

    addPlatformToPlatformDomains(platformDomainsPath, platformDomainsSearchString, platform.toLowerCase())
        .then(() => console.log('Platform appended to PlatformDomains definition.'))
        .catch(error => console.error('Error:', error.message));
}
