// const hoofdstukLink = document.QueryselectorAll('.hoofdstuk-link');

console.log('oh hallo')

document.addEventListener('keydown', function(event) {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
    if (event.code === 'Space' ){
        // open dan de link
        const focusedElement = document.activeElement;

        if(focusedElement && focusedElement.tagName === 'A'){
            focusedElement.click();
        }
    }
})