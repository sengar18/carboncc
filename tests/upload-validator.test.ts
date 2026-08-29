import { describe, it, expect } from 'vitest';
import { validateUploadedFile, sanitizeFilename } from '@/lib/storage/validator';

describe('Document Upload Validator', () => {
  it('should validate allowed document types within size limits', () => {
    const result = validateUploadedFile({
      name: 'discom_electricity_bill_jan2026.pdf',
      size: 1024 * 500, // 500 KB
      type: 'application/pdf',
    });

    expect(result.valid).toBe(true);
    expect(result.documentType).toBe('ELECTRICITY_BILL');
    expect(result.sanitizedFilename).toBe('discom_electricity_bill_jan2026.pdf');
  });

  it('should categorize weighbridge records correctly', () => {
    const result = validateUploadedFile({
      name: 'paddy_weighbridge_log_q3.xlsx',
      size: 1024 * 200,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    expect(result.valid).toBe(true);
    expect(result.documentType).toBe('WEIGHBRIDGE_RECORD');
  });

  it('should reject files exceeding 15MB size limit', () => {
    const result = validateUploadedFile({
      name: 'giant_video_archive.pdf',
      size: 16 * 1024 * 1024, // 16 MB
      type: 'application/pdf',
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain('File size exceeds');
  });

  it('should reject disallowed executable or script file extensions', () => {
    const result = validateUploadedFile({
      name: 'malicious_script.exe',
      size: 1024,
      type: 'application/x-msdownload',
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Disallowed file extension');
  });

  it('should sanitize dangerous filenames against directory traversal', () => {
    expect(sanitizeFilename('../../../etc/passwd')).toBe('passwd');
    expect(sanitizeFilename('my cool file (1).pdf')).toBe('my_cool_file__1_.pdf');
  });
});
