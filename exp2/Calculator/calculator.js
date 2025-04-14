let inp1 = document.querySelector("#inp1");
let inp2 = document.querySelector("#inp2");
let add = document.querySelector("#add");
let sub = document.querySelector("#sub");
let mul = document.querySelector("#mul");
let div = document.querySelector("#div");
let res = document.querySelector("#result");
let clr = document.querySelector("#clr");


add.addEventListener("click", () => {
    let output = parseFloat(inp1.value) + parseFloat(inp2.value);
    res.innerText = output;
});


sub.addEventListener("click", () => {
    let output = parseFloat(inp1.value) - parseFloat(inp2.value);
    res.innerText = output;
});


mul.addEventListener("click", () => {
    let output = parseFloat(inp1.value) * parseFloat(inp2.value);
    res.innerText = output;
});


div.addEventListener("click", () => {
    let output = parseFloat(inp1.value) / parseFloat(inp2.value);
    res.innerText = output;
});


clr.addEventListener("click", () => {
    res.innerText = "";
});
