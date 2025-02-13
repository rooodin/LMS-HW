
//widgets
const quizzes = document.getElementById("quizzes");

const course_id = "65c6b2d6f1a5d4a3b8f9e5c7";

window.addEventListener("load",async ()=>{
    // const params = new URLSearchParams(window.location.search);
    // const quiz_id = params.get("course_id");
    try{
        const res = await fetch(`http://localhost:3000/api/quizzes/${course_id}`);
        const data = await res.json();
        setData(data);
        console.log(data);
    }catch(err){
        console.log(err);
    }
})

function setData(quizz){
    quizz.forEach(quiz => {
        quizzes.innerHTML+=`
        <a id="a-quiz" href="displaySolveQuiz.html?quiz_id=${quiz._id}">${quiz.title}</a>
        `
    });
}