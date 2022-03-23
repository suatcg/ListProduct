'use strict';

///////////////////////////////////////
// ELEMENTS

// Tabs
const tabsContainer = document.querySelector('.nav');
const tabs = document.querySelectorAll('.nav__links');

// Products
const productContainer = document.querySelector('.products');
const products = document.querySelectorAll('.product');

//Buttons;
const btnLeft = document.querySelector('.slider-btn--left');
let btnRight = document.querySelector('.slider-btn--right');
let btnId = document.getElementById('rightBtn');

// Variables
let counterLeft = 1;
let counterRight = 1;

///////////////////////////////////////
// FUNCTIONS

// Get Caption
const getSubCaption = function (titles) {
  return titles.map(caption => caption.split('>').at(-1));
};

// Create links Element Dynamically
const composeLinks = function (data, tab) {
  const captions = getSubCaption(data);

  const html = `
    <ul class="nav__category">
      <li class="nav__categories">
        <a class="nav__links nav__links--active" data-set="0" href="#"
          >${captions[0]}</a
        >
      </li>
      <li class="nav__categories">
        <a class="nav__links" data-set="1" href="#">
          ${captions[1]}
        </a>
      </li>
      <li class="nav__categories">
        <a class="nav__links" data-set="2" href="#">${captions[2]}</a>
      </li>
      <li class="nav__categories">
        <a class="nav__links" data-set="3" href="#">${captions[3]}</a>
      </li>
      <li class="nav__categories">
        <a class="nav__links" data-set="4" href="#">${captions[4]}</a>
      </li>
      <li class="nav__categories">
        <a class="nav__links" data-set="5" href="#">
          ${captions[5]}
        </a>
      </li>
    </ul>

  `;
  tab.insertAdjacentHTML('beforeend', html);
};

const initialProducts = function (product, productId) {
  const html = `
    <div class="product" data-id="${productId}">
      <div class="card">
        <div class="card__header">
          <div class="card__img">
            <img
              src=${product.image}
            />
          </div>
        </div>
        <div class="card__body">
          <div class="card__title">
            <span>
            ${product.name}
            </span>
          </div>
          <div class="card__price"><span>${product.priceText}</span></div>
          <div class="card__delivery">
            <div class="card__delivery--img">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#36b458"
              >
                <path
                  d="M23.808 9.733L21.552 6.6A1.421 1.421 0 0020.4 6h-4.08V4.5c0-.828-.645-1.5-1.44-1.5H1.44C.645 3 0 3.672 0 4.5v12c0 .828.645 1.5 1.44 1.5h1.44c0 1.657 1.29 3 2.88 3 1.59 0 2.88-1.343 2.88-3h5.76c0 1.657 1.29 3 2.88 3 1.59 0 2.88-1.343 2.88-3h1.92c1.06 0 1.92-.895 1.92-2v-5.667c0-.216-.067-.427-.192-.6zM5.76 20c-1.06 0-1.92-.895-1.92-2s.86-2 1.92-2 1.92.895 1.92 2c-.001 1.104-.86 1.999-1.92 2zm11.52 0c-1.06 0-1.92-.895-1.92-2s.86-2 1.92-2 1.92.895 1.92 2c-.001 1.104-.86 1.999-1.92 2zm5.76-9h-6.72V7h4.08c.15 0 .293.075.384.2l2.256 3.133V11z"
                ></path>
              </svg>
            </div>
            <span> Ücretsiz Kargo </span>
          </div>
        </div>
        <div class="card__footer">
          <button class="basket">Sepete Ekle</button>
        </div>
      </div>
    </div>
  `;
  productContainer.insertAdjacentHTML('beforeend', html);
};

// Create Tabs
(async function () {
  const res = await fetch('./product-list.json');
  const data = await res.json();
  const captions = data.responses[0][0].params.userCategories;
  composeLinks(captions, tabsContainer);
})();

// Intialize First Appereance to the Page
const init = async function () {
  try {
    const res = await fetch('./product-list.json');
    const data = await res.json();

    console.table(data);

    const productsEntries = Object.entries(
      data.responses[0][0].params.recommendedProducts
    );

    const productValues = productsEntries.map(arr => arr[1]);
    console.log(productValues);

    const activeTab = document.querySelector('.nav__links--active');
    const activeLink = activeTab.dataset.set;

    const activeProducts = productValues[activeLink];
    console.log(activeProducts);

    for (let i = 0; i < 5; i++) {
      initialProducts(activeProducts[i], i);
    }
  } catch (err) {
    console.log(`${err} 🔥`);

    throw err;
  }
};

init();

// Translate Products to the Left
const translateLeft = function (count) {
  const activeProducts = document.querySelectorAll('.product');
  activeProducts.forEach(el => {
    el.style.transform = `translateX(${-960 * count}px)`;
  });
  counterLeft++;
};

// Translate Products to the right
const translateRight = function () {
  const activeProducts = document.querySelectorAll('.product');
  activeProducts.forEach(el => {
    let style = window.getComputedStyle(el);
    let matrix = new WebKitCSSMatrix(style.transform);
    if (matrix.m41 === 0) return;
    el.style.transform = `translateX(${matrix.m41 + 960}px)`;
  });
};

const showProducts = async function () {
  const res = await fetch('./product-list.json');
  const data = await res.json();

  const productsEntries = Object.entries(
    data.responses[0][0].params.recommendedProducts
  );
  const productValues = productsEntries.map(arr => arr[1]);
  console.log(productValues);

  const activeTab = document.querySelector('.nav__links--active');
  const activeLink = activeTab.dataset.set;

  const activeProducts = productValues[activeLink];
  console.log(activeProducts);

  const lastChild = productContainer.lastElementChild;
  console.log(lastChild);
  const productId = +lastChild.dataset.id;
  console.log(typeof productId, productId);

  if (productId <= activeProducts.length - 4) {
    for (let i = productId + 1; i < productId + 5; i++) {
      initialProducts(activeProducts[i], i);
    }
    translateLeft(counterLeft);
  } else if (productId === activeProducts.length - 1) return;
  else if (activeProducts.length - productId < 4) {
    for (let i = productId; i < activeProducts - productId + 1; i++) {
      initialProducts(activeProducts[i], i);
    }
    translateLeft(counterLeft);
  }
  return lastChild;
};

///////////////////////////////////////
// EVENTS

// Selecting the Tab
tabsContainer.addEventListener('click', function (e) {
  const navlinks = document.querySelectorAll('.nav__links');
  const clicked = e.target.closest('.nav__links');
  counterLeft = 1;
  counterRight = 1;

  // Guard Clause
  if (!clicked) return;

  // Rempove active classes
  console.log(tabs);
  navlinks.forEach(tab => {
    tab.classList.remove('nav__links--active');
  });

  // Remove Products
  productContainer.innerHTML = `
    <div class="slider-btn slider-btn--left">
      <svg
        class="slider-btn__chevron slider-btn__chevron--left"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
      >
        <path
          d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
        />
      </svg>
    </div>

    <div class="slider-btn slider-btn--right" id="rightBtn">
      <svg
        class="slider-btn__chevron slider-btn__chevron--right"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
      >
        <path
          d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
        />
      </svg>
    </div>
  
  `;

  // Add active class
  clicked.classList.add('nav__links--active');
  let btnRight = document.querySelector('.slider-btn--right');
  let btnLeft = document.querySelector('.slider-btn--left');

  btnRight.addEventListener('click', function () {
    showProducts();
  });

  btnLeft.addEventListener('click', function () {
    translateRight(counterRight);
  });
  // Add active products
  init();
});

// Click The Rigt Button
btnRight.addEventListener('click', function () {
  showProducts();
});

// Click The Left Button
btnLeft.addEventListener('click', function () {
  translateRight(counterRight);
});
