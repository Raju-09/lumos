/**
 * Resume Download Utility
 * Generates downloadable resume PDFs for students
 */

interface Student {
    name: string;
    rollNo: string;
    email: string;
    phone?: string;
    branch: string;
    cgpa: number;
    skills?: string[];
    resume?: string;
}

/**
 * Generate and download a student resume as HTML (styled like PDF)
 */
export function downloadStudentResume(student: Student) {
    // Create HTML resume content
    const resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${student.name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            background: white;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 {
            font-size: 32px;
            margin-bottom: 10px;
            color: #1e40af;
        }
        .contact {
            font-size: 14px;
            color: #666;
        }
        .contact span {
            margin: 0 10px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
            border-bottom: 2px solid #93c5fd;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
            color: #4b5563;
        }
        .info-value {
            color: #1f2937;
        }
        .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill-tag {
            background: #dbeafe;
            color: #1e40af;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>${student.name}</h1>
            <div class="contact">
                <span>📧 ${student.email}</span>
                ${student.phone ? `<span>📱 ${student.phone}</span>` : ''}
                <span>🎓 Roll No: ${student.rollNo}</span>
            </div>
        </div>

        <!-- Academic Information -->
        <div class="section">
            <div class="section-title">📚 Academic Information</div>
            <div class="info-row">
                <div class="info-label">Branch:</div>
                <div class="info-value">${student.branch}</div>
            </div>
            <div class="info-row">
                <div class="info-label">CGPA:</div>
                <div class="info-value">${student.cgpa}/10.0</div>
            </div>
        </div>

        <!-- Skills -->
        ${student.skills && student.skills.length > 0 ? `
        <div class="section">
            <div class="section-title">💡 Technical Skills</div>
            <div class="skills-grid">
                ${student.skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
            Generated via Lumos Campus Placement System • ${new Date().toLocaleDateString()}
        </div>
    </div>
</body>
</html>
    `;

    // Create blob and download
    const blob = new Blob([resumeHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume_${student.name.replace(/\s+/g, '_')}_${student.rollNo}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * Export all resumes as a ZIP file (requires JSZip library)
 * For now, we'll export as individual HTML files
 */
export function exportAllResumes(students: Student[]) {
    students.forEach(student => {
        // Add small delay to avoid browser blocking multiple downloads
        setTimeout(() => downloadStudentResume(student), 100);
    });
}
