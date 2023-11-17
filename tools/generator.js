const fs = require('fs').promises;

const filesMap = {
    'achievements-template.txt': {
        source: 'tools/templates/achievements-template.txt',
        destination: 'src/achievements/impl/achievements-template.txt',
    },
    'ads-template.txt': {
        source: 'tools/templates/ads-template.txt',
        destination: 'src/ads/impl/ads-template.txt',
    },
    'context-template.txt': {
        source: 'tools/templates/context-template.txt',
        destination: 'src/context/impl/context-template.txt',
    },
    'core-template.txt': {
        source: 'tools/templates/core-template.txt',
        destination: 'src/core/impl/core-template.txt',
    },
    'iap-template.txt': {
        source: 'tools/templates/iap-template.txt',
        destination: 'src/iap/impl/iap-template.txt',
    },
    'leaderboard-template.txt': {
        source: 'tools/templates/leaderboard-template.txt',
        destination: 'src/leaderboard/impl/leaderboard-template.txt',
    },
    'notifications-template.txt': {
        source: 'tools/templates/notifications-template.txt',
        destination: 'src/notifications/impl/notifications-template.txt',
    },
    'player-template.txt': {
        source: 'tools/templates/player-template.txt',
        destination: 'src/player/impl/player-template.txt',
    },
    'session-template.txt': {
        source: 'tools/templates/session-template.txt',
        destination: 'src/session/impl/session-template.txt',
    },
    'stats-template.txt': {
        source: 'tools/templates/stats-template.txt',
        destination: 'src/stats/impl/stats-template.txt',
    },
    'tournament-template.txt': {
        source: 'tools/templates/tournament-template.txt',
        destination: 'src/tournament/impl/tournament-template.txt',
    },
};

async function copyAndRenameFiles(platform) {
    try {
        for (const [fileName, { source, destination }] of Object.entries(filesMap)) {
            await fs.copyFile(source, destination);

            const newFileName = destination
                .replace('template', platform
                .toLowerCase())
                .replace('.txt', '.ts');

            await fs.rename(destination, newFileName);

            let fileContent = await fs.readFile(newFileName, 'utf-8');

            fileContent = fileContent.replace(/TEMPLATE/g, platform);

            await fs.writeFile(newFileName, fileContent, 'utf-8');
        }

        console.log('Files copied, renamed, and content modified successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

const platform = process.argv[2];

if (!platform) {
    console.error('Please provide the platform input.');
} else {
    copyAndRenameFiles(platform);
}
