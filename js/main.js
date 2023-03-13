const slider = document.querySelector('.carousel-inner')

async function getQuestions(){
    let response = await fetch('api/getQuestions.php');

    // console.log(await response.json())
    return await response.json()
}

console.log( await getQuestions())