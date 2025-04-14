let p = document.querySelector('p');
let show = document.querySelector('#show');
let hide = document.querySelector('#hide');

show.addEventListener('click', function() {
    p.style.opacity = 1;
});

hide.addEventListener('click', function() {
    p.style.opacity = 0;
});