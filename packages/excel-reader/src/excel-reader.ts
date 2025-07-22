import { readFileSync } from 'node:fs';
import * as dfd from 'danfojs';
import * as XLSX from 'xlsx';

export interface ExcelReaderOptions {
  sheetName?: string;
  header?: number;
  skipRows?: number;
  maxRows?: number;
  columns?: string[];
}

export interface SheetInfo {
  name: string;
  range: string;
  rowCount: number;
  colCount: number;
}

export class ExcelReader {
  private workbook: XLSX.WorkBook | null = null;
  private filePath: string | null = null;

  /**
   * Load an Excel file (.xlsx, .xlsm, .xls)
   */
  loadFile(filePath: string): void {
    try {
      const buffer = readFileSync(filePath);
      this.workbook = XLSX.read(buffer, { type: 'buffer' });
      this.filePath = filePath;
    }
    catch (error) {
      throw new Error(`Failed to load Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get information about all sheets in the workbook
   */
  getSheetInfo(): SheetInfo[] {
    if (!this.workbook) {
      throw new Error('No Excel file loaded. Call loadFile() first.');
    }

    return this.workbook.SheetNames.map((name) => {
      const sheet = this.workbook!.Sheets[name];
      const range = sheet['!ref'] || '';
      const decodedRange = XLSX.utils.decode_range(range);

      return {
        name,
        range,
        rowCount: decodedRange.e.r + 1,
        colCount: decodedRange.e.c + 1,
      };
    });
  }

  /**
   * Get list of sheet names
   */
  getSheetNames(): string[] {
    if (!this.workbook) {
      throw new Error('No Excel file loaded. Call loadFile() first.');
    }
    return this.workbook.SheetNames;
  }

  /**
   * Read a sheet and convert to danfojs DataFrame
   */
  readSheet(options: ExcelReaderOptions = {}): dfd.DataFrame {
    if (!this.workbook) {
      throw new Error('No Excel file loaded. Call loadFile() first.');
    }

    const sheetName = options.sheetName || this.workbook.SheetNames[0];
    const sheet = this.workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in workbook`);
    }

    // Convert sheet to JSON with proper options
    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      header: options.header || 1,
      range: options.skipRows ? options.skipRows : undefined,
      defval: null,
    });

    // Handle empty data
    if (jsonData.length === 0) {
      throw new Error(`Sheet "${sheetName}" is empty or has no data`);
    }

    // Limit rows if specified
    const processedData = options.maxRows
      ? jsonData.slice(0, options.maxRows)
      : jsonData;

    // Filter columns if specified
    const finalData = options.columns
      ? processedData.map((row) => {
          const filteredRow: any = {};
          options.columns!.forEach((col) => {
            filteredRow[col] = (row as any)[col];
          });
          return filteredRow;
        })
      : processedData;

    // Create DataFrame
    try {
      return new dfd.DataFrame(finalData);
    }
    catch (error) {
      throw new Error(`Failed to create DataFrame: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Read a sheet and return as raw JSON array
   */
  readSheetAsJson(options: ExcelReaderOptions = {}): any[] {
    if (!this.workbook) {
      throw new Error('No Excel file loaded. Call loadFile() first.');
    }

    const sheetName = options.sheetName || this.workbook.SheetNames[0];
    const sheet = this.workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in workbook`);
    }

    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      header: options.header || 1,
      range: options.skipRows ? options.skipRows : undefined,
      defval: null,
    });

    // Limit rows if specified
    const processedData = options.maxRows
      ? jsonData.slice(0, options.maxRows)
      : jsonData;

    // Filter columns if specified
    const finalData = options.columns
      ? processedData.map((row) => {
          const filteredRow: any = {};
          options.columns!.forEach((col) => {
            filteredRow[col] = (row as any)[col];
          });
          return filteredRow;
        })
      : processedData;

    return finalData;
  }

  /**
   * Get column names from a sheet
   */
  getColumnNames(sheetName?: string): string[] {
    if (!this.workbook) {
      throw new Error('No Excel file loaded. Call loadFile() first.');
    }

    const targetSheet = sheetName || this.workbook.SheetNames[0];
    const sheet = this.workbook.Sheets[targetSheet];

    if (!sheet) {
      throw new Error(`Sheet "${targetSheet}" not found in workbook`);
    }

    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (jsonData.length === 0) {
      return [];
    }

    return (jsonData[0] as string[]) || [];
  }

  /**
   * Preview first few rows of a sheet
   */
  preview(sheetName?: string, rows: number = 5): any[] {
    return this.readSheetAsJson({
      sheetName,
      maxRows: rows,
    });
  }

  /**
   * Get file statistics
   */
  getFileStats(): {
    filePath: string | null;
    sheetCount: number;
    sheets: SheetInfo[];
  } {
    if (!this.workbook) {
      throw new Error('No Excel file loaded. Call loadFile() first.');
    }

    return {
      filePath: this.filePath,
      sheetCount: this.workbook.SheetNames.length,
      sheets: this.getSheetInfo(),
    };
  }
}

// Utility functions
export const excelUtils = {
  /**
   * Quick function to read an Excel file to DataFrame
   */
  readToDataFrame(filePath: string, options: ExcelReaderOptions = {}): dfd.DataFrame {
    const reader = new ExcelReader();
    reader.loadFile(filePath);
    return reader.readSheet(options);
  },

  /**
   * Quick function to read an Excel file to JSON
   */
  readToJson(filePath: string, options: ExcelReaderOptions = {}): any[] {
    const reader = new ExcelReader();
    reader.loadFile(filePath);
    return reader.readSheetAsJson(options);
  },

  /**
   * Get file info without loading full data
   */
  getFileInfo(filePath: string): {
    filePath: string | null;
    sheetCount: number;
    sheets: SheetInfo[];
  } {
    const reader = new ExcelReader();
    reader.loadFile(filePath);
    return reader.getFileStats();
  },
};
