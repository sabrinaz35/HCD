
/**
 * Hulp bron: chatgpt
 * Prompt: ik wil eigenlijk van de tekst wat in mijn html staat per zin een span maken, en zodra de focus op de span is en er op enter geklikt wordt dat hij dat dan ziet als een selection
 * Link: https://chatgpt.com/share/69cb8f85-0de8-8327-801a-41aea10343b1
 */
const tekst = document.querySelectorAll('p');
const readText = window.speechSynthesis;

let inputAnnotatieValueTitle = document.querySelector('.annotatieValueTitle')
let inputAnnotatieValue = document.querySelector('.annotatieValue')

tekst.forEach(function(p){
    const getTekst = p.innerText;

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    const sentence = getTekst.match(/[^.!?]+[.!?]+/g); //Regular expression om te kijken waar hij moet afsnijden

    p.innerHTML = '';

    sentence.forEach((sentence, index)=>{
        const addSpan = document.createElement('span'); // span toevoegen

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
        addSpan.textContent = sentence.trim() + ' '; //Voegt een extra spatie toe
        addSpan.tabIndex = 0; //Voor de focus state 

        p.appendChild(addSpan);
    })

    document.addEventListener('keydown', function(event){
        //https://developer.mozilla.org/en-US/docs/Web/API/Document/hasFocus

        if (event.key === 'Enter') {
            const individualSpan = document.activeElement;

            // https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
            if(individualSpan.tagName === "SPAN") {
                const contentSpan = individualSpan.textContent;

                console.log(contentSpan) 

                // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
                const speakThis = new SpeechSynthesisUtterance('Geselecteerd:'+ contentSpan);

                https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/end_event
                speakThis.onend = function(){
                    inputAnnotatieValueTitle.focus(); 
                    console.log('speech klaar')
                };

            speechSynthesis.speak(speakThis);
            
            }

        }
    });
})
