# Import food data from a portable format

This command allows to import a new locale/images/nutrient table from the pre-defined portable format (archived folder). The exact format can be supplied upon request

## Available options:

- `-c`, `--on-conflict` - How importer should handle the conflicts. Options:
  - skip
  - overwrite
  - abort
- `-m`, `--modules-for-execution` - What steps/modules importer should execute. Options:
  - 'enabled-local-foods'
  - images-as-served,
  - locales,
  - nutrients,
  - global-foods,
  - local-foods,
  - enabled-local-foods,
  - all **[Default if not chosen otherwise]**.
- `<version>` - Intake24 API version to use. Values: **v3**, **v4**
- `<package-file>` - Input package file path

**Do not use all in combination with other modules**

## Examples

### Executing all modules

```
pnpm run cli import-package -c overwrite -m all v4 /path/to/the/archived/ARCHIVED_FOLDER.zip
```

### Executing multiple modules

```
pnpm run cli import-package -c overwrite -m locales nutrients v4 /path/to/the/archived/ARCHIVED_FOLDER.zip
```

### Executing one module

```
pnpm run cli import-package -c overwrite -m enabled-local-foods v4 /path/to/the/archived/ARCHIVED_FOLDER.zip
```
