# Wortal SDK Core

## Installation

Add the SDK Core script in the `<head>` of your game's `index.html`:

`<script src="https://cdn.html5gameportal.com/wortal-sdk/wortal-core-1.1.0.js"></script>`

## How to Use

### Ads

[API Reference](https://sdk.html5gameportal.com/api/ads/)

Interstitial ads can be shown at various points in the game such as a level end, restart or a timed
interval in games with longer levels.

```typescript
// Player reached the next level.
Wortal.ads.showInterstitial('next', 'NextLevel', pauseGame, resumeGame);

// Player paused the game.
Wortal.ads.showInterstitial('pause', 'PausedGame', pauseGame, resumeGame);

// Player opened the IAP shop.
Wortal.ads.showInterstitial('browse', 'BrowseShop', pauseAudio, resumeAudio);
```

Rewarded ads can be shown too. These are longer, optional ads that the player can earn a reward for watching. The player
must be notified of the ad and give permission to show before it can be shown.

```typescript
// This examples shows the game flow independent of the outcome of the ad.
Wortal.ads.showRewarded('BonusCoins', pauseGame, resumeGame, skipBonus, addBonusCoins);

// This example shows the game flow depending on the outcome of the ad.
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
// Invite a friend to play the game.
Wortal.context.chooseAsync({
    image: 'data:base64image',
    text: 'Invite text',
    caption: 'Play',
    data: { exampleData: 'yourData' },
})

// Share your game activity with friends.
Wortal.context.shareAsync({
    image: 'data:base64image',
    text: 'Share text',
    caption: 'Play',
    data: { exampleData: 'yourData' },
}).then(result => console.log(result); // Contains shareCount with number of friends the share was sent to.
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
    .then(entries => console.log(entries);

// Add the player's score to the leaderboard.
Wortal.leaderboard.sendEntryAsync('global', 100);
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
}).then(players => console.log(players.length);
```

### Session

[API Reference](https://sdk.html5gameportal.com/api/session/)

Details about the current session can be accessed in the Session API.

```typescript
// Get the entry point of where the game started from.
Wortal.session.getEntryPointAsync()
 .then(entryPoint => console.log(entryPoint);
```
