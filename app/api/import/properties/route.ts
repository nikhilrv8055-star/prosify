import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { Unit, UnitStatus, ImportValidationReport, ImportFieldMapping } from '@/lib/types';

// Alias dictionary for smart field auto-detection
const TARGET_FIELD_CONFIG: Array<{
  targetField: string;
  label: string;
  required: boolean;
  aliases: string[];
}> = [
  {
    targetField: 'unitNumber',
    label: 'Unit / Flat Number',
    required: true,
    aliases: ['flat no', 'flat number', 'unit no', 'unit number', 'flat', 'unit', 'apartment no', 'door no', 'residence id'],
  },
  {
    targetField: 'price',
    label: 'Agreement Value / Price',
    required: true,
    aliases: ['price', 'cost', 'amount', 'total price', 'av', 'agreement value', 'quote', 'package price', 'inr'],
  },
  {
    targetField: 'carpetArea',
    label: 'RERA Carpet Area (sq.ft)',
    required: true,
    aliases: ['carpet area', 'carpet', 'area', 'sq ft', 'sqft', 'r-area', 'usable area', 'carpet sqft'],
  },
  {
    targetField: 'bhk',
    label: 'BHK Configuration',
    required: true,
    aliases: ['bhk', 'configuration', 'type', 'config', 'bedrooms', 'room type'],
  },
  {
    targetField: 'floor',
    label: 'Floor Level',
    required: false,
    aliases: ['floor', 'floor no', 'level', 'storey', 'floor number'],
  },
  {
    targetField: 'tower',
    label: 'Tower / Wing',
    required: false,
    aliases: ['tower', 'wing', 'building', 'block', 'phase', 'cluster'],
  },
  {
    targetField: 'status',
    label: 'Inventory Status',
    required: false,
    aliases: ['status', 'availability', 'booking status', 'inventory status', 'state'],
  },
  {
    targetField: 'facing',
    label: 'Vastu / Facing',
    required: false,
    aliases: ['facing', 'direction', 'orientation', 'vastu'],
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      csvText,
      projectId = 'proj-1',
      defaultTower = 'Tower A',
      customMapping = {},
      mode = 'COMMIT', // 'VALIDATE' | 'COMMIT'
      strategy = 'SKIP', // 'SKIP' | 'OVERWRITE'
    } = body;

    if (!csvText || typeof csvText !== 'string') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'csvText is required' } },
        { status: 400 }
      );
    }

    const rawLines = csvText
      .split(/\r?\n/)
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0);

    if (rawLines.length < 2) {
      return NextResponse.json(
        { success: false, error: { code: 'EMPTY_CSV', message: 'File must contain headers and at least 1 data row' } },
        { status: 400 }
      );
    }

    // Determine delimiter (comma or tab)
    const firstLine = rawLines[0];
    const delimiter = firstLine.includes('\t') ? '\t' : ',';

    const parseRow = (line: string): string[] => {
      if (delimiter === '\t') {
        return line.split('\t').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      }
      // Simple regex for CSV splitting respecting basic quotes
      const pattern = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
      const result: string[] = [];
      let match;
      while ((match = pattern.exec(line)) !== null) {
        let val = match[1] || '';
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1).replace(/""/g, '"');
        }
        result.push(val.trim());
        if (match.index + match[0].length >= line.length) break;
      }
      return result.length > 0 ? result : line.split(',').map((c) => c.trim());
    };

    const headers = parseRow(rawLines[0]);

    // Smart Field Mapping Calculation with confidence scores
    const smartMappings: ImportFieldMapping[] = [];
    const resolvedMapping: Record<string, string> = { ...customMapping };

    TARGET_FIELD_CONFIG.forEach((config) => {
      if (resolvedMapping[config.targetField]) {
        smartMappings.push({
          sourceColumn: resolvedMapping[config.targetField],
          targetField: config.targetField,
          confidence: 100,
          isRequired: config.required,
        });
        return;
      }

      // Auto-detect by aliases
      let matchedHeader = '';
      let highestConfidence = 0;

      for (const h of headers) {
        const lowerH = h.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
        for (const alias of config.aliases) {
          if (lowerH === alias) {
            matchedHeader = h;
            highestConfidence = 98;
            break;
          } else if (lowerH.includes(alias) || alias.includes(lowerH)) {
            if (highestConfidence < 85) {
              matchedHeader = h;
              highestConfidence = 85;
            }
          }
        }
        if (highestConfidence === 98) break;
      }

      if (matchedHeader) {
        resolvedMapping[config.targetField] = matchedHeader;
        smartMappings.push({
          sourceColumn: matchedHeader,
          targetField: config.targetField,
          confidence: highestConfidence,
          isRequired: config.required,
        });
      }
    });

    // Existing store units for duplicate detection
    const existingUnits = store.getUnits().filter((u) => u.projectId === projectId);

    const validRecords: Unit[] = [];
    const validationErrors: Array<{ row: number; field: string; error: string; rawValue: string }> = [];
    const duplicates: Array<{
      row: number;
      unitNumber: string;
      tower: string;
      existingPrice: number;
      newPrice: number;
      existingStatus: string;
      newStatus: string;
    }> = [];

    const previewRows: Array<{ rowNumber: number; parsed: Partial<Unit>; raw: Record<string, string> }> = [];

    for (let i = 1; i < rawLines.length; i++) {
      const rowCols = parseRow(rawLines[i]);
      const rowData: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowData[h] = rowCols[idx] || '';
      });

      const unitNumberRaw = rowData[resolvedMapping.unitNumber] || rowData['Flat No'] || rowData['Unit No'] || '';
      const priceRaw = rowData[resolvedMapping.price] || rowData['Price'] || rowData['Amount'] || '';
      const carpetRaw = rowData[resolvedMapping.carpetArea] || rowData['Area'] || rowData['Carpet Area'] || '';
      const floorRaw = rowData[resolvedMapping.floor] || rowData['Floor'] || '1';
      const bhkRaw = rowData[resolvedMapping.bhk] || rowData['BHK'] || '2 BHK';
      const statusRaw = (rowData[resolvedMapping.status] || rowData['Status'] || 'AVAILABLE').toUpperCase().trim();
      const towerRaw = rowData[resolvedMapping.tower] || rowData['Tower'] || defaultTower || 'Tower A';
      const facingRaw = rowData[resolvedMapping.facing] || rowData['Facing'] || 'East';

      let rowHasFatalError = false;

      // Validate Unit Number
      if (!unitNumberRaw.trim()) {
        validationErrors.push({
          row: i + 1,
          field: 'unitNumber',
          error: 'Unit/Flat number is empty',
          rawValue: unitNumberRaw,
        });
        rowHasFatalError = true;
      }

      // Validate Price
      const cleanPrice = parseFloat(priceRaw.replace(/[^\d.]/g, '') || '0');
      if (isNaN(cleanPrice) || cleanPrice <= 0) {
        validationErrors.push({
          row: i + 1,
          field: 'price',
          error: 'Price must be a positive numeric value in INR',
          rawValue: priceRaw,
        });
        rowHasFatalError = true;
      }

      // Validate Carpet Area
      const cleanCarpet = parseFloat(carpetRaw.replace(/[^\d.]/g, '') || '0');
      if (isNaN(cleanCarpet) || cleanCarpet <= 0) {
        validationErrors.push({
          row: i + 1,
          field: 'carpetArea',
          error: 'Carpet Area must be greater than 0 sq.ft',
          rawValue: carpetRaw,
        });
        rowHasFatalError = true;
      }

      const floor = parseInt(floorRaw.replace(/[^\d]/g, '') || '1', 10);
      let status: UnitStatus = 'AVAILABLE';
      if (['SOLD', 'BOOKED', 'HOLD', 'BLOCKED'].includes(statusRaw)) {
        status = statusRaw as UnitStatus;
      }

      if (rowHasFatalError) continue;

      // Duplicate Check
      const existingMatch = existingUnits.find(
        (u) =>
          u.tower.toLowerCase() === towerRaw.toLowerCase() &&
          u.unitNumber.toLowerCase() === unitNumberRaw.toLowerCase()
      );

      if (existingMatch) {
        duplicates.push({
          row: i + 1,
          unitNumber: unitNumberRaw,
          tower: towerRaw,
          existingPrice: existingMatch.price,
          newPrice: cleanPrice,
          existingStatus: existingMatch.status,
          newStatus: status,
        });
      }

      const parsedUnit: Unit = {
        id: existingMatch?.id || `u-imp-${Date.now()}-${i}`,
        projectId,
        tower: towerRaw,
        floor: isNaN(floor) ? 1 : floor,
        unitNumber: unitNumberRaw,
        bhk: bhkRaw,
        configuration: `${bhkRaw} Luxury Residence`,
        carpetArea: cleanCarpet,
        builtUpArea: Math.round(cleanCarpet * 1.3),
        price: cleanPrice,
        status,
        facing: facingRaw,
      };

      validRecords.push(parsedUnit);

      if (previewRows.length < 5) {
        previewRows.push({
          rowNumber: i + 1,
          parsed: parsedUnit,
          raw: rowData,
        });
      }
    }

    const totalRows = rawLines.length - 1;
    const report: ImportValidationReport = {
      totalRows,
      validRows: validRecords.length,
      invalidRows: validationErrors.length,
      duplicatesFound: duplicates.length,
      detectedMappings: smartMappings,
      errors: validationErrors,
      previewRows,
      duplicateRows: duplicates,
    };

    // If mode is VALIDATE, return report directly without committing
    if (mode === 'VALIDATE') {
      return NextResponse.json({
        success: true,
        mode: 'VALIDATE',
        report,
      });
    }

    // COMMIT MODE
    const commitResult = store.bulkImportUnitsWithStrategy(
      validRecords,
      strategy === 'OVERWRITE' ? 'OVERWRITE' : 'SKIP'
    );

    return NextResponse.json({
      success: true,
      mode: 'COMMIT',
      strategy,
      createdCount: commitResult.created,
      updatedCount: commitResult.updated,
      duplicatesSkipped: strategy === 'SKIP' ? commitResult.duplicates : 0,
      report,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'IMPORT_EXCEPTION', message: err.message || 'Import processing error' } },
      { status: 500 }
    );
  }
}
