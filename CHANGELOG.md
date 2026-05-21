# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2026-05-21

### Fixed
- Cached firmware version and serial number in ProductInfo after first query to eliminate redundant network calls.
- Switched all passive HomeKit onGet handlers from info level to debug level to prevent Homebridge log pollution.
- Fixed a pre-existing TypeScript type error in `DeviceManagerMock`.

## [1.0.1] - 2026-05-08

### Fixed
- Added a device handshake process at startup to prevent annoying "Not connected yet" error logs and Homebridge characteristic warnings.
- Graceful handling of connection lag when reading device state.
- Updated package name in tests and entry point.
