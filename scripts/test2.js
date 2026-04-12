
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

document.addEventListener('keydown', function(event){
    //https://developer.mozilla.org/en-US/docs/Web/API/Document/hasFocus

    if (event.key === 'Enter') {
        const individualSpan = document.activeElement;

        // https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
        if(individualSpan.tagName === "SPAN") {
            selectedContentSpan = individualSpan.textContent;
            inputAnnotatieValueTitle.focus(); 

            let selectedTekstToAnnotationHTML = 
                ` <p tabindex=0>${selectedContentSpan}</p>`

            document.querySelector('form').insertAdjacentHTML('afterbegin', selectedTekstToAnnotationHTML);

            
        
        }

    }
});



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
            <button type="button" class="deleteButton">Verwijder annotatie</button>
            <button class="EditAnnotatie" type="button">Edit uw annotatie</button>
        </article>`
        document.querySelector('section').insertAdjacentHTML('beforeend', annotationHTML);

    } else {
        console.log('fout bij invullen')
    }



// MARK: remove annotatie
// Werkt alleen nog niet met meerdere annotaties
    const deleteButton = document.querySelector('.deleteButton')
    const newAnnotation = document.querySelector('.newAnnotatie')

    if(deleteButton){
        deleteButton.addEventListener('click', function(){
            newAnnotation.remove()
        });
    }
}


const addAnnotationButton = document.querySelector('.buttonAddAnnotation')

addAnnotationButton.addEventListener('click', annotateText);

// MARK: tabben en extra hierarchie tussen de elementen

// Alle articles selecteren en in een array stoppen 
const articles = Array.from(document.querySelectorAll('article'));
var currentArticleNumber = 0;


// https://chatgpt.com/c/69db3d3c-8374-8328-8cb8-414fd9e76e34
// Werkt nog niet helemaal
document.addEventListener('keydown', function(event) {
    const activeArticle = document.activeElement;
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
    if (!active || active.tagName !== 'ARTICLE' ){
        // open dan de link
        return;
    }

    // Haalt de nummer op van de geselecteerde index
    var indexArticle = articles.indexOf(active)

    // verder 
    if(event.key === 'ArrowDown'){
        // zprgt voor geen scroll
        event.preventDefault()
        const nextIndex = indexArticle + 1;

        if(nextIndex < articles.length){
            articles[nextIndex].focus()
        }
    }

// terug
    if(event.key === 'ArrowUp'){
        event.preventDefault()
        const prevIndex = indexArticle - 1;

        if(prevIndex >= 0){
            articles[prevIndex].focus()
        }
    }
});