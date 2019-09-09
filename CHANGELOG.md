# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2019-09-09
### Added
- Unit and integration tests

### Fixed
- id for cached calls

## [0.1.1] - 2019-09-05
### Changed
- Recreate WebsocketProvider every time we do not get blocks within 1 min

## [0.1.0] - 2019-09-05
### Added
- Basic infura proxy
- Cache eth_blockNumbeplication
- Cache eth_gasPrice
- Cache eth_get* by 1 eth block
- Reset websockets if nothing comes in
