#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ExcelReader } from './excel-reader.js';
import { createCsvJapanFoodListValidator } from './validation/csv-validator.js';

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help')) {
  console.log(`
Excel Reader Validation CLI

Usage: excel-reader validate <file> [options]

Commands:
  validate <file>    Validate a Japanese food list Excel file

Options:
  --output <file>    Save detailed report to file (JSON format)
  --summary          Show summary only
  --max-errors <n>   Maximum errors to process (default: 1000)
  --show-valid       Include valid rows in output
  --help             Show this help message

Examples:
  excel-reader validate japan-food-list.xlsx
  excel-reader validate japan-food-list.xlsx --output report.json
  excel-reader validate japan-food-list.xlsx --summary
`);
  process.exit(0);
}

const command = args[0];
const filePath = args[1];

if (command !== 'validate' || !filePath) {
  console.error('❌ Invalid command. Use --help for usage information.');
  process.exit(1);
}

// Parse options
const options = {
  output: '',
  summary: false,
  maxErrors: 1000,
  showValid: false,
};

for (let i = 2; i < args.length; i++) {
  switch (args[i]) {
    case '--output':
      options.output = args[++i] || '';
      break;
    case '--summary':
      options.summary = true;
      break;
    case '--max-errors':
      options.maxErrors = Number.parseInt(args[++i] || '1000', 10);
      break;
    case '--show-valid':
      options.showValid = true;
      break;
  }
}

try {
  console.log('🔍 Validating Japanese Food List...\n');

  // Load the Excel file
  const reader = new ExcelReader();
  const absolutePath = resolve(filePath);
  reader.loadFile(absolutePath);

  // Get sheet info
  const sheets = reader.getSheetNames();
  const mainSheet = sheets.find(s => s.toLowerCase().includes('japanese') || s.toLowerCase().includes('food')) || sheets[0];

  console.log(`📁 File: ${absolutePath}`);
  console.log(`📋 Validating sheet: "${mainSheet}"\n`);

  // Read all data
  const dataFrame = reader.readSheet({
    sheetName: mainSheet,
    skipRows: 1, // Skip header row
  });

  const data = dataFrame.values as any[][];

  // Create validator and validate
  const validator = createCsvJapanFoodListValidator();
  const report = validator.validateData(data);

  // Display results
  if (options.summary) {
    console.log('=== VALIDATION SUMMARY ===');
    console.log(`Total Rows: ${report.totalRows}`);
    console.log(`Valid: ${report.validRows} (${((report.validRows / report.totalRows) * 100).toFixed(1)}%)`);
    console.log(`Invalid: ${report.invalidRows} (${((report.invalidRows / report.totalRows) * 100).toFixed(1)}%)`);
    console.log(`Warnings: ${report.rowsWithWarnings}`);

    if (report.summary.commonErrors.length > 0) {
      console.log('\nMost Common Errors:');
      report.summary.commonErrors.slice(0, 5).forEach(({ message, count }: { message: string; count: number }) => {
        console.log(`  - ${count}x: ${message}`);
      });
    }
  }
  else {
    // Show detailed report
    console.log('\n=== DETAILED REPORT ===');
    console.log(`Total Rows: ${report.totalRows}`);
    console.log(`Valid Rows: ${report.validRows}`);
    console.log(`Invalid Rows: ${report.invalidRows}`);
    if (report.errors.length > 0) {
      console.log('\nTop Errors:');
      report.summary.commonErrors.slice(0, 5).forEach((error) => {
        console.log(`  ${error.count}x: ${error.message}`);
      });
    }
  }

  // Save to file if requested
  if (options.output) {
    const outputData = {
      file: absolutePath,
      sheet: mainSheet,
      validatedAt: new Date().toISOString(),
      report: {
        ...report,
        // Include only requested data
        errors: options.showValid ? report.errors : report.errors.slice(0, 100),
        warnings: options.showValid ? report.warnings : report.warnings.slice(0, 100),
      },
    };

    writeFileSync(options.output, JSON.stringify(outputData, null, 2));
    console.log(`\n✅ Detailed report saved to: ${options.output}`);
  }

  // Exit with error code if validation failed
  if (report.invalidRows > 0) {
    console.log('\n❌ Validation failed with errors');
    process.exit(1);
  }
  else if (report.rowsWithWarnings > 0) {
    console.log('\n⚠️  Validation passed with warnings');
  }
  else {
    console.log('\n✅ Validation passed successfully');
  }
}
catch (error) {
  console.error('❌ Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}
