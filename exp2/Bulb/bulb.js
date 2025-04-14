let one = document.querySelector("#one");
let two = document.querySelector("#two");
let on = document.querySelector("#on");
let off = document.querySelector("#off");


on.addEventListener("click", () => {
    one.style.display = "none";
    two.style.display = "block";
});


off.addEventListener("click", () => {
    one.style.display = "block";
    two.style.display = "none";
});
