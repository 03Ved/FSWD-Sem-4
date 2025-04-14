let delbtns = document.querySelectorAll('.delete');

for (delbtn of delbtns) {
    delbtn.addEventListener('click', function() { 
        console.log('delete');
        this.parentElement.remove();
    });
}