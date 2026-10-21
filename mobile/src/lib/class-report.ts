// Class report files (roadmap item 11, 2026-10-21): the report JSON from GET /api/classes/:id/report
// rendered on the device as a CSV (one long table: student, section, item, detail, result, date) or
// as a PDF (one page per class, a block per student), then handed to the share sheet.
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { ClassReport } from '@/lib/types/education';

const when = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' }) : '');
const dateOnly = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString('en-CA', { dateStyle: 'medium' }) : '');
const csvCell = (v: string | number | null | undefined) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const esc = (s: string | null | undefined) => (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const safeName = (s: string) => s.replace(/[^A-Za-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'class';
const STATUS: Record<string, string> = { not_started: 'Not started', in_progress: 'In progress', completed: 'Completed' };

export function reportToCsv(r: ClassReport): string {
  const rows: (string | number | null)[][] = [['Student', 'Section', 'Item', 'Detail', 'Result', 'Date']];
  for (const s of r.students) {
    rows.push([s.displayName, 'Student', s.linkedToDevice ? 'Joined with a device' : 'Added by name (no device work recorded)', '', '', dateOnly(s.joinedAt)]);
    for (const a of s.assignments) {
      rows.push([s.displayName, 'Assignment', a.title, a.resourceTitle ?? a.type.replace(/_/g, ' '), `${STATUS[a.status] ?? a.status}${a.score !== null && a.maxScore ? ` ${a.score}/${a.maxScore}` : ''}`, when(a.completedAt)]);
    }
    for (const q of s.quizAttempts) {
      rows.push([s.displayName, 'Quiz', q.quizTitle, `${q.totalQuestions} questions`, `${q.score}/${q.totalQuestions} (${q.percentageScore}%)`, when(q.completedAt)]);
      for (const ans of q.answers) rows.push([s.displayName, 'Quiz answer', q.quizTitle, ans.question, `${ans.isCorrect ? 'Correct' : 'Wrong'}: answered "${ans.selectedAnswer}"${ans.correctAnswer && !ans.isCorrect ? `, correct "${ans.correctAnswer}"` : ''}`, when(q.completedAt)]);
    }
    for (const e of s.journalEntries) rows.push([s.displayName, 'Journal', e.title ?? '(untitled)', e.content, e.tags.join('; '), when(e.createdAt)]);
    for (const ev of s.reading) rows.push([s.displayName, 'Reading', ev.label, ev.title, '', when(ev.at)]);
  }
  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
}

export function reportToHtml(r: ClassReport): string {
  const head = `<h1>${esc(r.class.name)}</h1><p class="meta">Grade ${esc(r.class.gradeLevel)}${r.class.schoolYear ? ` · ${esc(r.class.schoolYear)}` : ''} · ${esc(r.class.teacherName)} · report generated ${esc(when(r.generatedAt))}</p>
<p class="totals">${r.totals.students} students (${r.totals.linkedToDevice} joined with a device) · ${r.totals.assignmentsCompleted} assignments completed · ${r.totals.quizAttempts} quiz attempts · ${r.totals.journalEntries} journal entries · ${r.totals.readingEvents} things read or explored</p>`;
  const blocks = r.students.map((s) => {
    const assignments = s.assignments.length
      ? `<table><tr><th>Assignment</th><th>Status</th><th>Score</th><th>Completed</th></tr>${s.assignments.map((a) => `<tr><td>${esc(a.title)}${a.resourceTitle ? `<br><span class="sub">${esc(a.resourceTitle)}</span>` : ''}</td><td>${esc(STATUS[a.status] ?? a.status)}</td><td>${a.score !== null && a.maxScore ? `${a.score}/${a.maxScore}` : ''}</td><td>${esc(when(a.completedAt))}</td></tr>`).join('')}</table>`
      : '<p class="none">No assignments.</p>';
    const quizzes = s.quizAttempts.length
      ? s.quizAttempts.map((q) => `<p class="quiz"><strong>${esc(q.quizTitle)}</strong> · ${q.score}/${q.totalQuestions} (${q.percentageScore}%) · ${esc(when(q.completedAt))}</p><table class="answers"><tr><th>Question</th><th>Answered</th><th>Correct answer</th></tr>${q.answers.map((a) => `<tr class="${a.isCorrect ? 'ok' : 'no'}"><td>${esc(a.question)}</td><td>${esc(a.selectedAnswer)}</td><td>${a.isCorrect ? '✓' : esc(a.correctAnswer)}</td></tr>`).join('')}</table>`).join('')
      : '<p class="none">No quiz attempts.</p>';
    const journal = s.journalEntries.length
      ? s.journalEntries.map((e) => `<div class="entry"><p class="entryHead"><strong>${esc(e.title ?? '(untitled)')}</strong> · ${esc(when(e.createdAt))}${e.tags.length ? ` · ${esc(e.tags.join(', '))}` : ''}</p><p class="entryBody">${esc(e.content)}</p></div>`).join('')
      : '<p class="none">No journal entries.</p>';
    const reading = s.reading.length
      ? `<table><tr><th>What</th><th>Record</th><th>When</th></tr>${s.reading.map((ev) => `<tr><td>${esc(ev.label)}</td><td>${esc(ev.title)}</td><td>${esc(when(ev.at))}</td></tr>`).join('')}</table>`
      : '<p class="none">Nothing recorded.</p>';
    return `<section class="student"><h2>${esc(s.displayName)}</h2><p class="meta">Joined ${esc(dateOnly(s.joinedAt))}${s.linkedToDevice ? '' : ' · added by name; no device work is recorded for this student'}</p>
<h3>Assignments</h3>${assignments}<h3>Quizzes</h3>${quizzes}<h3>Journal</h3>${journal}<h3>Read and explored</h3>${reading}</section>`;
  }).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(r.class.name)} report</title><style>
body{font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11pt;color:#1F2937;margin:24px}h1{font-size:20pt;margin:0 0 4px;color:#1A3A24}h2{font-size:15pt;margin:0 0 2px;color:#1A3A24}h3{font-size:11pt;margin:12px 0 4px;color:#2D5A3D;text-transform:uppercase;letter-spacing:.5px}
.meta,.totals{color:#6B7280;font-size:9.5pt;margin:0 0 6px}.student{page-break-inside:avoid;border-top:1px solid #E5E7EB;padding-top:12px;margin-top:16px}
table{width:100%;border-collapse:collapse;font-size:9.5pt}th,td{border:1px solid #E5E7EB;padding:4px 6px;text-align:left;vertical-align:top}th{background:#F3F4F6}.sub{color:#6B7280}.none{color:#9CA3AF;font-style:italic;font-size:9.5pt;margin:2px 0}
.quiz{margin:6px 0 2px}.answers tr.no td{background:#FEF2F2}.answers tr.ok td{background:#F0FDF4}.entry{margin:4px 0 8px}.entryHead{margin:0}.entryBody{margin:2px 0 0;white-space:pre-wrap}
</style></head><body>${head}${blocks}</body></html>`;
}

async function share(uri: string, mimeType: string, dialogTitle: string) {
  if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing is not available on this device');
  await Sharing.shareAsync(uri, { mimeType, dialogTitle, UTI: mimeType === 'application/pdf' ? 'com.adobe.pdf' : 'public.comma-separated-values-text' });
}

export async function shareReportCsv(r: ClassReport): Promise<void> {
  const dir = FileSystem.cacheDirectory;
  if (!dir) throw new Error('No cache directory available');
  const uri = `${dir}class-report-${safeName(r.class.name)}.csv`;
  await FileSystem.writeAsStringAsync(uri, '﻿' + reportToCsv(r), { encoding: FileSystem.EncodingType.UTF8 });
  await share(uri, 'text/csv', `${r.class.name} report (CSV)`);
}

export async function shareReportPdf(r: ClassReport): Promise<void> {
  const { uri } = await Print.printToFileAsync({ html: reportToHtml(r), base64: false });
  await share(uri, 'application/pdf', `${r.class.name} report (PDF)`);
}
