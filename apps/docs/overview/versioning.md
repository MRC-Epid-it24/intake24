# Versioning system

Intake24 uses a hybrid versioning system based on [Calendar Versioning (CalVer)](https://calver.org)
and [Semantic Versioning (semver)](https://semver.org).

Version numbers generally follow the Semantic Versioning principles with the following exceptions:

- Major version is the year of the release in YYYY format
- Minor version starts at 1 instead of 0

## Format

Version numbers follow the format

<span style="font-size: larger;">**YYYY.MINOR.PATCH**</span>

where

**YYYY** is the year of the release using the four-digit format,

**MINOR** is the sequential number of a feature release in the corresponding year. "Feature release" means a major release adding
new features or functionality or significant changes to existing features.

**PATCH** is the sequential number of a bug fix release. "Bug fix release" means a release focused on fixing
issues with existing features without adding new functionality.

### Year increments

Bug fix releases are always associated with a specific feature release (i.e., **YYYY.MINOR**) and the year
should never be incremented when releasing bug fix versions, even if a bug fix release occurs in a
later year.

## Examples

**2022.1.0** — first feature release of 2022,

**2022.2.3** — third bug fix for the second feature release of 2022,

**2022.4.1** — a bug fix release for the final, fourth feature release of 2022 that could be released in 2023.

## Pre-release versions

Pre-release versions follow the [Semantic Versioning system](https://semver.org/#spec-item-9):

    A pre-release version MAY be denoted by appending a hyphen and a series of dot separated identifiers immediately following
    the patch version.

### Examples

**2022.1.0-beta** — initial beta release of the first feature release in 2022,

**2022.1.0-beta.4** — fourth update of the **2022.1.0** beta.
