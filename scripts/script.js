console.log('oh hallo');


// MARK: Select een tekst
//Function geoptimaliseerd met chatgpt: Prompt: Ik wil dat als je geselecteerd heb en dan op enter klikt dat je dan een consol log hebt met de tekst maar dit werkt niet, wat doe ik fout?
//https://chatgpt.com/share/69ca4ec3-b6b8-8333-b600-b28db00df488
let selectedText = '';

// https://coreui.io/answers/how-to-detect-enter-key-in-javascript/
function getText() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/selectionchange_event 
    document.addEventListener("selectionchange", () => {

        // https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection
        const selection = window.getSelection();
        selectedText = selection.toString();
        // const hightlightSelectedText = content.replace('<mark>selection</mark>');
        
    })

    document.addEventListener('keydown', function(event){
        if (event.key === 'Enter' && selectedText) {
           console.log(selectedText) 
        //    annotateText();
        const focusOnInput = document.querySelector('.annotatieValueTitle');
            focusOnInput.focus();

        }
    });
};

getText();
// console.log(selectedText);

// MARK:    
//  document.body.insertAdjacentHTML('beforeend', annotationHTML)
    let inputAnnotatieValueTitle = document.querySelector('.annotatieValueTitle')
    let inputAnnotatieValue = document.querySelector('.annotatieValue')

function annotateText(){

    let annotationHTML = 
    ` <article class="${selectedText}">
        <h2>${inputAnnotatieValueTitle.value}</h2>
        <p>${inputAnnotatieValue.value}</p>
    </article>`

    if(selectedText && inputAnnotatieValue.value == true && inputAnnotatieValueTitle.value == true){
        document.body.insertAdjacentHTML('beforeend', annotationHTML)
    }
}