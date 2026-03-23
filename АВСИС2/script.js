const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    burger.classList.toggle('is-active');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('is-open'));
  });
}

const sliderTrack = document.getElementById('sliderTrack');
const slides = Array.from(document.querySelectorAll('.slide'));
const prevSlide = document.getElementById('prevSlide');
const nextSlide = document.getElementById('nextSlide');
const sliderDots = document.getElementById('sliderDots');
let currentSlide = 0;
let sliderTimer = null;

function renderDots() {
  if (!sliderDots) return;
  sliderDots.innerHTML = '';

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `dot ${index === currentSlide ? 'is-active' : ''}`;
    dot.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    sliderDots.appendChild(dot);
  });
}

function goToSlide(index) {
  if (!slides.length) return;

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === currentSlide);
    slide.style.display = i === currentSlide ? 'block' : 'none';
  });

  renderDots();
}

function startSliderAutoPlay() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 4500);
}

function stopSliderAutoPlay() {
  clearInterval(sliderTimer);
}

prevSlide?.addEventListener('click', () => goToSlide(currentSlide - 1));
nextSlide?.addEventListener('click', () => goToSlide(currentSlide + 1));

[prevSlide, nextSlide, sliderTrack].forEach(item => {
  item?.addEventListener('mouseenter', stopSliderAutoPlay);
  item?.addEventListener('mouseleave', startSliderAutoPlay);
});

goToSlide(0);
startSliderAutoPlay();

const stageTabs = Array.from(document.querySelectorAll('.stage-tab'));
const stageImage = document.getElementById('stageImage');
const stagesVisual = document.getElementById('stagesVisual');

const stageData = [
  {
    image: 'img/Stages (5).png',
    text: 'Уточняем ваши пожелания, делаем планировку и готовим полный проект с подбором материалов.'
  },
  {
    image: 'img/Stages (1).png',
    text: 'Готовим основание дома, выполняем земляные работы, армирование и заливку надёжного фундамента.'
  },
  {
    image: 'img/Stages (2).png',
    text: 'Собираем несущую конструкцию дома, возводим стены, перекрытия и кровлю.'
  },
  {
    image: 'img/Stages (3).png',
    text: 'Прокладываем электрику, отопление, водоснабжение и остальные инженерные системы.'
  },
  {
    image: 'img/Stages (4).png',
    text: 'Переходим к чистовым работам, оформляем интерьер и подготавливаем объект к сдаче.'
  }
];

let currentStageIndex = 0;

function fillStageTexts() {
  stageTabs.forEach((tab, index) => {
    const textNode = tab.querySelector('.stage-tab__text');
    if (textNode && stageData[index]) {
      textNode.textContent = stageData[index].text;
    }
  });
}

function setStage(index, animate = true) {
  const normalizedIndex = (index + stageData.length) % stageData.length;
  const stage = stageData[normalizedIndex];
  const activeTab = stageTabs[normalizedIndex];

  currentStageIndex = normalizedIndex;
  stageTabs.forEach(item => item.classList.remove('is-active'));
  activeTab?.classList.add('is-active');

  if (!stageImage || !stage) {
    return;
  }

  if (!animate) {
    stageImage.src = stage.image;
    return;
  }

  stageImage.classList.add('is-changing');

  window.setTimeout(() => {
    stageImage.src = stage.image;
    stageImage.classList.remove('is-changing');
  }, 220);
}

stageTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const index = Number(tab.dataset.stage);
    setStage(index);
  });
});

fillStageTexts();
setStage(0, false);


const careerImage = document.getElementById('careerImage');
const careerLead = document.getElementById('careerLead');
const careerText = document.getElementById('careerText');
const careerDots = Array.from(document.querySelectorAll('[data-career]'));

const careerData = [
  {
    image: 'img/Career (1).png',
    lead: 'Большой дом создаёт среду, которая поощряет совместный подход в сочетании с профессиональным ростом.',
    text: 'У нас ценятся инициативность, ответственность, внимание к деталям и желание развивать строительную культуру. Мы ищем специалистов, которым важно делать качественный продукт вместе с сильной командой.'
  },
  {
    image: 'img/Career (2).png',
    lead: 'Мы поддерживаем развитие сотрудников через сильное окружение, понятные процессы и совместную работу над проектами.',
    text: 'Для нас важны открытость, надёжность и вовлечённость в общее дело. В команде Большого дома ценят людей, которые умеют брать ответственность и двигать проект вперёд вместе с коллегами.'
  },
  {
    image: 'img/Career (3).png',
    lead: 'В компании можно расти профессионально, участвовать в реальных проектах и видеть результат своей работы.',
    text: 'Мы собираем команду специалистов, которым близки качество, аккуратность и уважение к клиенту. Нам важны люди, готовые развиваться вместе с компанией и усиливать общий результат.'
  }
];

function setCareer(index) {
  if (!careerImage || !careerLead || !careerText || !careerDots.length) {
    return;
  }

  const safeIndex = Math.max(0, Math.min(index, careerData.length - 1));
  const item = careerData[safeIndex];

  careerImage.src = item.image;
  careerLead.textContent = item.lead;
  careerText.textContent = item.text;

  careerDots.forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === safeIndex);
  });
}

careerDots.forEach(dot => {
  dot.addEventListener('click', () => {
    setCareer(Number(dot.dataset.career));
  });
});

setCareer(0);

// НОВАЯ ЧАСТЬ КОДА !!!!!! - отправка данных в API (p.s. Лиза)

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm?.addEventListener('submit', async event => {
  event.preventDefault();

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const data = new FormData(contactForm);
  const values = Object.fromEntries(data.entries());

  if (formStatus) {
    formStatus.textContent = 'Отправка...';
  }

  if (submitButton) {
    submitButton.disabled = true;
  }

  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    });

    const result = await response.json();

    if (result.ok) {
      if (formStatus) {
        formStatus.textContent = 'Заявка успешно отправлена.';
      }
      contactForm.reset();
    } else {
      if (formStatus) {
        formStatus.textContent = result.message || 'Не удалось отправить заявку.';
      }
    }
  } catch (error) {
    if (formStatus) {
      formStatus.textContent = 'Ошибка соединения с сервером.';
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
});

const openEstimateModal = document.getElementById('openEstimateModal');
const estimateModal = document.getElementById('estimateModal');
const closeEstimateModal = document.getElementById('closeEstimateModal');
const estimateModalBackdrop = document.getElementById('estimateModalBackdrop');
const estimateHouseType = document.getElementById('estimateHouseType');
const estimateArea = document.getElementById('estimateArea');
const estimateCheckboxes = Array.from(document.querySelectorAll('.estimate-checkbox'));
const estimateCalculateBtn = document.getElementById('estimateCalculateBtn');
const estimateResult = document.getElementById('estimateResult');

function formatRub(value) {
  return new Intl.NumberFormat('ru-RU').format(Math.round(value)) + ' ₽';
}

function calculateEstimate() {
  if (!estimateHouseType || !estimateArea || !estimateResult) {
    return;
  }

  const area = Math.max(30, Number(estimateArea.value) || 120);
  const baseRate = Number(estimateHouseType.value) || 16000;
  const addons = estimateCheckboxes.reduce((sum, checkbox) => {
    return sum + (checkbox.checked ? Number(checkbox.dataset.addon || 0) : 0);
  }, 0);

  const total = area * baseRate + addons;
  estimateResult.textContent = '≈ ' + formatRub(total);
}

function openModal() {
  if (!estimateModal) return;
  estimateModal.hidden = false;
  document.body.classList.add('modal-open');
  calculateEstimate();
}

function closeModal() {
  if (!estimateModal) return;
  estimateModal.hidden = true;
  document.body.classList.remove('modal-open');
}

openEstimateModal?.addEventListener('click', openModal);
closeEstimateModal?.addEventListener('click', closeModal);
estimateModalBackdrop?.addEventListener('click', closeModal);
estimateCalculateBtn?.addEventListener('click', calculateEstimate);
estimateHouseType?.addEventListener('change', calculateEstimate);
estimateArea?.addEventListener('input', calculateEstimate);
estimateCheckboxes.forEach(checkbox => checkbox.addEventListener('change', calculateEstimate));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && estimateModal && !estimateModal.hidden) {
    closeModal();
  }
});

