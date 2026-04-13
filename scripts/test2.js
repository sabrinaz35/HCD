
// MARK: Span van tekst
/**
 * Hulp bron: chatgpt
 * Prompt: ik wil eigenlijk van de tekst wat in mijn html staat per zin een span maken, en zodra de focus op de span is en er op enter geklikt wordt dat hij dat dan ziet als een selection
 * Link: https://chatgpt.com/share/69cb8f85-0de8-8327-801a-41aea10343b1
 */
const tekst = document.querySelectorAll('p');
const readText = window.speechSynthesis;

let inputAnnotatieValueTitle = document.querySelector('.annotatieValueTitle input')
let inputAnnotatieValue = document.querySelector('.annotatieValue input')

tekst.forEach(function(p){
    const getTekst = p.innerText;

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    const sentence = getTekst.match(/[^.!?]+[.!?]+/g); //Regular expression om te kijken waar hij moet afsnijden

    p.innerHTML = '';

    if(sentence){
            sentence.forEach((sentence, index)=>{
        const addSpan = document.createElement('span'); // span toevoegen

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
        addSpan.textContent = sentence.trim() + ' '; //Voegt een extra spatie toe
        addSpan.tabIndex = 0; //Voor de focus state 

        p.appendChild(addSpan);
    })
    } 


})

let selectedContentSpan = "";
let lastContentSpan = null;

document.addEventListener('keydown', function(event){
    //https://developer.mozilla.org/en-US/docs/Web/API/Document/hasFocus

    if (event.key === 'Enter') {
        const individualSpan = document.activeElement;

        // https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
        if(individualSpan.tagName === "SPAN") {
            selectedContentSpan = individualSpan.textContent;
            lastContentSpan = individualSpan;
            // Check of er aal een p in staat, zo ja verwijderen en de nieuwe toevoegen
            const currentP = document.querySelector('form p');
            if (currentP) {
                currentP.remove();
            }

            let selectedTekstToAnnotationHTML = 
                ` <p aria-label="Wilt u een annotatie maken bij de tekst? Nee klik op escape ja, ga met de tab verder: ${selectedContentSpan}" tabindex=0>${selectedContentSpan}</p>`

            if(lastContentSpan){
                lastContentSpan.classList.add("annotatie-teken");
            }

            document.querySelector('form').insertAdjacentHTML('afterbegin', selectedTekstToAnnotationHTML);

            const newP = document.querySelector(' form p')
            newP.focus()
            
        }

    }
});

document.addEventListener('keydown', function(event){
    if (event.key === 'Escape'){
        const form = document.querySelector('form');

        // https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
        if(form.contains(document.activeElement)){
            const p = document.querySelector('form p');
            if(p){
                p.remove();
            }

            if(lastContentSpan) {
                lastContentSpan.focus()
            }
        }
    }
})

// MARK: Toevoegen annotatie
function annotateText(){

    let titleAnnotation = inputAnnotatieValueTitle.value
    let annotation = inputAnnotatieValue.value

    if(titleAnnotation !== "" && annotation !== ""){

        let annotationHTML = 
        ` <article tabindex=0 class="newAnnotatie">
            <p tabindex=0>${selectedContentSpan}</p>
            <h2 tabindex="0">${titleAnnotation}</h2>
            <p tabindex="0">${annotation}</p>
            <div> 
                <button type="button" class="deleteButton">Verwijder annotatie</button>
                <button class="EditAnnotatie" type="button">Edit uw annotatie</button>
            </div>
        </article>`
        document.querySelector('section').insertAdjacentHTML('beforeend', annotationHTML);

    } else {
        console.log('fout bij invullen')
    }



// MARK: remove annotatie
    const deleteButton = document.querySelectorAll('.deleteButton')

    deleteButton.forEach(button =>{
        button.addEventListener('click', function(){
            const annotation = this.closest('.newAnnotatie')
            if(annotation) {
                annotation.remove()
                

                if(lastContentSpan){
                    lastContentSpan.classList.remove("annotatie-teken");
                }
            }
        })
    })
}


const addAnnotationButton = document.querySelector('.buttonAddAnnotation')

addAnnotationButton.addEventListener('click', annotateText);

// MARK: tabben en extra hierarchie tussen de elementen
// Alle articles selecteren en in een array stoppen 
const articles = Array.from(document.querySelectorAll('li'));
var currentArticleNumber = 0;


// Bron: Chatgpt
// Voor optimaliseren van de function want hij werkte niet 
// https://chatgpt.com/c/69dc97d6-7508-8327-b69b-c037bc1d5c19
// Promt: De scroll werkt nu niet meer, maar de focus werkt nu ook niet en ik heb bij elke article een tabindex
// Werkt nog niet helemaal
document.addEventListener('keydown', function(event) {
    const activeArticle = document.activeElement;
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
    if (!activeArticle || activeArticle.tagName !== 'LI' ){
        // open dan de link
        return;
    }

    if(event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        // zprgt voor geen scroll
        event.preventDefault()
    }

    // Haalt de nummer op van de geselecteerde index
    var indexArticle = articles.indexOf(activeArticle)

    // verder 
    if(event.key === 'ArrowDown'){
        const nextIndex = indexArticle + 1;

        if(nextIndex < articles.length){
            articles[nextIndex].focus()
        }
    }

// terug
    if(event.key === 'ArrowUp'){
        const prevIndex = indexArticle - 1;

        if(prevIndex >= 0){
            articles[prevIndex].focus()
        }
    }
});