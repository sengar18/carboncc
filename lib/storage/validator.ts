// ==============================================================================
// CARBONSCOUT INDIA — SECURE STORAGE & FILE VALIDATION
// ==============================================================================

import { config } from '../config';

export type InferredDocumentType =
  | 'AUDIT_REPORT'
  | 'ELECTRICITY_BILL'
  | 'PRODUCTION_LOG'
  | 'WEIGHBRIDGE_RECORD'
  | 'ENVIRONMENTAL_CLEARANCE'
  | 'GENERAL';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
  documentType?: InferredDocumentType;
}

const ALLOWED_EXTENSIONS = ['.pdf', '.csv', '.xlsx', '.xls', '.docx'];

export function sanitizeFilename(filename: string): string {
  // Remove directory traversal characters and special characters
  const base = filename.replace(/^.*[\\\/]/, '');
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function inferDocumentType(filename: string): InferredDocumentType {
  const lower = filename.toLowerCase();
  if (lower.includes('weighbridge')) {
    return 'WEIGHBRIDGE_RECORD';
  }
  if (lower.includes('audit') || lower.includes('energy') || lower.includes('carbon')) {
    return 'AUDIT_REPORT';
  }
  if (lower.includes('bill') || lower.includes('electricity') || lower.includes('tariff') || lower.includes('discom')) {
    return 'ELECTRICITY_BILL';
  }
  if (lower.includes('production') || lower.includes('milling') || lower.includes('capacity')) {
    return 'PRODUCTION_LOG';
  }
  if (lower.includes('clearance') || lower.includes('consent') || lower.includes('pcb') || lower.includes('moef')) {
    return 'ENVIRONMENTAL_CLEARANCE';
  }
  return 'GENERAL';
}

export function validateUploadedFile(file: {
  name: string;
  size: number;
  type: string;
}): FileValidationResult {
  // 1. Check file size
  if (file.size <= 0) {
    return { valid: false, error: 'File is empty (0 bytes).' };
  }

  if (file.size > config.maxUploadSizeBytes) {
    const maxMb = (config.maxUploadSizeBytes / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `File size exceeds the maximum allowed limit of ${maxMb}MB.` };
  }

  // 2. Check Extension
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Disallowed file extension: "${ext}". Allowed types: PDF, CSV, XLSX, XLS, DOCX.`,
    };
  }

  // 3. Check MIME type
  if (file.type && !config.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported MIME type: "${file.type}". Allowed types: PDF, CSV, Excel, Word documents.`,
    };
  }

  return {
    valid: true,
    sanitizedFilename: sanitizeFilename(file.name),
    documentType: inferDocumentType(file.name),
  };
}
