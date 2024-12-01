'use strict';

/* ELEMENTS */
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

/* Modal window */
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');

  // for prevent scrolling the page when modal is shown
  // document.body.style.overflow = 'hidden';
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  // user can scrolling when modal is hide
  // document.body.style.overflow = 'auto';
};

btnsOpenModal.forEach(btn =>
  btn.addEventListener('click', () => {
    openModal();
  })
);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/* Scrolling Button ( learn more button ) */
btnScrollTo.addEventListener('click', () =>
  section1.scrollIntoView({ behavior: 'smooth' })
);

/* Page Navigation */
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    // for condition we can use this code : e.target.closest('.nav__link') both of them is the same
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/* Tabbed Component */
tabContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clicked) return;

  // 1. diactive all tab buttons
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // 2. active assosiated tab button
  clicked.classList.add('operations__tab--active');

  // 3. diactive all tab content
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));
  // 4. active assosiated tab content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/* Menu fade animation */
// Jonas handle this in another way but i don't like that way because not work good
// so i handle this in my way
nav.addEventListener('mouseover', function (e) {
  if (
    e.target.classList.contains('nav__link') ||
    e.target.classList.contains('nav__logo')
  ) {
    const navItems = [
      ...nav.querySelectorAll('.nav__link'),
      nav.querySelector('.nav__logo'),
    ];
    navItems.forEach(item => (item.style.opacity = 0.5));
    e.target.style.opacity = 1;
  }
});

nav.addEventListener('mouseout', function (e) {
  const navItems = [
    ...nav.querySelectorAll('.nav__link'),
    nav.querySelector('.nav__logo'),
  ];

  navItems.forEach(item => (item.style.opacity = 1));
});

/* Sticky navigation */
// my solution
const headerObserver = new IntersectionObserver(
  // first remove stikcy
  entries => {
    const entry = entries[0];
    const ratio = entry.intersectionRatio * 100;
    const visible = entry.isIntersecting;

    if (!entry.isIntersecting) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`,
  }
);

headerObserver.observe(header);

/* Lazy loading */
const allLazyImages = document.querySelectorAll('img[data-src]');

const lazyImageObserver = new IntersectionObserver(
  (entries, observer) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      // use high resolution image instead of low resolution wich we use it at first
      entry.target.setAttribute('src', entry.target.dataset.src);
      // when the new img is loaded the load event fire on the image element so we can use it to remove the lazy-img class from that img after load the new src
      // خب چرا اصن باید این کارو بکنیم نیایم خیلی راحت و به صورت مستقیم کلاس رو ازش بگیریم ؟ چون ممکنه هنوز تصویر جدید لود نشده و ما اومدیم تصویر رو نشون دادیم و بعدش یهو تصویر جدید لود بشه که اینجوری خیلی زشت میشه پس ما باید منتظر بمونیم که اول تصویر لود بشه و بعد نمایشش بدیم

      entry.target.classList.remove('lazy-img');
      /* entry.target.addEventListener('load', e => {
      }); */
      // don't observe anymore
      observer.unobserve(entry.target);
    }
  },
  {
    threshold: 0.2,
  }
);

allLazyImages.forEach(lazyImg => {
  lazyImageObserver.observe(lazyImg);
});

/* Reveal sections */
const sections = document.querySelectorAll('.section');
// first add section--hidden class to all sections with js because some users disable the javascript the browser so this site for these user don't show the section if use section--hidden in the html file
sections.forEach(sectionEl => sectionEl.classList.add('section--hidden'));

const sectionObserver = new IntersectionObserver(
  function (entries, observer) {
    const entry = entries[0];
    // Gaurd Cloase
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    // don't observe the sectinon anymore
    observer.unobserve(entry.target);
  },
  {
    threshold: 0.15,
  }
);

// observe all sections
sections.forEach(sectionEl => sectionObserver.observe(sectionEl));

/* Slider */
const slides = document.querySelectorAll('.slide');
const leftArrowBtn = document.querySelector('.slider__btn--left');
const rightArrowBtn = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

const maxSlide = slides.length;

let currentSlideIndex = 0;

function goToSlide(slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });

  activeDot(slide);
}

function nextSlide() {
  if (currentSlideIndex === maxSlide - 1) {
    currentSlideIndex = 0;
  } else {
    currentSlideIndex++;
  }

  goToSlide(currentSlideIndex);
}

function prevSlide() {
  if (currentSlideIndex === 0) {
    currentSlideIndex = maxSlide - 1;
  } else {
    currentSlideIndex--;
  }

  goToSlide(currentSlideIndex);
}

function createDots() {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<buttton class="dots__dot" data-slide="${i}"></buttton>`
    );
  });
}

function activeDot(slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}

// first create our slider
createDots();
goToSlide(0);

// Next Slide
rightArrowBtn.addEventListener('click', nextSlide);

document.addEventListener('keydown', e => {
  // use short circuiting for shorter code
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});

// Previous Slide
leftArrowBtn.addEventListener('click', prevSlide);

// dots action
dotsContainer.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
  }
});

/* 

document ==> DOMContentLoaded ==> html , css , js load
window ==> load ==> html , css , js , images , videos , audios , all of things

*/
