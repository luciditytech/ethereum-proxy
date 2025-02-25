# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Add
- Poll blocks periodically if BLOCK_POLL_TIMEOUT is set
- Health service return 500 if no blocks show up

## [0.3.4] - 2020-08-13
### Added
- NewRelic monitoring

## [0.3.3] - 2020-06-30
### Added
- SSH tooling

### Fixed
- Docker tag
- Docker running as non root

## [0.3.2] - 2020-04-07
### Changed
- Deploy to new Kubernetes production cluster

## [0.3.1] - 2019-09-18
### Fixed
- Makefile

## [0.3.0] - 2019-09-18
### Changed
- Use web3 2.x for WebSocket interaction

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
- Cache eth_blockNumber
- Cache eth_gasPrice
- Cache eth_get* by 1 eth block
- Reset websockets if nothing comes in
