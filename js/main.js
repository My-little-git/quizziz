const slider = document.querySelector('.carousel-inner');
const sliderIndicators = document.querySelector('.carousel-indicators');
const myCarousel = document.querySelector('#quizzizCarousel');


//Alhoritmic functions

function shuffle(array){
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}


// Carousel

const carousel = new bootstrap.Carousel(myCarousel, {
    interval: false,
    wrap: false
})


// Database

async function getQuestions(){
    let response = await fetch('api/getQuestions.php');
    return response.json();
}

async function getAnswers(){
    let response = await fetch('api/getAnswers.php');
    return response.json();
}


// Render

async function renderQuestion(){
    const questions = shuffle(await getQuestions())
    const answers = await getAnswers()
    const colors = ['red', 'blue', 'yellow', 'green'];
    let htmlIndicator;

    slider.innerHTML = '';

    questions.forEach((question, index) => {
        const necessaryAnswers = shuffle(answers.filter(answer => question.id === answer.question_id));
        const necessaryColors = shuffle(colors);
        const currIndex = index + 1;
        const isActive = (currIndex === 1) ? "active" : '';

        let htmlAnswers = '';

        necessaryAnswers.forEach((answer, index) => {
            const color = necessaryColors[index];
            htmlAnswers += `<button data-id="${answer.id}" class="bg-${color} question__answer">${answer.text}</button>`;
        });


        const htmlSlide = `
        <div class="carousel-item ${isActive}" data-slide="${index}">
            <div class="question-card" data-id="${question.id}">
                <div class="question__title">${question.text}</div>
                <div class="question__answers">
                    ${htmlAnswers}
                </div>
            </div>
        </div>
        `;

        if (currIndex === 1){
            htmlIndicator = `
                <button type="button" data-bs-target="#quizzizCarousel" data-bs-slide-to="${index}" class="active" aria-current="true" aria-label="Slide ${currIndex}">${currIndex}</button>
            `
        } else {
            htmlIndicator = `
                <button type="button" data-bs-target="#quizzizCarousel" data-bs-slide-to="${index}" aria-label="Question ${currIndex}">${currIndex}</button>
            `;

        }

        slider.insertAdjacentHTML('beforeend', htmlSlide);
        sliderIndicators.insertAdjacentHTML('beforeend', htmlIndicator);
    })
}

// Check

function checkEnd(){
    const slidesAmount = slider.querySelectorAll('.carousel-item').length;
    const passedSlidesAmount = slider.querySelectorAll('.passed').length;
    const amountCorrect = sliderIndicators.querySelectorAll('.correct').length;

    if (slidesAmount === passedSlidesAmount){
        alert(`Вы прошли тест на ${amountCorrect} из ${slidesAmount} баллов` )
    }
}


slider.addEventListener('click', async e => {
    const target = e.target;
    const slide = target.closest('.carousel-item');

    if (target.classList.contains('question__answer') && !slide.classList.contains('passed')) {
        const questionId = target.closest('.question-card').dataset.id;
        const answerId = target.dataset.id;
        const slideId = target.closest('.carousel-item').dataset.slide;
        const slideIndicator = sliderIndicators.children[slideId];
        const amountPressed = target.closest('.question__answers').querySelectorAll('.pressed').length

        console.log(amountPressed)
        const answers = await getAnswers();
        const currAnswers = answers.filter(answer => answer.question_id === questionId);
        const amountTrue = currAnswers.reduce((accu, curr) => accu + +curr.is_true, 0);

        const isTrue = answers[answerId - 1]['is_true'];

        target.classList.add('pressed');

        if (amountTrue === 1){

            if (+isTrue){
                slideIndicator.classList.add('correct');
            } else {
                slideIndicator.classList.add('incorrect');
            }

            slide.classList.add('passed')
            carousel.next()

        } else {

            if (!+isTrue){
                slideIndicator.classList.add('incorrect');
                carousel.next();
                slide.classList.add('passed')
            } else if (amountPressed + 1 === amountTrue) {
                slideIndicator.classList.add('correct');
                carousel.next();
                slide.classList.add('passed')
            }

        }

        checkEnd();
    }
})

renderQuestion()