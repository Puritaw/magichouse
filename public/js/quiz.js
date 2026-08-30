(function () {
  const id = localStorage.getItem('magicHomeId');
  if (!id) {
    window.location.href = '/register.html';
    return;
  }

  const questionCard = document.getElementById('questionCard');
  const progressTrack = document.getElementById('progressTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const quizError = document.getElementById('quizError');

  let questions = [];
  let openQuestions = [];
  let steps = []; // รวม mc + open เป็นลำดับเดียว
  let current = 0;
  const answers = {};
  const openAnswers = {};

  function showError(msg) {
    quizError.textContent = msg;
    quizError.classList.add('show');
  }
  function clearError() {
    quizError.classList.remove('show');
  }

  function buildProgress() {
    progressTrack.innerHTML = '';
    steps.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'progress-dot';
      dot.id = 'dot-' + i;
      progressTrack.appendChild(dot);
    });
    updateProgress();
  }

  function updateProgress() {
    steps.forEach((_, i) => {
      const dot = document.getElementById('dot-' + i);
      dot.classList.remove('active', 'done');
      if (i === current) dot.classList.add('active');
      else if (i < current) dot.classList.add('done');
    });
  }

  function renderStep() {
    clearError();
    const step = steps[current];
    questionCard.innerHTML = '';

    const title = document.createElement('p');
    title.className = 'question-text';
    title.textContent = step.text;
    questionCard.appendChild(title);

    if (step.type === 'mc') {
      const list = document.createElement('div');
      list.className = 'option-list';
      step.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = opt.label;
        if (answers[step.id] === opt.value) btn.classList.add('selected');
        btn.addEventListener('click', () => {
          answers[step.id] = opt.value;
          Array.from(list.children).forEach(c => c.classList.remove('selected'));
          btn.classList.add('selected');
        });
        list.appendChild(btn);
      });
      questionCard.appendChild(list);
    } else {
      const textarea = document.createElement('textarea');
      textarea.className = 'open-textarea';
      textarea.placeholder = 'พิมพ์ข้อความ...';
      textarea.value = openAnswers[step.id] || '';
      textarea.addEventListener('input', () => {
        openAnswers[step.id] = textarea.value;
      });
      questionCard.appendChild(textarea);
    }

    prevBtn.style.display = current === 0 ? 'none' : '';
    nextBtn.textContent = current === steps.length - 1 ? 'ดูผลลัพธ์' : 'ถัดไป';
    updateProgress();
  }

  function goNext() {
    const step = steps[current];
    if (step.type === 'mc' && !answers[step.id]) {
      showError('กรุณาเลือกคำตอบก่อนไปข้อถัดไป');
      return;
    }
    clearError();
    if (current < steps.length - 1) {
      current += 1;
      renderStep();
    } else {
      submitQuiz();
    }
  }

  function goPrev() {
    if (current > 0) {
      current -= 1;
      renderStep();
    }
  }

  async function submitQuiz() {
    nextBtn.disabled = true;
    nextBtn.textContent = 'กำลังส่งคำตอบ...';
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, answers, openAnswers })
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
      window.location.href = '/result.html';
    } catch (err) {
      showError(err.message);
      nextBtn.disabled = false;
      nextBtn.textContent = 'ดูผลลัพธ์';
    }
  }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  fetch('/api/quiz-questions')
    .then(r => r.json())
    .then(data => {
      questions = data.questions.map(q => ({ ...q, type: 'mc' }));
      openQuestions = data.openQuestions.map(q => ({ ...q, type: 'open' }));
      steps = [...questions, ...openQuestions];
      buildProgress();
      renderStep();
    })
    .catch(() => showError('ไม่สามารถโหลดคำถามได้ กรุณารีเฟรชหน้าใหม่'));
})();