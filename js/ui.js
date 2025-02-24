document.addEventListener("DOMContentLoaded", function () {
    const correct = document.getElementById('correct')
    const incorrect = document.getElementById('incorrect')
    const total = document.getElementById('total')
    const taskEl = document.getElementById('task')
    const successAudio = document.getElementById('successAudio')
    const failAudio = document.getElementById('failAudio')
    const incorrectTasksList = document.getElementById('incorrectTasksList')

    const totalPersonages = 23
    const personagesHistory = []
    let correctCount = 0
    let incorrectCount = 0
    let totalCount = 0
    let currentTask = {}
    let incorrectTasks = []
    let currentType
    let allowedTypes

    function updateSubmitButtonState() {
        console.log('updateSubmitButtonState')
        const answerText = document.getElementById('answer').textContent;
        const submitButton = document.getElementById('submit');
        if (answerText !== '' && !isNaN(answerText)) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    async function preloadImages(totalPersonages) {
        const loadSingleImage = async (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = reject;
            });
        };

        const imagePromises = [];
        for (let i = 1; i <= totalPersonages; i++) {
            const imageSrc = `./img/personage-${i}.png`;
            imagePromises.push(loadSingleImage(imageSrc));
        }

        // Use Promise.allSettled to handle both resolved and rejected promises
        await Promise.allSettled(imagePromises);
    }

    const renderTaskForUI = (task) => {
        taskEl.innerHTML = task.question
    }

    const renderTaskForConsole = (task) => {
        return task.question.replace(/<span.*?>.*?<\/span>/, '_')
    }

    const readTheText = (text) => {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis
            const utterThis = new SpeechSynthesisUtterance(text)
            utterThis.rate = 0.5
            synth.speak(utterThis)
        } else {
            alert('Speech Synthesis not supported in this browser.');
        }
    }

    const initGame = () => {
        if (!currentType) {
            currentType = allowedTypes[0]
        }

        document.getElementById('the-game').classList.remove('d-none')
        document.getElementById('choose-scene').classList.add('d-none')
        const number = currentType === 'multiplication' || currentType === 'division' ? getRandomNumber(12) : getRandomNumber(10);
        currentTask = generateTask(number, currentType)
        setTimeout(() => {
            // readTheText(currentTask.humanReadable)
        }, 1000)
        renderTaskForUI(currentTask)
        updateSubmitButtonState()
        // change currentType to the next type or start over
        currentType = allowedTypes[allowedTypes.indexOf(currentType) + 1] || allowedTypes[0]
    }

    const showPersonage = () => {
        // todo generate the array of personages sequence on init and use the sequence to show the personages, revert getRandomNumber to the original
        const randomImageNumber = getRandomNumber(totalPersonages, personagesHistory)
        personagesHistory.push(randomImageNumber)
        document.getElementById('slidingImage').src = `./img/personage-${randomImageNumber}.png`
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.classList.toggle('visible');

        setTimeout(() => {
            imageContainer.classList.toggle('visible');
        }, 1500);
    }

    const checkAnswer = () => {
        totalCount++
        total.textContent = totalCount
        console.log('checkAnswer')
        const answerText = document.getElementById('answer').textContent
        const userAnswer = Number(answerText)
        if (userAnswer === currentTask.answer && userAnswer > 0) {
            successAudio.play()
            correctCount++
            correct.textContent = correctCount
            renderTaskForUI(currentTask)

            if (correctCount % 5 === 0 || correctCount === 1) {
                showPersonage();
            }
        } else {
            failAudio.play()
            incorrectCount++
            incorrect.textContent = incorrectCount
            renderTaskForUI(currentTask)
            incorrectTasks.push({question: currentTask.question, userAnswer, correctAnswer: currentTask.answer})
        }
        initGame()
    }

    document.querySelectorAll('.btn-light').forEach(button => {
        button.addEventListener('click', () => {
            console.log('btn-light')
            const answerEl = document.getElementById('answer')
            answerEl.textContent += button.textContent
            updateSubmitButtonState()
        })
    })

    document.getElementById('delete').addEventListener('click', () => {
        console.log('delete')
        const answerEl = document.getElementById('answer')
        answerEl.textContent = answerEl.textContent.slice(0, -2)
        updateSubmitButtonState()
    })

    document.getElementById('submit').addEventListener('click', checkAnswer)

    incorrect.addEventListener('click', () => {
        incorrectTasksList.innerHTML = ""
        const tasksToShow = incorrectTasks.slice(-30).reverse()
        tasksToShow.forEach(task => {
            const listItem = document.createElement('li')
            listItem.className = 'list-group-item'
            listItem.textContent = `${renderTaskForConsole(task)} Your answer: ${task.userAnswer}, Correct answer: ${task.correctAnswer}`
            incorrectTasksList.appendChild(listItem)
        })
        const modal = new bootstrap.Modal(document.getElementById('incorrectTasksModal'))
        modal.show()
    })

    document.getElementById('start-multiply-divide').addEventListener('click', () => {
        allowedTypes = ['multiplication', 'division']
        initGame()
    })
    document.getElementById('start-plus-minus').addEventListener('click', () => {
        allowedTypes = ['addition', 'subtraction']
        initGame()
    })
    document.getElementById('start-all').addEventListener('click', () => {
        allowedTypes = ['multiplication', 'division', 'addition', 'subtraction']
        initGame()
    })

    preloadImages(totalPersonages)
})
