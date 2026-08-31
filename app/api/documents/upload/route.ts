// ==============================================================================
// CARBONSCOUT INDIA — SECURE DOCUMENT UPLOAD API
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db/memory-store';
import { validateUploadedFile } from '@/lib/storage/validator';
import { logAuditEvent } from '@/lib/audit';
import { DocumentRecord } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;

    if (!file || !projectId) {
      return NextResponse.json(
        { error: 'File and projectId are required fields.' },
        { status: 400 }
      );
    }

    const validation = validateUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const docId = `doc-${Date.now()}`;
    const storagePath = `projects/${projectId}/documents/${validation.sanitizedFilename}`;

    const docRecord: DocumentRecord = {
      id: docId,
      project_id: projectId,
      file_name: file.name,
      storage_path: storagePath,
      file_size_bytes: file.size,
      mime_type: file.type,
      document_type: validation.documentType || 'GENERAL',
      upload_status: 'PROCESSED',
      extracted_text_preview: `Validated document "${file.name}" (${(file.size / 1024).toFixed(1)} KB). Categorized as ${validation.documentType}.`,
      created_at: new Date().toISOString(),
    };

    memoryStore.documents.set(docId, docRecord);

    await logAuditEvent({
      entityType: 'DOCUMENT',
      entityId: docId,
      action: 'DOCUMENT_UPLOADED',
      details: {
        fileName: file.name,
        fileSizeBytes: file.size,
        documentType: docRecord.document_type,
      },
    });

    return NextResponse.json({
      success: true,
      document: docRecord,
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed' }, { status: 500 });
  }
}
