# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Retry ads on no fill
- Log traffic source on initialization

### Fixed
- Facebook rewarded ad unit IDs not being parsed correctly
- Context docs contains reference to FB SDK

## [1.4.0] - 2023-04-24
### Added
- Ads on Viber
- Group chat context for FB Instant Games
- Game ID parsing for FB Instant Games
- Converter util for FB leaderboards
- Ads API: noFill callback for ad calls
- Context APIs: getType, getPlayersAsync, shareLinkAsync, isSizeBetween
- Player API: flushDataAsync, getASIDAsync, getSignedASIDAsync, canSubscribeBotAsync, subscribeBotAsync
- Session API: getPlatform

### Changed
- Context and Player APIs now have optional null return values to match platform SDKs
- Improved docs
- Improved error handling

## [1.3.0] - 2023-02-21
### Added
- Support for FB Instant Games
- onPause callback

### Fixed
- Possible type mismatch for ad unit IDs
- Typo in iap.getPurchasesAsync docs

### Changed
- Allow number params in analytics calls

## [1.2.0] - 2022-12-02
### Added
- Support for Game Distribution platform
- InitializationOptions
- Documentation for error handling

### Fixed
- Leaderboard calls now return correct values
- Unhandled exception in session.setSessionData

## [1.1.2] - 2022-11-24
### Added
- Improved error handling with ErrorMessages
- Increased input validation
- Validator utils
- Converter utils

### Changed
- Platform SDKs now rethrow errors for plugins to handle

## [1.1.1] - 2022-11-22
### Added
- Leaderboard docs now have examples

### Fixed
- Missing return values in Leaderboard API calls

### Changed
- Context API calls now only take ContextPayload parameters
- Exposed docs for some types

## [1.1.0] - 2022-11-16
### Added
- Player API
- Session API
- Examples in docs

### Fixed
- Possible duplicate init call
- Ad callbacks not validated
- Possible errors from invalid payload

### Changed
- Enums to types for consistency
- SDK namespace to API for clarity

## [1.0.0] - 2022-11-15
### Added
- Initial release
