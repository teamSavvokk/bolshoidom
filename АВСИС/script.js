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
  currentSlide = (index + slides.length) % slides.length;
  if (sliderTrack) {
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
  renderDots();
}

prevSlide?.addEventListener('click', () => goToSlide(currentSlide - 1));
nextSlide?.addEventListener('click', () => goToSlide(currentSlide + 1));
renderDots();

let sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 4500);

[prevSlide, nextSlide, sliderTrack].forEach(item => {
  item?.addEventListener('mouseenter', () => clearInterval(sliderTimer));
  item?.addEventListener('mouseleave', () => {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 4500);
  });
});

const stageTabs = Array.from(document.querySelectorAll('.stage-tab'));
const stageImage = document.getElementById('stageImage');
const stageCaption = document.getElementById('stageCaption');

const stageData = [
  {
    image: 'img/Stages (5).png',
    text: 'Разработка плана дома, технической документации и всех ключевых проектных решений.'
  },
  {
    image: 'img/Stages (1).png',
    text: 'Подготовка участка и устройство надёжного основания под будущее здание.'
  },
  {
    image: 'img/Stages (2).png',
    text: 'Возведение коробки дома, стен, перекрытий и кровельной конструкции.'
  },
  {
    image: 'img/Stages (3).png',
    text: 'Монтаж инженерных систем: отопление, вода, электрика и все технические узлы.'
  },
  {
    image: 'img/Stages (4).png',
    text: 'Финальные интерьерные решения, отделочные работы и подготовка объекта к сдаче.'
  }
];

stageTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const index = Number(tab.dataset.stage);
    const stage = stageData[index];

    stageTabs.forEach(item => item.classList.remove('is-active'));
    tab.classList.add('is-active');

    if (stageImage && stageCaption && stage) {
      stageImage.src = stage.image;
      stageCaption.textContent = stage.text;
    }
  });
});

const careerImage = document.getElementById('careerImage');
const careerDots = Array.from(document.querySelectorAll('[data-career]'));
const careerImages = ['img/Career (1).png', 'img/Career (2).png', 'img/Career (3).png'];

careerDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = Number(dot.dataset.career);
    if (careerImage) {
      careerImage.src = careerImages[index];
    }
    careerDots.forEach(item => item.classList.remove('is-active'));
    dot.classList.add('is-active');
  });
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const values = Object.fromEntries(data.entries());

  localStorage.setItem('big-house-contact-form', JSON.stringify(values));
  if (formStatus) {
    formStatus.textContent = 'Заявка отправлена. Данные сохранены локально в браузере.';
  }
  contactForm.reset();
});
