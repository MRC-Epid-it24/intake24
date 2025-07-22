# Excel Reader Examples

This directory contains example files and configurations for the `@intake24/excel-reader` package.

## Sample Files

### Sample Food List (`sample-food-list.csv` & `sample-food-list.xlsm`)

Sample dataset with 50 food items inspired by a Japanese food database. Contains:

- **Mixed languages**: English and Japanese food names
- **Various food types**: Grains, proteins, vegetables, fruits, dairy
- **Different validation scenarios**: Valid and invalid data for testing
- **Realistic data structure**: Based on Intake24 food import format

**Columns:**

- Intake24 Code (unique identifiers)
- Action (1-4, import actions)
- English Description
- Local Description (Japanese)
- Food Composition Table (AUSNUT, STFCJ, etc.)
- Food Composition Record ID
- Various optional metadata fields

### Running the Example

```bash
# Build the package first
pnpm build

# Run the validation example
npx tsx examples/validate-sample-files.ts
```

This will demonstrate:

- Reading both Excel and CSV formats
- Schema-based validation with Japanese character support
- Error reporting and data quality analysis
- Performance with different file sizes

## Domain-Specific Configurations

### Japanese Food Validation (`japanese-food-validation/`)

Complete validation configuration extracted from the generic package for Japanese food import workflows:

- **`jp-config.ts`** - Validation rules for Japanese food lists
- **`jp-research-reporter.ts`** - Quality analysis and reporting tools
- **`README.md`** - Detailed documentation and usage examples

Use this as a template for creating your own domain-specific configurations.

## Creating Custom Examples

### 1. Create Sample Data

```typescript
import { z } from 'zod';
import { createRowSchema, createCsvValidator } from '@intake24/excel-reader';

// Define your data structure
const mySchema = createRowSchema({
  0: z.string().min(1, 'ID required'),
  1: z.string().email('Invalid email'),
  2: z.string().transform(Number).pipe(z.number().min(0)),
});

// Create validator
const validator = createCsvValidator(mySchema);
```

### 2. Add Validation Rules

```typescript
// Custom validation for your domain
const customSchema = z.object({
  code: z.string().regex(/^[A-Z]{3}\d{3}$/, 'Format: ABC123'),
  name: z.string().min(3, 'Name too short'),
  category: z.enum(['TYPE_A', 'TYPE_B', 'TYPE_C']),
});
```

### 3. Test with Sample Files

Create small sample files (10-50 rows) with:

- Valid data (majority of rows)
- Invalid data (test error handling)
- Edge cases (empty fields, special characters)
- Different languages if applicable

## File Format Guidelines

### Excel Files (.xlsx, .xlsm)

- Use clear headers in row 1
- Set appropriate column widths
- Consider adding a metadata sheet
- Use proper encoding for international characters

### CSV Files (.csv)

- UTF-8 encoding with BOM for Excel compatibility
- Consistent delimiter usage
- Proper quoting for fields with commas/quotes
- Header row for column identification

## Contributing Examples

When adding new examples:

1. **Keep files small** - 50-100 rows maximum for sample data
2. **Include documentation** - Explain the use case and data structure
3. **Add validation** - Create corresponding validation schemas
4. **Test thoroughly** - Verify examples work with the latest package version
5. **Follow naming** - Use descriptive, consistent file names

### Example Structure

```
examples/
├── my-domain/
│   ├── README.md              # Domain-specific documentation
│   ├── config.ts              # Validation configuration
│   ├── sample-data.csv        # Small sample dataset
│   ├── sample-data.xlsm       # Excel version with metadata
│   └── validate-example.ts    # Demo script
└── README.md                  # This file
```

## Performance Testing

For testing with larger datasets:

```typescript
// Create streaming validator for large files
const streamValidator = createStreamCsvValidator(schema, {
  batchSize: 5000,
  maxErrors: 1000,
  onProgress: (processed, total, errors) => {
    console.log(`Progress: ${processed}/${total} (${errors} errors)`);
  }
});
```

Consider creating performance test files:

- Small: < 1MB (< 5,000 rows)
- Medium: 1-10MB (5,000-50,000 rows)
- Large: 10-100MB (50,000-500,000 rows)
- Very Large: > 100MB (> 500,000 rows)

Use the streaming validator for Medium+ files to maintain memory efficiency.
