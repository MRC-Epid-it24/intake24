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
- generates changelog from git commits to CLI
- asks for confirmation
- commits changes to `package.json` files
- creates a `tag` with target version
- pushes both `master` and `tag` to github

## Github release

Once release has been pushed to github, github release needs to be created. Copy & paste generated changelog to github release description.
