
// MARK: Span van tekst
/**
 * Hulp bron: chatgpt
 * Prompt: ik wil eigenlijk van de tekst wat in mijn html staat per zin een span maken, en zodra de focus op de span is en er op enter geklikt wordt dat hij dat dan ziet als een selection
 * Link: https://chatgpt.com/share/69cb8f85-0de8-8327-801a-41aea10343b1
 */
const tekst = document.querySelectorAll('p');
const readText = window.speechSynthesis;

// Variabel input
const inputField = document.querySelector('.annotatieValue input');

// let inputAnnotatieValueTitle = document.querySelector('.annotatieValueTitle input')
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
const form = document.querySelector('.formInput');

document.addEventListener('keydown', function(event){
    //https://developer.mozilla.org/en-US/docs/Web/API/Document/hasFocus

    if (event.key === 'Enter') {
        const individualSpan = document.activeElement;



        // https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
        if(individualSpan.tagName === "SPAN") {
            selectedContentSpan = individualSpan.textContent;
            lastContentSpan = individualSpan;

            form.classList.add('form-seen');

            // Check of er aal een p in staat, zo ja verwijderen en de nieuwe toevoegen
            const currentP = document.querySelector('form p');
            if (currentP) {
                currentP.remove();
            }

            let selectedTekstToAnnotationHTML = 
                ` <p aria-label="Wilt u een annotatie maken bij de tekst? Nee klik op escape ja, ga met de tab verder. U heeft op dit moment de volgende zin geselecteerd; ${selectedContentSpan}" tabindex=0>${selectedContentSpan}</p>`

            if(lastContentSpan){
                lastContentSpan.classList.add("annotatie-teken");
            }

            document.querySelector('form').insertAdjacentHTML('afterbegin', selectedTekstToAnnotationHTML);

            const newP = document.querySelector('form p')
            newP.focus()
        }
}});




// MARK: uit de form gaan
document.addEventListener('keydown', function(event){
    if (event.key === 'Escape'){

        // https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
        if(form.contains(document.activeElement)){
            const p = document.querySelector('form p');
            if(p){
                p.remove();
            }

            let annotation;

            // De focus weer terug zetten op de zin
            if(lastContentSpan) {
                lastContentSpan.focus()
                form.classList.remove('form-seen');
            }

            console.log(lastContentSpan)
            console.log(lastContentSpan?.classList)
        }
    }
})

// MARK: Toevoegen annotatie
function annotateText(){

    const section = document.querySelector('section')
    // let titleAnnotation = inputAnnotatieValueTitle.value
    let annotation = inputAnnotatieValue.value

    if(annotation !== ""){

        let annotationHTML = 
        ` <article tabindex=0 class="newAnnotatie" data-annotatie="${selectedContentSpan}">
            <p tabindex=0>${selectedContentSpan}</p>
            <p tabindex="0">${annotation}</p>
            <div> 
                <button type="button" class="deleteButton">Verwijder annotatie</button>
            </div>
        </article>`

        section.insertAdjacentHTML('beforeend', annotationHTML);

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
                
                // Markering verwijderen als de annotatie ook verwijdert wordt.
                if(lastContentSpan){
                    lastContentSpan.classList.remove("annotatie-teken");
            
                }
            }
        })
    })
}


//MARK: Link aan de annotatie/oplichten ervan
// HUlp van claudeai 
// Prompt: ik wil hier een function schrijven waarbij ik kijk of er twee elementen overeen komen, en dan wil ik er een class aangeven en met css wil ik er dan een lijn tussen maken of dat het een andere kleur krijgt
// https://claude.ai/share/d6b86135-9caf-4360-af64-be8eeecfed38

function focusWithAnnotation (){
    const spanWithAnnotation = document.querySelector('ol');

    console.log('container:', spanWithAnnotation)

    spanWithAnnotation.addEventListener('focusin', function (event) {
        const span = event.target

        if(!span.classList.contains('annotatie-teken')) {
            return;
        }


        const spanText = span.textContent.trim();
        const allAnnotations = document.querySelectorAll('.newAnnotatie');

        let matchAnnotatie = null;

        // Eerst de match
        allAnnotations.forEach(article => {
            if (article.dataset.annotatie.trim() === spanText.trim()){
                matchAnnotatie = article;
            }
        })

        if (!matchAnnotatie) {
            return;
        };

        span.classList.add('focusedAnnotatie')
        matchAnnotatie.classList.add('focusedAnnotatie')

    })

        spanWithAnnotation.addEventListener('focusout', function(){
            document.querySelectorAll('.focusedAnnotatie').forEach(element => {
                element.classList.remove('focusedAnnotatie')
            })
        })
}
    


// MARK: Save features
const saveAnnotationButton = document.querySelector('form button')
const opslaanBevestiging = document.querySelector('#opslaanBevestiging')

saveAnnotationButton.addEventListener('click', function () {
    const inputAnnotation = inputField.value;
    annotateText()

    inputField.value = '';
    form.classList.remove('form-seen');

    lastContentSpan.focus();

    

});

focusWithAnnotation();

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




// MARK: van links naar recht tussen annotatie en tekst switch
// claudeAI om fouten eruit te halen
// prompt: Dit werkt niet, hoe is het mogelijk?
// https://claude.ai/share/92be3b12-e539-483a-b011-9aec5c447f58

let lastListItem = null;

document.addEventListener('keydown', function(event) {
    const activeElement = document.activeElement;
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
    const sectionAnnotatie = document.querySelector('div section');
    const ol = document.querySelector('ol');

    // if (activeElement && activeElement.tagName !== 'LI' ){
    //     // open dan de link
    //     lastListItem = activeElement;
    // }

    if(event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        // zprgt voor geen scroll
        event.preventDefault()
    }

    if(event.key === 'ArrowRight'){

        if(ol.contains(activeElement)) {
            lastListItem = activeElement;
            sectionAnnotatie.focus()
        }
    }

// terug
    if(event.key === 'ArrowLeft'){
        if (activeElement === sectionAnnotatie && lastListItem) {
            lastListItem.focus()
        }
    }
});


