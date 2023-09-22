# Changelog

## [1.6.12] - 2023-09-19
### Changed
- Ads
  - Disabled ad call retries on Facebook

## [1.6.11] - 2023-09-19
### Added
- Player
  - setDataAsync and getDataAsync are now supported on all platforms

## [1.6.10] - 2023-09-13
### Added
- Core
  - authenticateAsync and linkAccountAsync APIs

### Changed
- Analytics
  - Analytics are no longer tracked on Game Distribution

## [1.6.9] - 2023-09-11
### Added
- Core
  - Support for CrazyGames platform
- Analytics
  - Tracking for game load times
- Context
  - context.switchAsync now has an optional payload
  - context.chooseAsync now supports payloads on Link

### Fixed
- Ads
  - Preroll loading cover can no longer be added after initialization or when ads are blocked

### Changed
- Core
  - Improved internal error handling

## [1.6.8] - 2023-09-04
### Added
- Core
  - Full API support in debug mode

### Fixed
- Ads
  - Duplicate preroll no longer called on GD platform
- Context
  - updateAsync now adds the action and template properties to the payload if none is provided on Facebook
- Player
  - getPhoto docs now correctly state that it returns a URL and not a base64 string

### Changed
- Core
  - initializeAsync and startGameAsync now work on all platforms for manual initialization
  - Validation checks now occur before platform checks in all APIs
  - Local testing no longer requires appending query params to the URL

## [1.6.7] - 2023-09-01
### Fixed
- Core
  - Initialization failing in GD prod environment

## [1.6.6] - 2023-08-31
### Fixed
- Core
  - Async calls not being awaited during initialization
- Player
  - canSubscribeBotAsync no longer returns an implicit value

## [1.6.5] - 2023-08-29
### Added
- Core
  - Error messages now include a URL to the relevant API docs

### Fixed
- Core
  - initializeAsync now awaits the platform SDK initialization in manual mode
- Notifications
  - Notification APIs now throw an error if the ASID is missing

### Changed
- IAP
  - Check for IAP support now happens earlier
- Leaderboard
  - APIs now append current context ID to leaderboard name automatically
  - APIs now throw errors if in solo context on Facebook

## [1.6.4] - 2023-08-25
### Added
- Ads
  - Backfill ads on Viber

### Fixed
- Ads
  - Duplicate ad event fired on preroll ads

## [1.6.3] - 2023-08-22
### Fixed
- Core
  - Possible initialization fail when using manual initialization on Wortal/GD platforms

## [1.6.2] - 2023-08-22
### Fixed
- Ads
  - Game Distribution callbacks attached to wrong events

### Changed
- Session
  - switchGameAsync is no longer available on Viber

## [1.6.1] - 2023-08-17
### Added
- Core
  - Tournament API
  - Demo project
  - Event for when SDK is initialized
  - Manual SDK initialization option
  - NPM package distribution
  - switchGameAsync API
- Ads
  - isAdBlocked API
- Session
  - getDevice, getOrientation, onOrientationChange APIs

### Changed
- Core
  - Improved integration docs

## [1.6.0] - 2023-08-10
### Added
- Analytics
  - Events for ad calls
- IAP
  - Facebook-only properties in IAP interfaces

### Fixed
- Core
  - Uncaught exceptions when validating API calls
  - Possible type mismatch in onPause argument
- Ads
  - Ad calls on Facebook no longer hang if ad unit IDs are missing
- Notifications
  - Error messages not returned on fetch fail

### Changes
- Core
  - Updated Viber SDK to 1.14.0
  - Merged wortal.js into SDK for scalability
  - Improve docs and SDK logging

## [1.5.0] - 2023-06-27

### Added

- Core
    - Notifications API
    - Haptic feedback
    - getSupportedAPIs to check if an API is supported on current platform
- Ads
    - Retry ads on no fill
- Analytics
    - Log traffic source on initialization
    - New events: logSocialInvite, logSocialShare, logPurchase, logPurchaseSubscription
    - Additional parameters in existing events
    - Events now use Wortal Game ID instead of platform for tracking
- Context
    - inviteAsync for social invites
    - New payload types for each API

### Fixed

- Ads
    - Facebook rewarded ad unit IDs not being parsed correctly
- Context
    - Facebook shareAsync error when using LocalizableContent
    - Docs contains reference to FB SDK

### Changed

- Analytics
    - logGameStart and logGameEnd now marked as private
- Context
    - chooseAsync no longer requires a payload

## [1.4.0] - 2023-04-24

### Added

- Ads
    - Viber support
    - noFill callback for ad calls
- Context
    - Group chat context for Facebook
    - New APIs: getType, getPlayersAsync, shareLinkAsync, isSizeBetween
- Player
    - New APIs: flushDataAsync, getASIDAsync, getSignedASIDAsync, canSubscribeBotAsync, subscribeBotAsync
- Session
    - New API: getPlatform

### Changed

- Core
    - Improved error handling
    - Improved docs
- Context
    - Some APIs can now return null
- Player
    - Some APIs can now return null

## [1.3.0] - 2023-02-21

### Added

- Core
    - Support for FB Instant Games
    - onPause callback

### Fixed

- Ads
    - Possible type mismatch for ad unit IDs
- IAP
    - Typo in iap.getPurchasesAsync docs

### Changed

- Analytics
    - Allow number params in analytics calls where previously only strings

## [1.2.0] - 2022-12-02

### Added

- Core
    - Support for Game Distribution platform
    - InitializationOptions (future use)
    - Documentation for error handling

### Fixed

- Leaderboard
    - Incorrect return values
- Session
    - Possible unhandled exception in session.setSessionData

## [1.1.2] - 2022-11-24

### Added

- Core
    - Improved error handling with ErrorMessages
    - Increased input validation
    - Validator utils
    - Converter utils

### Changed

- Core
    - Platform SDKs now rethrow errors for callers to handle

## [1.1.1] - 2022-11-22

### Added

- Leaderboard
    - Docs now include examples

### Fixed

- Leaderboard
    - Missing return values in API calls

### Changed

- Core
    - Added docs for additional types
- Context
    - API calls now only take ContextPayload parameters

## [1.1.0] - 2022-11-16

### Added

- Core
    - Examples in docs
- Player API
- Session API

### Fixed

- Core
    - Possible duplicate init call
- Ads
    - Ad callbacks not validated
- Context
    - Possible errors from invalid payload

### Changed

- Core
    - Enums to types for consistency
    - SDK namespace to API for clarity

## [1.0.0] - 2022-11-15

### Added

- Initial release
