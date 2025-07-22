import type { ValidationReport } from './types.js';
import { writeFileSync } from 'node:fs';

export interface ResearchReportOptions {
  maxExamplesPerIssue?: number;
}

export interface ResearchReport {
  metadata: {
    generatedAt: string;
    totalRows: number;
    validRows: number;
    invalidRows: number;
    validationRate: number;
    qualityGrade: string;
  };
  invalidCodes: {
    summary: {
      totalInvalid: number;
      byPattern: Record<string, { count: number; examples: string[] }>;
    };
    details: Array<{
      rowNumber: number;
      code: string;
      englishDescription: string;
      japaneseDescription: string;
      issue: string;
      suggestion: string;
    }>;
  };
  missingData: {
    missingCategories: Array<{
      rowNumber: number;
      code: string;
      englishDescription: string;
      japaneseDescription: string;
    }>;
    missingJapaneseText: Array<{
      rowNumber: number;
      code: string;
      englishDescription: string;
      currentJapaneseText: string;
    }>;
    missingPortionMethods: Array<{
      rowNumber: number;
      code: string;
      englishDescription: string;
      japaneseDescription: string;
    }>;
  };
}

export class ResearchReporter {
  /**
   * Check if a row should be excluded from research analysis (action = '1')
   */
  shouldExcludeRow(row: any[]): boolean {
    // Action is in column 1 (0-indexed)
    const action = row[1]?.toString().trim();
    return action === '1';
  }

  generateResearchReport(
    validationReport: ValidationReport,
    rawData: any[][],
    options: ResearchReportOptions = {},
  ): ResearchReport {
    const {
      maxExamplesPerIssue = 10,
    } = options;

    const metadata = this.generateMetadata(validationReport);
    const invalidCodes = this.analyzeInvalidCodes(validationReport, rawData, maxExamplesPerIssue);
    const missingData = this.analyzeMissingData(validationReport, rawData);

    return {
      metadata,
      invalidCodes,
      missingData,
    };
  }

  private generateMetadata(report: ValidationReport) {
    const validationRate = (report.validRows / report.totalRows) * 100;
    let qualityGrade = 'F';
    if (validationRate >= 95)
      qualityGrade = 'A+';
    else if (validationRate >= 90)
      qualityGrade = 'A';
    else if (validationRate >= 85)
      qualityGrade = 'B+';
    else if (validationRate >= 80)
      qualityGrade = 'B';
    else if (validationRate >= 75)
      qualityGrade = 'C+';
    else if (validationRate >= 70)
      qualityGrade = 'C';
    else if (validationRate >= 60)
      qualityGrade = 'D';

    return {
      generatedAt: new Date().toISOString(),
      totalRows: report.totalRows,
      validRows: report.validRows,
      invalidRows: report.invalidRows,
      validationRate,
      qualityGrade,
    };
  }

  private analyzeInvalidCodes(
    report: ValidationReport,
    rawData: any[][],
    maxExamples: number,
  ) {
    const codeErrors = report.errors.filter(result =>
      result.errors.some(error => error.rule === 'validIntake24Code'),
    );

    // Categorize invalid codes by pattern
    const patternCounts = new Map<string, { count: number; examples: string[] }>();

    codeErrors.forEach((result) => {
      const code = result.data[0]?.toString() || '';
      const pattern = this.categorizeCodePattern(code);

      if (!patternCounts.has(pattern)) {
        patternCounts.set(pattern, { count: 0, examples: [] });
      }

      const patternData = patternCounts.get(pattern)!;
      patternData.count++;

      if (patternData.examples.length < maxExamples && !patternData.examples.includes(code)) {
        patternData.examples.push(code);
      }
    });

    // Generate detailed list with suggestions
    const details = codeErrors.map((result) => {
      const code = result.data[0]?.toString() || '';
      const englishDesc = result.data[2]?.toString() || '';
      const japaneseDesc = result.data[3]?.toString() || '';
      const issue = result.errors.find(e => e.rule === 'validIntake24Code')?.message || '';

      return {
        rowNumber: result.rowIndex + 2, // +2 for header and 0-index
        code,
        englishDescription: englishDesc,
        japaneseDescription: japaneseDesc,
        issue,
        suggestion: this.generateCodeSuggestion(code),
      };
    });

    return {
      summary: {
        totalInvalid: codeErrors.length,
        byPattern: Object.fromEntries(patternCounts),
      },
      details,
    };
  }

  private categorizeCodePattern(code: string): string {
    if (!code)
      return 'Empty code';

    // Check various patterns
    if (code.match(/^[A-Z]{4}$/))
      return 'Valid International (XXXX)';
    if (code.match(/^jp[a-z]\d{4}[a-z]?$/))
      return 'Valid Japanese (jpXXXXX)';
    if (code.match(/^jp[a-z]\d{5}[a-z]?$/))
      return 'Japanese 5-digit (jpXXXXXX)';
    if (code.match(/^[A-Z]\d{3,4}$/))
      return 'Letter-number mix (FXXX)';
    if (code.match(/^[A-Z]{3}$/))
      return 'Too short (XXX)';
    if (code.match(/^[A-Z]{5,}$/))
      return 'Too long (XXXXX+)';
    if (code.includes('-'))
      return 'Contains dashes';
    if (code.includes(' '))
      return 'Contains spaces';
    if (code.includes('/'))
      return 'Contains slashes';
    if (code.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/))
      return 'Contains Japanese characters';
    if (code.match(/^\d+$/))
      return 'Pure numbers';

    return 'Other invalid format';
  }

  private generateCodeSuggestion(code: string): string {
    if (!code)
      return 'Generate new code';

    // Generate suggestions based on pattern
    if (code.match(/^F\d{3,4}$/)) {
      return `Convert to jp format: jp${code.toLowerCase()}`;
    }
    if (code.match(/^D\d{5}[a-z]?$/)) {
      return `Convert to jp format: jp${code.toLowerCase()}`;
    }
    if (code.match(/^[A-Z]{3}$/)) {
      return `Extend to 4 letters: ${code}X (or create new code)`;
    }
    if (code.match(/^[A-Z]{5,}$/)) {
      return `Shorten to 4 letters: ${code.substring(0, 4)}`;
    }
    if (code.includes('-')) {
      return `Remove dashes: ${code.replace(/-/g, '')}`;
    }
    if (code.includes(' ')) {
      return `Remove spaces: ${code.replace(/\s+/g, '')}`;
    }
    if (code.match(/^\d+$/)) {
      return `Add prefix: FOOD${code} or jp${code}`;
    }

    return 'Review and correct manually';
  }

  private analyzeMissingData(report: ValidationReport, rawData: any[][]) {
    const missingCategories = report.errors
      .filter(result => result.errors.some(error => error.message === 'Categories are required'))
      .map(result => ({
        rowNumber: result.rowIndex + 2,
        code: result.data[0]?.toString() || '',
        englishDescription: result.data[2]?.toString() || '',
        japaneseDescription: result.data[3]?.toString() || '',
      }));

    const missingJapaneseText = report.errors
      .filter(result => result.errors.some(error => error.message === 'Field must contain Japanese characters'))
      .map(result => ({
        rowNumber: result.rowIndex + 2,
        code: result.data[0]?.toString() || '',
        englishDescription: result.data[2]?.toString() || '',
        currentJapaneseText: result.data[3]?.toString() || '',
      }));

    const missingPortionMethods = report.errors
      .filter(result => result.errors.some(error => error.message === 'Portion size methods are required'))
      .map(result => ({
        rowNumber: result.rowIndex + 2,
        code: result.data[0]?.toString() || '',
        englishDescription: result.data[2]?.toString() || '',
        japaneseDescription: result.data[3]?.toString() || '',
      }));

    return {
      missingCategories,
      missingJapaneseText,
      missingPortionMethods,
    };
  }

  // Export CSV with proper UTF-8 encoding and BOM for Excel compatibility
  exportToCsv(report: ResearchReport, filename: string): void {
    const csvLines = [
      'Row Number,Code,English Description,Japanese Description,Issue Type,Issue,Suggestion',
      ...report.invalidCodes.details.map(item => [
        item.rowNumber,
        `"${item.code}"`,
        `"${item.englishDescription.replace(/"/g, '""')}"`,
        `"${item.japaneseDescription.replace(/"/g, '""')}"`,
        'Invalid Code',
        `"${item.issue.replace(/"/g, '""')}"`,
        `"${item.suggestion.replace(/"/g, '""')}"`,
      ].join(',')),
      ...report.missingData.missingCategories.map(item => [
        item.rowNumber,
        `"${item.code}"`,
        `"${item.englishDescription.replace(/"/g, '""')}"`,
        `"${item.japaneseDescription.replace(/"/g, '""')}"`,
        'Missing Categories',
        'Categories are required',
        'Add food category codes (e.g., CBAR, CHCS)',
      ].join(',')),
      ...report.missingData.missingJapaneseText.map(item => [
        item.rowNumber,
        `"${item.code}"`,
        `"${item.englishDescription.replace(/"/g, '""')}"`,
        `"${item.currentJapaneseText.replace(/"/g, '""')}"`,
        'Missing Japanese',
        'Japanese description required',
        'Add Japanese translation',
      ].join(',')),
      ...report.missingData.missingPortionMethods.map(item => [
        item.rowNumber,
        `"${item.code}"`,
        `"${item.englishDescription.replace(/"/g, '""')}"`,
        `"${item.japaneseDescription.replace(/"/g, '""')}"`,
        'Missing Portion Methods',
        'Portion size methods are required',
        'Add portion size estimation methods',
      ].join(',')),
    ];

    // Write with UTF-8 BOM for proper Excel compatibility with Japanese characters
    const csvContent = `\uFEFF${csvLines.join('\n')}`;
    writeFileSync(filename, csvContent, 'utf8');
  }
}

// Generate CSV research report with proper UTF-8 encoding
export function generateCsvResearchReport(
  validationReport: ValidationReport,
  rawData: any[][],
  filename: string,
  options: ResearchReportOptions = {},
): ResearchReport {
  const reporter = new ResearchReporter();

  // Filter out rows with action '1' (not to be imported) - skip header row
  const filteredRawData = [
    rawData[0], // Keep header row
    ...rawData.slice(1).filter(row => !reporter.shouldExcludeRow(row)),
  ];

  const excludedCount = rawData.length - filteredRawData.length;
  if (excludedCount > 0) {
    console.log(`ℹ️  Filtered out ${excludedCount} rows with action '1' from research analysis`);
  }

  const report = reporter.generateResearchReport(validationReport, filteredRawData, options);

  // Export only CSV with proper UTF-8 encoding and BOM
  reporter.exportToCsv(report, filename);

  return report;
}
