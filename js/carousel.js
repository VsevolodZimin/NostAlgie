'use strict'

const carousel = document.querySelector('.carousel');
const btnLeft = document.querySelector('.button--left');
const btnRight = document.querySelector('.button--right');

let curPos = 0;

btnLeft.addEventListener('click', ()=>{
    carousel.style.transform = `rotateY(${curPos = curPos + 120}deg)`;
    carousel.style.transition = 'transform 1.5s';
});

btnRight.addEventListener('click', () => {
  carousel.style.transform = `rotateY(${curPos = curPos - 120}deg)`;
  carousel.style.transition = 'transform 1.5s';
});