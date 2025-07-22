# @intake24/excel-reader

TypeScript library for Excel/CSV processing with validation, designed for dietary assessment data with specialized Japanese food list support.

## Features

- Excel & CSV reading with DataFrame integration
- Zod-based validation framework with custom rules
- Japanese food list validation for Intake24 imports
- Unicode support for Japanese text
- Streaming support for large files
- Complete TypeScript support

## Installation

```bash
pnpm add @intake24/excel-reader
```

## Usage

```typescript
import { ExcelReader, CsvReader, createCsvJapanFoodListValidator } from '@intake24/excel-reader';

// Read files
const excelReader = new ExcelReader();
excelReader.loadFile('data.xlsx');
const data = excelReader.readSheet({ sheetName: 'Sheet1' });

// Validate Japanese food lists
const validator = createCsvJapanFoodListValidator({ maxErrors: 500 });
const report = await validator.validateCsvFile('food-list.csv');
```

## Key Classes

- **ExcelReader** - Read Excel files (.xlsx, .xls) with DataFrame support
- **CsvReader** - High-performance CSV processing with streaming
- **CsvValidator** - Zod-based validation with custom rules
- **createCsvJapanFoodListValidator** - Pre-configured for Japanese food imports

## Japanese Food Validation

The Japanese food list validator includes:

- Intake24 code validation (1-32 characters)
- Japanese character detection in descriptions
- 18-column structure validation
- Action-based import filtering (values 1-4)
- Food composition table verification

## Performance

- Small files (<10MB): In-memory processing
- Large files (>10MB): Enable streaming with `streaming: true`
- Configure `batchSize` for optimal batch processing
- Set `maxErrors` limits for memory management

## Development

```bash
pnpm install  # Install dependencies
pnpm build    # Build package
pnpm test     # Run tests
pnpm lint     # Lint code
```

## License

Apache-2.0
