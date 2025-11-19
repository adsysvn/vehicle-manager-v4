import * as XLSX from 'xlsx';

interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

export function exportToExcel(
  data: any[],
  columns: ExportColumn[],
  fileName: string,
  sheetName: string = 'Sheet1'
) {
  // Transform data to match columns
  const exportData = data.map(row => {
    const transformedRow: any = {};
    columns.forEach(col => {
      transformedRow[col.header] = row[col.key] || '';
    });
    return transformedRow;
  });

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generate file
  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportMultipleSheets(
  sheets: Array<{
    data: any[];
    columns: ExportColumn[];
    sheetName: string;
  }>,
  fileName: string
) {
  const wb = XLSX.utils.book_new();

  sheets.forEach(({ data, columns, sheetName }) => {
    const exportData = data.map(row => {
      const transformedRow: any = {};
      columns.forEach(col => {
        transformedRow[col.header] = row[col.key] || '';
      });
      return transformedRow;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}
