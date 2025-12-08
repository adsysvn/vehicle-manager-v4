import * as XLSX from 'xlsx';

interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

// Simple export - data already has headers as keys
export function exportToExcel(
  data: any[],
  fileName: string,
  sheetName: string = 'Sheet1'
) {
  if (data.length === 0) return;

  // Create worksheet directly from data (keys become headers)
  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-size columns based on header length
  const headers = Object.keys(data[0] || {});
  ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 2, 15) }));

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generate file
  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Advanced export with column definitions
export function exportToExcelWithColumns(
  data: any[],
  columns: ExportColumn[],
  fileName: string,
  sheetName: string = 'Sheet1'
) {
  const exportData = data.map(row => {
    const transformedRow: any = {};
    columns.forEach(col => {
      transformedRow[col.header] = row[col.key] || '';
    });
    return transformedRow;
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportMultipleSheets(
  sheets: Array<{
    data: any[];
    columns?: ExportColumn[];
    sheetName: string;
  }>,
  fileName: string
) {
  const wb = XLSX.utils.book_new();

  sheets.forEach(({ data, columns, sheetName }) => {
    let ws;
    if (columns) {
      const exportData = data.map(row => {
        const transformedRow: any = {};
        columns.forEach(col => {
          transformedRow[col.header] = row[col.key] || '';
        });
        return transformedRow;
      });
      ws = XLSX.utils.json_to_sheet(exportData);
      ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));
    } else {
      ws = XLSX.utils.json_to_sheet(data);
    }
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}
