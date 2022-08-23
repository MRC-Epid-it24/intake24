# Releases

Releases follow two standards:

- [Calver](/overview/versioning) versioning for version control
- [Angular commit convention](/overview/source-code#commit-convention) for changelog generation

## Prepare and release

Have a clean git working directory and run following command to prepare and push release.

```sh
pnpm release
```

Please see [`scripts/release.ts`](https://github.com/MRC-Epid-it24/intake24/blob/master/scripts/release.ts) for details implementation.

Release command run following actions:

- asks for target release type confirmation
- updates `package.json` files with
- generates changelog and saved to [`CHANGELOG.md`](https://github.com/MRC-Epid-it24/intake24/blob/master/CHANGELOG.md)
- asks for changelog review and verification
- commits changes to `package.json` and `CHANGELOG.md` files
- creates a `tag` with target version
- pushes both `master` and `tag` to github

## Github release

Once release has been pushed to github, github release needs to be created. Copy & paste previous release text with reference to `CHANGELOG.md`.
