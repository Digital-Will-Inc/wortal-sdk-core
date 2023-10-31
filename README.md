# Wortal SDK

## Integration

### CDN

The recommended way to include the SDK is to include the script in your game's `index.html`.
This will allow the SDK to receive automatic updates without requiring you to update your game.

Add the SDK Core script in the `<head>` of your game's `index.html` before any game scripts.

`<script src="https://storage.googleapis.com/html5gameportal.com/wortal-sdk/v1/wortal-core.js"></script>`

## Initialization

### Auto initialization

By default, the SDK will initialize itself automatically. This is the recommended way to initialize the SDK.

The SDK will be ready for use after `Wortal.isInitialized` returns `true`. It will also fire the `wortal-sdk-initialized` window event at this time.

```typescript
if (Wortal.isInitialized) {
    // SDK is ready to use.
}

window.addEventListener('wortal-sdk-initialized', () => {
    // SDK is ready to use.
});
```

### Manual initialization

Alternatively, you can initialize the SDK manually. This is useful if the game has large asset bundles that take some
time to download. Follow these steps to enable manual initialization:

- Add the `data-manual-init="true"` attribute to the SDK script tag:

`<script src="https://storage.googleapis.com/html5gameportal.com/wortal-sdk/wortal-core-x.x.js" data-manual-init="true"></script>`

- Call `Wortal.initializeAsync()` as early as possible in your game's initialization code, then `Wortal.startGameAsync()`
when your game has finished loading and is ready for play.

```typescript
Wortal.initializeAsync().then(() => {
    // SDK is ready to use.
    // Wait for game to finish loading.
    Wortal.setLoadingProgress(100);
    Wortal.startGameAsync();
});
```

### Loading Progress

Report the loading progress of the game in your initialization code. The game will not start until the loading progress reaches 100%.

```typescript
// Set the progress value to a number between 0 and 100 to report the loading progress of your game.
Wortal.setLoadingProgress(progress);
```

## How to Use

### Ads

[API Reference](https://sdk.html5gameportal.com/api/ads/)

Interstitial ads can be shown at various points in the game such as a level end, restart or a timed
interval in games with longer levels.

```typescript
// noFill is optional and will call afterAd if not provided.
Wortal.ads.showInterstitial('placement', 'description', beforeAd, afterAd, noFill);

// Player reached the next level.
Wortal.ads.showInterstitial('next', 'NextLevel', pauseGame, resumeGame, resumeAfterNoFill);

// Player paused the game.
Wortal.ads.showInterstitial('pause', 'PausedGame', pauseGame, resumeGame);

// Player opened the IAP shop.
Wortal.ads.showInterstitial('browse', 'BrowseShop', pauseAudio, resumeAudio);
```

Rewarded ads can be shown too. These are longer, optional ads that the player can earn a reward for watching. The player
must be notified of the ad and give permission to show before it can be shown.

```typescript
// noFill is optional and will call afterAd if not provided.
Wortal.ads.showRewarded('description', beforeAd, afterAd, adDismissed, adViewed, noFill);

// This example shows the game flow independent of the outcome of the ad.
// Ex: Player gets bonus coins for watching the ad, but the game continues regardless of the outcome.
Wortal.ads.showRewarded('BonusCoins', pauseGame, resumeGame, skipBonus, addBonusCoins);

// This example shows the game flow depending on the outcome of the ad.
// Ex: Player dies and can revive by watching an ad, but if they skip the ad they lose the level.
Wortal.ads.showRewarded('ReviveAndContinue', pauseAudio, resumeAudio, endGame, continueGame);
```

**NOTE**: Players should only be rewarded in the `adViewed` callback.

### Analytics

[API Reference](https://sdk.html5gameportal.com/api/analytics/)

The Analytics API can be used to track game events that can help better understand how players are interacting with
the game. This data will be available for viewing in the Wortal dashboard.

```typescript
// Logs the start of the level.
Wortal.analytics.logLevelStart('Level 3');

// Logs the end of the level. Will track the time spent playing the level if the name matches
// the name of the last logLevelStart() call.
Wortal.analytics.logLevelEnd('Level 3', '100', true);

// Logs a choice the player made in the game. This can be useful for balancing the game
// and seeing what content your players interact with the most.
Wortal.analytics.logGameChoice('Character', 'Blue');
```

### Context

[API Reference](https://sdk.html5gameportal.com/api/context/)

The Context API is used to connect players and allow them to interact in the game session, share their content
and send messages to each other.

```typescript
// Invite a friend to play the game. Does not switch the player's current context.
Wortal.context.inviteAsync({
    image: 'data:base64image',
    text: 'Invite text',
    cta: 'Play',
    data: { exampleData: 'yourData' },
}).then(() => console.log("Invite sent"));

// Share your game activity with friends.
Wortal.context.shareAsync({
    image: 'data:base64image',
    text: 'Share text',
    cta: 'Play',
    data: { exampleData: 'yourData' },
}).then(result => console.log(result));
```

### In-App Purchases

[API Reference](https://sdk.html5gameportal.com/api/iap/)

The In-App Purchases (IAP) API is used to provide an interface for in-game transactions on the platforms.
This process will differ based on what platform the game is being played on, but the API remains the same.

```typescript
// Get the catalog of products the player can purchase.
Wortal.iap.getCatalogAsync()
    .then(products => console.log(products));

// Purchase a product.
Wortal.iap.makePurchaseAsync({
    productID: 'my_product_123',
}).then(purchase => console.log(purchase));
```

### Leaderboards

[API Reference](https://sdk.html5gameportal.com/api/leaderboard/)

The Leaderboard API gives the game access to the platform's leaderboard functionality. This is where
you can track player's scores and compare them to other players.

```typescript
// Get the top 10 entries on the global leaderboard.
Wortal.leaderboard.getEntriesAsync('global', 10)
    .then(entries => console.log(entries));

// Add the player's score to the leaderboard.
Wortal.leaderboard.sendEntryAsync('global', 100);
```

### Notifications

[API Reference](https://sdk.html5gameportal.com/api/notifications/)

The Notifications API is used to send notifications to the player. These can be used to notify the player
of an event in the game or to remind them to come back and play.

```typescript
// Schedule a notification to send to the player.
Wortal.notifications.scheduleAsync({
    title: "Your energy is full!",
    body: "Come back and play again.",
    mediaURL: "https://example.com/image.png",
    label: "resources-full",
    scheduleInterval: 300 // 5 minutes
}).then((result) => {
    console.log(result.id);
});

// Cancel a scheduled notification.
Wortal.notifications.cancelAsync('notification-id-123')
    .then((result) => {
        console.log(result);
    });
```

### Player

[API Reference](https://sdk.html5gameportal.com/api/player/)

You can find details about the current player via the Player API.

```typescript
// Get the player's name.
Wortal.player.getName();

// Get a list of the player's friends who have also played this game.
Wortal.player.getConnectedPlayersAsync({
    filter: 'ALL',
    size: 20,
    hoursSinceInvitation: 4,
}).then(players => console.log(players.length));
```

### Session

[API Reference](https://sdk.html5gameportal.com/api/session/)

Details about the current session can be accessed in the Session API.

```typescript
// Get the entry point of where the game started from.
Wortal.session.getEntryPointAsync()
 .then(entryPoint => console.log(entryPoint));

// Get the entry point data from a social invite or share.
// This is useful for tracking where players are coming from or
// providing a reward for players who were invited to play.
const data = Wortal.session.getEntryPointData();
console.log(data);
```

### Tournament

[API Reference](https://sdk.html5gameportal.com/api/tournament/)

The Tournament API is used to create and manage tournaments for your game.

```typescript
// Create a tournament.
const payload = {
    initialScore: 100,
    config: {
        title: "Level 1 Tournament",
    },
    data: {
        level: 1,
    },
};

Wortal.tournament.createAsync(payload)
    .then(tournament => console.log(tournament.payload["level"]));

// Post a score to a tournament.
Wortal.tournament.postScoreAsync(200)
    .then(() => console.log("Score posted!"));
```
