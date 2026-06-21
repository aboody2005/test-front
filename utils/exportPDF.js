import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/* ─── Shared helpers ────────────────────────────────────────── */

/**
 * Creates an off-screen container with Arabic-capable fonts.
 * Returns { container, cleanup }.
 */
function createContainer(width, isAr) {
  const container = document.createElement('div');
  if (isAr) {
    container.setAttribute('dir', 'rtl');
    container.setAttribute('lang', 'ar');
  } else {
    container.setAttribute('dir', 'ltr');
    container.setAttribute('lang', 'en');
  }
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: -9999px;
    width: ${width}px;
    background: #ffffff;
    color: #1f2937;
    direction: ${isAr ? 'rtl' : 'ltr'};
    padding: 40px;
  `;

  // Inject stylesheet to force font and reset letter-spacing/text-transform
  const style = document.createElement('style');
  style.textContent = `
    *, div, p, span, table, tr, td, th, h1, h2, h3, h4, h5, h6 {
      font-family: 'Cairo', 'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
      letter-spacing: normal !important;
      letter-spacing: 0px !important;
      text-transform: none !important;
    }
  `;
  container.prepend(style);
  document.body.appendChild(container);

  return {
    container,
    cleanup: () => document.body.removeChild(container),
  };
}

/**
 * Waits for fonts to load then captures the container as a PDF image.
 */
async function captureToPDF(container, orientation, filename) {
  // Wait for fonts to actually load before capturing
  await document.fonts.ready;
  // Extra small delay to let the browser paint with loaded fonts
  await new Promise((r) => setTimeout(r, 500));

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    allowTaint: false,
    foreignObjectRendering: false,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [canvas.width / 2, canvas.height / 2],
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
  pdf.save(filename);
}

/* ─── exportReportPDF ───────────────────────────────────────── */

export async function exportReportPDF(reports, title = 'Student Training Report', locale = 'en') {
  const isAr = locale === 'ar';

  const { container, cleanup } = createContainer(1120, isAr);

  const now = new Date().toLocaleString(isAr ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });

  const headerHtml = `
    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-bottom: 3px solid #00d4ff; padding-bottom: 20px; margin-bottom: 30px; direction: ${isAr ? 'rtl' : 'ltr'};" dir="${isAr ? 'rtl' : 'ltr'}">
      <tr>
        <td style="vertical-align: middle; text-align: ${isAr ? 'right' : 'left'};">
          <div style="margin: 0; font-size: 26px; color: #0d1117; font-weight: 700; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;" dir="${isAr ? 'rtl' : 'ltr'}">
            ${isAr ? 'منصة إدارة التدريب الميداني' : 'Pharmacy Training Management System'}
          </div>
          <div style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;" dir="${isAr ? 'rtl' : 'ltr'}">
            ${isAr ? 'تقرير تدريب الطلاب والمشرفين' : 'Field Supervisor Training Reports'}
          </div>
        </td>
        <td style="vertical-align: middle; text-align: ${isAr ? 'left' : 'right'}; width: 100px;">
          <span style="font-size: 26px; font-weight: 800; color: #00d4ff; letter-spacing: normal !important; text-transform: none !important;">PTMS</span>
        </td>
      </tr>
    </table>
  `;

  const statsHtml = `
    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 30px; direction: ${isAr ? 'rtl' : 'ltr'};" dir="${isAr ? 'rtl' : 'ltr'}">
      <tr>
        <td style="vertical-align: top; text-align: ${isAr ? 'right' : 'left'};">
          <div style="margin: 0 0 8px 0; font-size: 20px; color: #111827; font-weight: 600; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;" dir="${isAr ? 'rtl' : 'ltr'}">${title}</div>
          <div style="font-size: 13px; color: #4b5563; direction: ${isAr ? 'rtl' : 'ltr'};" dir="${isAr ? 'rtl' : 'ltr'}">
            <span><strong>${isAr ? 'تاريخ التصدير' : 'Export Date'}:</strong> ${now}</span>
          </div>
        </td>
        <td style="vertical-align: top; text-align: ${isAr ? 'left' : 'right'};">
          <table border="0" cellpadding="0" cellspacing="0" style="display: inline-table; border-collapse: separate; border-spacing: 15px 0; direction: ${isAr ? 'rtl' : 'ltr'};" dir="${isAr ? 'rtl' : 'ltr'}">
            <tr>
              <td style="background: #f3f4f6; padding: 10px 18px; border-radius: 8px; text-align: center; vertical-align: middle;">
                <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; direction: ${isAr ? 'rtl' : 'ltr'};" dir="${isAr ? 'rtl' : 'ltr'}">${isAr ? 'إجمالي الطلاب' : 'Total Students'}</div>
                <div style="font-size: 20px; font-weight: 700; color: #111827;">${reports.length}</div>
              </td>
              <td style="background: #f3f4f6; padding: 10px 18px; border-radius: 8px; text-align: center; vertical-align: middle;">
                <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; direction: ${isAr ? 'rtl' : 'ltr'};" dir="${isAr ? 'rtl' : 'ltr'}">${isAr ? 'إجمالي الزيارات' : 'Total Visits'}</div>
                <div style="font-size: 20px; font-weight: 700; color: #111827;">
                  ${reports.reduce((acc, curr) => acc + (curr.visitCount || 0), 0)}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const rowsHtml = reports.map((r, i) => `
    <tr style="border-bottom: 1px solid #e5e7eb; ${i % 2 === 1 ? 'background-color: #f9fafb;' : ''}">
      <td style="padding: 14px 10px; font-size: 13px; text-align: center; color: #6b7280; font-weight: 500;">${i + 1}</td>
      <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; font-weight: 600; color: #111827; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'};">
        <div dir="${isAr ? 'rtl' : 'ltr'}">${r.student.name || '-'}</div>
        ${r.student.email ? `<div dir="ltr" style="font-size: 11px; color: #6b7280; font-weight: 400; margin-top: 2px; text-align: ${isAr ? 'right' : 'left'};">${r.student.email}</div>` : ''}
      </td>
      <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; color: #374151; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'};">${r.student.university || '-'}</td>
      <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; color: #374151; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'};">${r.student.pharmacyName || '-'}</td>
      <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; color: #4b5563; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'};">
        ${r.student.location ? `${r.student.location}, ${r.student.city}` : '-'}
      </td>
      <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; color: #374151; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'};">
        ${r.student.teacher || (isAr ? 'غير معين' : 'Unassigned')}
      </td>
      <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 12px; text-align: center; direction: ${isAr ? 'rtl' : 'ltr'};">
        <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-size: 11px;
          ${r.student.status === 'completed'
            ? 'background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe;'
            : 'background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;'}">
          ${r.student.status === 'completed' ? (isAr ? 'مكتمل' : 'Completed') : (isAr ? 'نشط' : 'Active')}
        </span>
      </td>
      <td style="padding: 14px 10px; font-size: 13px; text-align: center; font-weight: 700; color: #111827;">${r.visitCount}</td>
      <td style="padding: 14px 10px; font-size: 13px; text-align: center; color: #4b5563;">
        ${r.lastVisit ? new Date(r.lastVisit).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : (isAr ? 'لا يوجد' : 'None')}
      </td>
    </tr>
  `).join('');

  const tableHtml = `
    <table dir="${isAr ? 'rtl' : 'ltr'}" style="width: 100%; border-collapse: collapse; text-align: ${isAr ? 'right' : 'left'};
                  direction: ${isAr ? 'rtl' : 'ltr'};
                  border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-top: 10px;">
      <thead>
        <tr style="background: #0d1117; color: #00d4ff; border-bottom: 2px solid #e5e7eb;">
          <td style="padding: 14px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: center; width: 45px; letter-spacing: normal !important; text-transform: none !important;">#</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'الطالب' : 'Student'}</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'الجامعة' : 'University'}</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'الصيدلية' : 'Pharmacy'}</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'العنوان' : 'Location'}</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'المشرف' : 'Supervisor'}</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: center; width: 90px; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'الحالة' : 'Status'}</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: center; width: 70px; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'الزيارات' : 'Visits'}</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 14px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: center; width: 110px; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'آخر زيارة' : 'Last Visit'}</td>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;

  container.innerHTML += headerHtml + statsHtml + tableHtml;

  try {
    await captureToPDF(container, 'landscape', `${title.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('Failed to export report PDF:', error);
    throw error;
  } finally {
    cleanup();
  }
}

/* ─── exportVisitsPDF ───────────────────────────────────────── */

export async function exportVisitsPDF(visits, studentName, locale = 'en') {
  const isAr = locale === 'ar';

  const { container, cleanup } = createContainer(800, isAr);

  const now = new Date().toLocaleString(isAr ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });

  const headerHtml = `
    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-bottom: 3px solid #00d4ff; padding-bottom: 20px; margin-bottom: 30px; direction: ${isAr ? 'rtl' : 'ltr'};" dir="${isAr ? 'rtl' : 'ltr'}">
      <tr>
        <td style="vertical-align: middle; text-align: ${isAr ? 'right' : 'left'};">
          <div style="margin: 0; font-size: 24px; color: #0d1117; font-weight: 700; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;" dir="${isAr ? 'rtl' : 'ltr'}">
            ${isAr ? 'سجل زيارات المشرف' : 'Field Visits Log'}
          </div>
          <div style="margin: 5px 0 0 0; font-size: 13px; color: #6b7280; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;" dir="${isAr ? 'rtl' : 'ltr'}">
            ${isAr ? `تاريخ الزيارات للطالب: ${studentName}` : `Visit history records for: ${studentName}`}
          </div>
        </td>
        <td style="vertical-align: middle; text-align: ${isAr ? 'left' : 'right'}; width: 100px;">
          <span style="font-size: 22px; font-weight: 800; color: #00d4ff; letter-spacing: normal !important; text-transform: none !important;">PTMS</span>
        </td>
      </tr>
    </table>
  `;

  const statsHtml = `
    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 25px; direction: ${isAr ? 'rtl' : 'ltr'}; font-size: 13px; color: #4b5563;" dir="${isAr ? 'rtl' : 'ltr'}">
      <tr>
        <td style="vertical-align: middle; text-align: ${isAr ? 'right' : 'left'};">
          <strong>${isAr ? 'تاريخ التصدير' : 'Export Date'}:</strong> ${now}
        </td>
        <td style="vertical-align: middle; text-align: ${isAr ? 'left' : 'right'};">
          <span style="background: #f3f4f6; padding: 6px 14px; border-radius: 6px; font-weight: bold; color: #111827;">
            ${isAr ? `الزيارات: ${visits.length}` : `Visits: ${visits.length}`}
          </span>
        </td>
      </tr>
    </table>
  `;

  const rowsHtml = visits.map((v, i) => `
    <tr style="border-bottom: 1px solid #e5e7eb; ${i % 2 === 1 ? 'background-color: #f9fafb;' : ''}">
      <td style="padding: 12px 10px; font-size: 13px; text-align: center; color: #6b7280;">${i + 1}</td>
      <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 12px 10px; font-size: 13px; font-weight: 600; color: #111827; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'};">${v.teacherName || '-'}</td>
      <td style="padding: 12px 10px; font-size: 13px; text-align: center; color: #374151;">
        ${new Date(v.visitedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
      </td>
      <td style="padding: 12px 10px; font-size: 13px; text-align: center; color: #374151;">
        ${new Date(v.visitedAt).toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
      </td>
      <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 12px 10px; font-size: 13px; color: #4b5563; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'};">${v.notes || '-'}</td>
      <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 12px 10px; font-size: 12px; text-align: center; direction: ${isAr ? 'rtl' : 'ltr'};">
        <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; font-weight: 600;
                     background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; font-size: 11px;">
          ${isAr ? 'تمت الزيارة' : (v.status || 'Visited')}
        </span>
      </td>
    </tr>
  `).join('');

  const tableHtml = `
    <table dir="${isAr ? 'rtl' : 'ltr'}" style="width: 100%; border-collapse: collapse; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'}; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <thead>
        <tr style="background: #0d1117; color: #00d4ff; border-bottom: 2px solid #e5e7eb;">
          <td style="padding: 12px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: center; width: 45px; letter-spacing: normal !important; text-transform: none !important;">#</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 12px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'المشرف' : 'Supervisor'}</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 12px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: center; width: 110px; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'التاريخ' : 'Date'}</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 12px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: center; width: 90px; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'الوقت' : 'Time'}</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 12px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: ${isAr ? 'right' : 'left'}; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'ملاحظات' : 'Notes'}</td>
          <td dir="${isAr ? 'rtl' : 'ltr'}" style="padding: 12px 10px; font-size: 13px; font-weight: 700; color: #00d4ff; text-align: center; width: 100px; direction: ${isAr ? 'rtl' : 'ltr'}; letter-spacing: normal !important; text-transform: none !important;">${isAr ? 'الحالة' : 'Status'}</td>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;

  container.innerHTML += headerHtml + statsHtml + tableHtml;

  try {
    await captureToPDF(container, 'portrait', `visits_${studentName.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('Failed to export visits PDF:', error);
    throw error;
  } finally {
    cleanup();
  }
}

