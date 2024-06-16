function generateTask(number, isMultiplication) {
    const randomNum = Math.floor(Math.random() * 12) + 1; // Ensure the random number is between 1 and 12
    const product = number * randomNum; // The result of multiplication which will always be a positive integer

    const multiplicationFormats = [
        {question: `_ = ${number} x ${randomNum}`, answer: product},
        {question: `_ = ${randomNum} x ${number}`, answer: product},
        {question: `${number} x ${randomNum} = _`, answer: product},
        {question: `${randomNum} x ${number} = _`, answer: product},
        {question: `${product} = _ x ${number}`, answer: randomNum},
        {question: `${product} = _ x ${randomNum}`, answer: number},
        {question: `${product} = ${number} x _`, answer: randomNum},
        {question: `${product} = ${randomNum} x _`, answer: number},
        {question: `${number} x _ = ${product}`, answer: randomNum},
        {question: `${randomNum} x _ = ${product}`, answer: number},
        {question: `_ x ${number} = ${product}`, answer: randomNum},
        {question: `_ x ${randomNum} = ${product}`, answer: number},
    ];

    const divisionFormats = [
        {question: `_ = ${product} ÷ ${number}`, answer: randomNum},
        {question: `_ = ${product} ÷ ${randomNum}`, answer: number},
        {question: `${product} ÷ ${number} = _`, answer: randomNum},
        {question: `${product} ÷ ${randomNum} = _`, answer: number},
        {question: `${randomNum} = ${product} ÷ _`, answer: number},
        {question: `${number} = ${product} ÷ _`, answer: randomNum},
        {question: `${product} ÷ _ = ${number}`, answer: randomNum},
        {question: `${product} ÷ _ = ${randomNum}`, answer: number},
        {question: `_ ÷ ${number} = ${randomNum}`, answer: product},
        {question: `_ ÷ ${randomNum} = ${number}`, answer: product},
    ];

    const formats = isMultiplication ? multiplicationFormats : divisionFormats;
    const position = Math.floor(Math.random() * formats.length);
    const task = formats[position];
    task.question = task.question.replace('_', '<span id="answer"></span>');

    return task;
}

function checkMathSolution(question, userAnswer) {
    const cleanQuestion = question.replace('<span id="answer"></span>', userAnswer);
    const [lhs, rhs] = cleanQuestion.split('=').map(part => part.trim());

    const evaluateExpression = (expression) => {
        const operators = ['+', '-', 'x', '÷'];
        let operator, operands;

        for (let op of operators) {
            if (expression.includes(op)) {
                operator = op;
                operands = expression.split(op).map(Number);
                break;
            }
        }

        switch (operator) {
            case 'x':
                return operands[0] * operands[1];
            case '÷':
                return operands[0] / operands[1];
            default:
                return null; // Unexpected operator
        }
    };

    const lhsResult = isNaN(lhs) ? evaluateExpression(lhs) : Number(lhs);
    const rhsResult = isNaN(rhs) ? evaluateExpression(rhs) : Number(rhs);

    return lhsResult === rhsResult;
}
