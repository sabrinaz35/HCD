console.log('oh hallo');

// let geselecteerdeTekst = 

// MARK: Select een tekst
//Function geoptimaliseerd met chatgpt: Prompt: Ik wil dat als je geselecteerd heb en dan op enter klikt dat je dan een consol log hebt met de tekst maar dit werkt niet, wat doe ik fout?
//https://chatgpt.com/share/69ca4ec3-b6b8-8333-b600-b28db00df488

// https://coreui.io/answers/how-to-detect-enter-key-in-javascript/
function getText() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/selectionchange_event 
    document.addEventListener("selectionchange", () => {

        // https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection
        const selection = window.getSelection();
        selectedText = selection.toString();
    })

    document.addEventListener('keydown', function(event){
        if (event.key === 'Enter' && selectedText) {
           console.log(selectedText) 
        }
    });
};

getText();

