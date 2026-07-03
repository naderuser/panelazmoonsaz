// ============================================
// Cloudflare Worker - پنل ساخت آزمون معلم
// نسخه نهایی با تاریخ شمسی 1405
// ============================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/' || path === '') {
      return new Response(getHTML(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (path === '/style.css') {
      return new Response(getCSS(), {
        headers: { 'Content-Type': 'text/css; charset=utf-8' }
      });
    }

    if (path === '/script.js') {
      return new Response(getJS(), {
        headers: { 'Content-Type': 'application/javascript; charset=utf-8' }
      });
    }

    return new Response('صفحه مورد نظر یافت نشد', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
};

// ============================================
// HTML
// ============================================
function getHTML() {
  return `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>پنل ساخت آزمون معلم</title>
    <link rel="stylesheet" href="/style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body>
    <div id="app">
        <!-- Header -->
        <header class="header">
            <h1>📝 پنل ساخت آزمون معلم</h1>
            <div class="header-actions">
                <button onclick="exportPDF()" class="btn btn-primary">📄 PDF</button>
                <button onclick="exportWord()" class="btn btn-success">📤 Word</button>
                <button onclick="resetAll()" class="btn btn-danger">🔄 جدید</button>
            </div>
        </header>

        <div class="container">
            <!-- سایدبار -->
            <aside class="sidebar">
                <h3>📋 تنظیمات آزمون</h3>
                
                <div class="form-group">
                    <label>مقطع تحصیلی</label>
                    <select id="educationLevel" onchange="renderPreview()">
                        <option value="elementary">ابتدایی</option>
                        <option value="secondary">متوسطه</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>اداره آموزش و پرورش</label>
                    <input type="text" id="eduOffice" placeholder="......">
                </div>

                <div class="form-group">
                    <label>پایه تحصیلی</label>
                    <input type="text" id="grade" placeholder="مثلاً: چهارم">
                </div>

                <div class="form-group">
                    <label>نام درس</label>
                    <input type="text" id="subject" placeholder="مثلاً: فارسی">
                </div>

                <div class="form-group">
                    <label>نام و نام خانوادگی</label>
                    <input type="text" id="studentName" placeholder="نام و نام خانوادگی">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>نام پدر</label>
                        <input type="text" id="fatherName" placeholder="نام پدر">
                    </div>
                    <div class="form-group">
                        <label>نام مدرسه</label>
                        <input type="text" id="schoolName" placeholder="نام مدرسه">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>نام آموزگار</label>
                        <input type="text" id="teacherName" placeholder="نام آموزگار">
                    </div>
                    <div class="form-group">
                        <label>تاریخ آزمون (شمسی)</label>
                        <div style="display:flex;gap:0.3rem;">
                            <input type="text" id="examDate" placeholder="مثلاً: 1405/01/01" style="flex:1;">
                            <button onclick="setTodayDate()" class="btn btn-primary" style="padding:0.3rem 0.6rem;font-size:0.7rem;">امروز</button>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>مدت زمان (دقیقه)</label>
                    <input type="number" id="duration" value="60">
                </div>

                <div class="form-group" id="feedbackGroup">
                    <label>📝 بازخورد کلی (مخصوص ابتدایی)</label>
                    <textarea id="generalFeedback" rows="2" placeholder="متن بازخورد کلی برای دانش‌آموزان..." oninput="renderPreview()"></textarea>
                </div>

                <hr>

                <h3>✏️ افزودن سوال</h3>
                <div class="form-group">
                    <label>نوع سوال</label>
                    <select id="questionType">
                        <option value="descriptive">تشریحی</option>
                        <option value="multiple">چهارگزینه‌ای</option>
                        <option value="short">کوتاه‌پاسخ</option>
                        <option value="truefalse">صحیح و غلط</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>متن سوال</label>
                    <textarea id="questionText" rows="2" placeholder="متن سوال..."></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>بارم (نمره)</label>
                        <input type="number" id="questionScore" value="1" step="0.5">
                    </div>
                    <div class="form-group">
                        <label>بازخورد (اختیاری)</label>
                        <input type="text" id="questionFeedback" placeholder="بازخورد...">
                    </div>
                </div>

                <button onclick="addQuestion()" class="btn btn-primary" style="width:100%;">➕ افزودن سوال</button>

                <hr>

                <h3>🧮 ابزارها</h3>
                <div class="math-symbols">
                    <button onclick="insertMath('+')">+</button>
                    <button onclick="insertMath('-')">-</button>
                    <button onclick="insertMath('×')">×</button>
                    <button onclick="insertMath('÷')">÷</button>
                    <button onclick="insertMath('=')">=</button>
                    <button onclick="insertMath('√')">√</button>
                    <button onclick="insertMath('%')">%</button>
                    <button onclick="insertMath('π')">π</button>
                </div>
            </aside>

            <!-- وسط - لیست سوالات -->
            <main class="main-content">
                <div class="questions-list">
                    <h3>📋 لیست سوالات (<span id="questionCount">0</span>)</h3>
                    <div id="questionsContainer"></div>
                </div>
            </main>

            <!-- پیش‌نمایش -->
            <aside class="preview-sidebar">
                <h3>👁️ پیش‌نمایش آزمون</h3>
                <div id="previewContainer">
                    <div id="examPreview" class="exam-paper"></div>
                </div>
            </aside>
        </div>
    </div>

    <script src="/script.js"></script>
</body>
</html>`;
}

// ============================================
// CSS
// ============================================
function getCSS() {
  return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'B Nazanin', 'Tahoma', sans-serif;
    background: #f0f4f8;
    color: #2d3748;
    direction: rtl;
}

.header {
    background: #1e3a5f;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header h1 {
    font-size: 1.3rem;
}

.header-actions {
    display: flex;
    gap: 0.5rem;
}

.btn {
    padding: 0.4rem 1rem;
    border: none;
    border-radius: 0.4rem;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s;
    font-family: inherit;
}

.btn-primary {
    background: #2d6a9f;
    color: white;
}
.btn-primary:hover { background: #1e4a7a; }

.btn-success {
    background: #16a34a;
    color: white;
}
.btn-success:hover { background: #15803d; }

.btn-danger {
    background: #dc2626;
    color: white;
}
.btn-danger:hover { background: #b91c1c; }

.btn-warning {
    background: #f59e0b;
    color: white;
}
.btn-warning:hover { background: #d97706; }

.btn-sm {
    padding: 0.15rem 0.5rem;
    font-size: 0.7rem;
}

.container {
    display: grid;
    grid-template-columns: 300px 1fr 400px;
    gap: 1rem;
    padding: 1rem;
    height: calc(100vh - 70px);
    overflow: hidden;
}

.sidebar, .preview-sidebar {
    background: white;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow-y: auto;
}

.main-content {
    overflow-y: auto;
}

.form-group {
    margin-bottom: 0.5rem;
}

.form-group label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.2rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.35rem 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.3rem;
    font-size: 0.85rem;
    font-family: inherit;
    background: #f7fafc;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #2d6a9f;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
}

hr {
    margin: 0.75rem 0;
    border: none;
    border-top: 1px solid #e2e8f0;
}

.math-symbols {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
}

.math-symbols button {
    width: 35px;
    height: 35px;
    border: 1px solid #e2e8f0;
    border-radius: 0.3rem;
    background: white;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
}

.math-symbols button:hover {
    background: #2d6a9f;
    color: white;
}

.questions-list {
    background: white;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.questions-list h3 {
    margin-bottom: 0.5rem;
}

#questionsContainer {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.question-item {
    background: #f7fafc;
    padding: 0.5rem 0.7rem;
    border-radius: 0.4rem;
    border-right: 3px solid #2d6a9f;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.question-info {
    flex: 1;
}

.question-info .q-header {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
}

.question-actions {
    display: flex;
    gap: 0.2rem;
}

.preview-sidebar {
    background: #f7fafc;
}

#previewContainer {
    background: white;
    border-radius: 0.3rem;
    padding: 0.75rem;
    min-height: 300px;
}

/* ====== استایل پیش‌نمایش ====== */
.exam-paper {
    font-family: 'B Nazanin', 'Tahoma', sans-serif;
    direction: rtl;
    padding: 1rem;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.3rem;
    font-size: 0.85rem;
}

.exam-paper .bismillah {
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
    color: #1e3a5f;
}

.exam-paper table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0;
    font-size: 0.85rem;
}

.exam-paper table th,
.exam-paper table td {
    border: 1px solid #000;
    padding: 0.5rem 0.6rem;
    text-align: center;
    vertical-align: middle;
}

.exam-paper table th {
    background: #e5e7eb;
    font-weight: bold;
}

.exam-paper .question-text {
    text-align: right;
    padding-right: 1rem;
}

.exam-paper .total-row {
    font-weight: bold;
    background: #f3f4f6;
}

.exam-paper .feedback-cell {
    background: #f0fdf4;
    color: #166534;
}

.exam-paper .footer-text {
    text-align: center;
    margin-top: 0.75rem;
    font-size: 0.95rem;
    font-weight: bold;
    color: #1e3a5f;
}

/* ====== رسپانسیو ====== */
@media (max-width: 1200px) {
    .container {
        grid-template-columns: 1fr;
        height: auto;
        overflow: visible;
    }
    .sidebar, .preview-sidebar {
        max-height: 400px;
    }
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }
    .header-actions {
        flex-wrap: wrap;
        justify-content: center;
    }
    .form-row {
        grid-template-columns: 1fr;
    }
    .question-item {
        flex-direction: column;
        gap: 0.3rem;
    }
    .question-actions {
        width: 100%;
        justify-content: flex-end;
    }
    .exam-paper {
        font-size: 0.7rem;
        padding: 0.5rem;
    }
    .exam-paper table {
        font-size: 0.7rem;
    }
    .exam-paper table th,
    .exam-paper table td {
        padding: 0.3rem;
    }
}

::-webkit-scrollbar {
    width: 5px;
}
::-webkit-scrollbar-thumb {
    background: #2d6a9f;
    border-radius: 10px;
}`;
}

// ============================================
// JAVASCRIPT - با تاریخ شمسی 1405
// ============================================
function getJS() {
  return `// ===== STATE =====
let questions = [];
let nextId = 1;

// ===== DOM REFS =====
const previewContainer = document.getElementById('examPreview');
const questionsContainer = document.getElementById('questionsContainer');
const questionCount = document.getElementById('questionCount');

// ===== توابع تبدیل تاریخ شمسی =====
function toPersianDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    
    // تبدیل تقریبی میلادی به شمسی
    const gregorianToJalali = (gy, gm, gd) => {
        const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        let gy2 = (gm > 2) ? (gy + 1) : gy;
        let days = 355666 + (365 * gy2) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
        let jy = -1595 + (33 * ~~(days / 12053));
        days %= 12053;
        let jm = ~~(days / 31);
        days %= 31;
        if (jm > 5) {
            jm = 0;
            jy++;
            days = ~~(days / 30) + 1;
        } else {
            jm++;
        }
        return [jy, jm, days];
    };
    
    const [jYear, jMonth, jDay] = gregorianToJalali(year, month, day);
    return \`\${jYear}/\${String(jMonth).padStart(2, '0')}/\${String(jDay).padStart(2, '0')}\`;
}

function getTodayPersian() {
    const today = new Date();
    return toPersianDate(today);
}

function getDefaultPersianDate() {
    // تاریخ پیش‌فرض: 1405/01/01
    return '1405/01/01';
}

function setTodayDate() {
    document.getElementById('examDate').value = getTodayPersian();
    renderPreview();
}

// ===== FUNCTIONS =====
function addQuestion() {
    const text = document.getElementById('questionText').value.trim();
    if (!text) {
        alert('لطفاً متن سوال را وارد کنید!');
        return;
    }
    
    questions.push({
        id: nextId++,
        text: text,
        score: parseFloat(document.getElementById('questionScore').value) || 1,
        feedback: document.getElementById('questionFeedback').value.trim()
    });
    
    document.getElementById('questionText').value = '';
    document.getElementById('questionFeedback').value = '';
    document.getElementById('questionScore').value = 1;
    renderAll();
}

function removeQuestion(id) {
    if (confirm('آیا از حذف این سوال مطمئن هستید؟')) {
        questions = questions.filter(q => q.id !== id);
        renderAll();
    }
}

function moveQuestion(id, direction) {
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= questions.length) return;
    [questions[index], questions[newIndex]] = [questions[newIndex], questions[index]];
    renderAll();
}

function insertMath(symbol) {
    const textarea = document.getElementById('questionText');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    textarea.value = text.substring(0, start) + symbol + text.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + symbol.length;
}

function renderAll() {
    renderQuestionsList();
    renderPreview();
    updateCount();
}

function renderQuestionsList() {
    if (questions.length === 0) {
        questionsContainer.innerHTML = '<p style="color:#a0aec0;text-align:center;padding:1.5rem;">هنوز سوالی اضافه نشده</p>';
        return;
    }
    
    questionsContainer.innerHTML = questions.map((q, i) => \`
        <div class="question-item">
            <div class="question-info">
                <div class="q-header">
                    <strong>\${i + 1}.</strong>
                    <span>\${q.text}</span>
                    <span style="background:#48bb78;color:white;padding:0.1rem 0.5rem;border-radius:1rem;font-size:0.65rem;">\${q.score}</span>
                    \${q.feedback ? \`<span style="color:#48bb78;font-size:0.7rem;">💬 \${q.feedback}</span>\` : ''}
                </div>
            </div>
            <div class="question-actions">
                <button onclick="moveQuestion(\${q.id}, -1)" class="btn btn-warning btn-sm">↑</button>
                <button onclick="moveQuestion(\${q.id}, 1)" class="btn btn-warning btn-sm">↓</button>
                <button onclick="removeQuestion(\${q.id})" class="btn btn-danger btn-sm">✕</button>
            </div>
        </div>
    \`).join('');
}

function renderPreview() {
    const level = document.getElementById('educationLevel').value;
    const meta = {
        eduOffice: document.getElementById('eduOffice').value || '......',
        grade: document.getElementById('grade').value || '',
        subject: document.getElementById('subject').value || '',
        studentName: document.getElementById('studentName').value || '',
        fatherName: document.getElementById('fatherName').value || '',
        schoolName: document.getElementById('schoolName').value || '',
        teacherName: document.getElementById('teacherName').value || '',
        examDate: document.getElementById('examDate').value || '',
        duration: document.getElementById('duration').value || ''
    };
    
    const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
    
    let html = '<div class="exam-paper" id="examPaper">';
    html += '<div class="bismillah">بسم الله الرحمن الرحيم</div>';
    
    if (level === 'elementary') {
        // ابتدایی
        html += \`
            <table>
                <tr>
                    <td style="width:33%;"><strong>اداره آموزش و پرورش</strong> \${meta.eduOffice}</td>
                    <td style="width:33%;"><strong>آزمون</strong> \${meta.subject}</td>
                    <td style="width:33%;"><strong>پایه</strong> \${meta.grade}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <td><strong>نام و نام خانوادگی:</strong> \${meta.studentName}</td>
                    <td><strong>نام پدر:</strong> \${meta.fatherName}</td>
                    <td><strong>نام مدرسه:</strong> \${meta.schoolName}</td>
                </tr>
                <tr>
                    <td><strong>نام آموزگار:</strong> \${meta.teacherName}</td>
                    <td><strong>تاریخ آزمون:</strong> \${meta.examDate}</td>
                    <td><strong>مدت زمان:</strong> \${meta.duration} دقیقه</td>
                </tr>
            </table>
            
            <table>
                <thead>
                    <tr>
                        <th style="width:8%;">ردیف</th>
                        <th style="width:72%;">سوال</th>
                        <th style="width:20%;">بازخورد</th>
                    </tr>
                </thead>
                <tbody>
        \`;
        questions.forEach((q, i) => {
            html += \`
                <tr>
                    <td style="width:8%;font-weight:bold;">\${i+1}</td>
                    <td style="width:72%;text-align:right;padding-right:1rem;">\${q.text}</td>
                    <td style="width:20%;background:#f0fdf4;color:#166534;">\${q.feedback || ''}</td>
                </tr>
            \`;
        });
        html += \`
                </tbody>
            </table>
            
            <table>
                <tr>
                    <td style="width:20%;padding:0.5rem;background:#f0fdf4;font-weight:bold;">بازخورد کلی</td>
                    <td style="width:80%;padding:0.5rem;background:#f0fdf4;">\${document.getElementById('generalFeedback')?.value || ''}</td>
                </tr>
            </table>
        \`;
    } else {
        // متوسطه
        html += \`
            <table>
                <tr>
                    <td style="width:33%;"><strong>پایه:</strong> \${meta.grade}</td>
                    <td style="width:33%;"><strong>آزمون</strong> \${meta.subject}</td>
                    <td style="width:33%;"><strong>اداره آموزش و پرورش:</strong> \${meta.eduOffice}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <td><strong>نام مدرسه:</strong> \${meta.schoolName}</td>
                    <td><strong>نام پدر:</strong> \${meta.fatherName}</td>
                    <td><strong>نام و نام خانوادگی:</strong> \${meta.studentName}</td>
                </tr>
                <tr>
                    <td><strong>مدت زمان:</strong> \${meta.duration} دقیقه</td>
                    <td><strong>تاریخ آزمون:</strong> \${meta.examDate}</td>
                    <td><strong>نام آموزگار:</strong> \${meta.teacherName}</td>
                </tr>
            </table>
            
            <table>
                <thead>
                    <tr>
                        <th style="width:8%;">ردیف</th>
                        <th style="width:72%;">سوال</th>
                        <th style="width:20%;">بارم</th>
                    </tr>
                </thead>
                <tbody>
        \`;
        questions.forEach((q, i) => {
            html += \`
                <tr>
                    <td style="width:8%;font-weight:bold;">\${i+1}</td>
                    <td style="width:72%;text-align:right;padding-right:1rem;">\${q.text}</td>
                    <td style="width:20%;">\${q.score}</td>
                </tr>
            \`;
        });
        html += \`
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="2" style="font-weight:bold;">جمع کل</td>
                        <td style="font-weight:bold;">\${totalScore}</td>
                    </tr>
                </tfoot>
            </table>
        \`;
    }
    
    html += '<div class="footer-text">موفق و پیروز باشید</div>';
    html += '</div>';
    
    previewContainer.innerHTML = html;
}

function updateCount() {
    document.getElementById('questionCount').textContent = questions.length;
}

// ===== EXPORT =====
async function exportPDF() {
    const element = document.getElementById('examPaper');
    if (!element || questions.length === 0) {
        alert('هیچ سوالی برای خروجی وجود ندارد!');
        return;
    }
    
    const opt = {
        margin: [10, 10, 10, 10],
        filename: 'آزمون.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {
        const btn = document.querySelector('.btn-primary');
        btn.textContent = '⏳ تولید...';
        btn.disabled = true;
        await html2pdf().set(opt).from(element).save();
        btn.textContent = '📄 PDF';
        btn.disabled = false;
    } catch (error) {
        alert('خطا: ' + error.message);
        console.error(error);
    }
}

function exportWord() {
    const element = document.getElementById('examPaper');
    if (!element || questions.length === 0) {
        alert('هیچ سوالی برای خروجی وجود ندارد!');
        return;
    }
    
    const content = element.outerHTML;
    const styles = \`
        <style>
            body { font-family: 'B Nazanin', 'Tahoma', sans-serif; direction: rtl; padding: 40px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            table th, table td { border: 1px solid #000; padding: 8px; text-align: center; }
            .bismillah { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
            .question-text { text-align: right; padding-right: 15px; }
            .feedback-cell { background: #f0fdf4; }
            .total-row { font-weight: bold; background: #f3f4f6; }
            .footer-text { text-align: center; margin-top: 15px; font-weight: bold; }
        </style>
    \`;
    
    const html = '<!DOCTYPE html><html dir="rtl" lang="fa"><head><meta charset="UTF-8"><title>آزمون</title>' + styles + '</head><body>' + content + '</body></html>';
    
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'آزمون.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function resetAll() {
    if (!confirm('همه داده‌ها حذف شوند؟')) return;
    questions = [];
    nextId = 1;
    document.querySelectorAll('input, textarea, select').forEach(el => {
        if (el.type === 'radio' || el.type === 'checkbox') {
            el.checked = false;
        } else {
            el.value = '';
        }
    });
    document.getElementById('duration').value = 60;
    document.getElementById('questionScore').value = 1;
    document.getElementById('examDate').value = getDefaultPersianDate();
    renderAll();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    // تنظیم تاریخ پیش‌فرض به 1405/01/01
    document.getElementById('examDate').value = getDefaultPersianDate();
    
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', renderPreview);
        el.addEventListener('change', renderPreview);
    });
    
    renderAll();
});

// Global
window.addQuestion = addQuestion;
window.removeQuestion = removeQuestion;
window.moveQuestion = moveQuestion;
window.insertMath = insertMath;
window.exportPDF = exportPDF;
window.exportWord = exportWord;
window.resetAll = resetAll;
window.renderPreview = renderPreview;
window.setTodayDate = setTodayDate;`;
}