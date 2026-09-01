// ==============================================================================
// CARBONSCOUT INDIA — DOCUMENT UPLOAD API ROUTE
// ==============================================================================
// CARBONSCOUT INDIA — SECURE DOCUMENT UPLOAD API
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateUploadedFile } from '@/lib/storage/validator';
import { logAuditEvent } from '@/lib/audit';
import { DocumentRecord } from '@/lib/db/schema';
import { sha256 } from '@/lib/provenance';
import { isValidUUID, generateUUID } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;

    if (!file || !projectId || !isValidUUID(projectId)) {
      return NextResponse.json(
        { error: 'Valid file and projectId are required.' },
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

    const docId = generateUUID();
    const contentHash = sha256(Buffer.from(await file.arrayBuffer()));
    const storagePath = `metadata-only://projects/${projectId}/documents/${validation.sanitizedFilename}`;

    const docRecord: DocumentRecord = {
      id: docId,
      project_id: projectId,
      file_name: file.name,
      storage_path: storagePath,
      file_size_bytes: file.size,
      mime_type: file.type,
      content_hash: contentHash,
      document_type: validation.documentType || 'GENERAL',
      upload_status: 'PROCESSED',
      extracted_text_preview: `Validated metadata for "${file.name}" (${(file.size / 1024).toFixed(1)} KB). Binary content is not stored by this endpoint.`,
      created_at: new Date().toISOString(),
    };

    await db.createDocument(docRecord);

    await logAuditEvent({
      entityType: 'DOCUMENT',
      entityId: docId,
      action: 'DOCUMENT_UPLOADED',
      details: {
        fileName: file.name,
        fileSizeBytes: file.size,
        documentType: docRecord.document_type,
        contentHash,
      },
    });

    return NextResponse.json({
      success: true,
      document: docRecord,
      storage: { mode: 'metadata_only', binaryStored: false },
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
