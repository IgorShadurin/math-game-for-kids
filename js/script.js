const types = ['multiplication', 'division', 'addition', 'subtraction'];

const getRandomNumber = (max) => Math.floor(Math.random() * max) + 1;

/**
 * Generates a math task based on the specified type and number
 * @param {number} number - The base number for the math task
 * @param {string} type - The type of math task ('multiplication', 'division', 'addition', 'subtraction')
 * @returns {object} - An object containing the question and the answer
 */
function generateTask(number, type) {
    let randomNum, result, formats;

    switch (type) {
        case 'multiplication':
            randomNum = getRandomNumber(12);
            result = number * randomNum;
            formats = [
                { question: `_ = ${number} x ${randomNum}`, answer: result },
                { question: `_ = ${randomNum} x ${number}`, answer: result },
                { question: `${number} x ${randomNum} = _`, answer: result },
                { question: `${randomNum} x ${number} = _`, answer: result },
                { question: `${result} = _ x ${number}`, answer: randomNum },
                { question: `${result} = _ x ${randomNum}`, answer: number },
                { question: `${result} = ${number} x _`, answer: randomNum },
                { question: `${result} = ${randomNum} x _`, answer: number },
                { question: `${number} x _ = ${result}`, answer: randomNum },
                { question: `${randomNum} x _ = ${result}`, answer: number },
                { question: `_ x ${number} = ${result}`, answer: randomNum },
                { question: `_ x ${randomNum} = ${result}`, answer: number },
            ];
            break;
        case 'division':
            randomNum = getRandomNumber(12);
            result = number * randomNum;
            formats = [
                { question: `_ = ${result} ÷ ${number}`, answer: randomNum },
                { question: `_ = ${result} ÷ ${randomNum}`, answer: number },
                { question: `${result} ÷ ${number} = _`, answer: randomNum },
                { question: `${result} ÷ ${randomNum} = _`, answer: number },
                { question: `${randomNum} = ${result} ÷ _`, answer: number },
                { question: `${number} = ${result} ÷ _`, answer: randomNum },
                { question: `${result} ÷ _ = ${number}`, answer: randomNum },
                { question: `${result} ÷ _ = ${randomNum}`, answer: number },
                { question: `_ ÷ ${number} = ${randomNum}`, answer: result },
                { question: `_ ÷ ${randomNum} = ${number}`, answer: result },
            ];
            break;
        case 'addition':
            randomNum = getRandomNumber(10);
            result = number + randomNum;
            formats = [
                { question: `_ = ${number} + ${randomNum}`, answer: result },
                { question: `_ = ${randomNum} + ${number}`, answer: result },
                { question: `${number} + ${randomNum} = _`, answer: result },
                { question: `${randomNum} + ${number} = _`, answer: result },
                { question: `${result} = _ + ${number}`, answer: randomNum },
                { question: `${result} = _ + ${randomNum}`, answer: number },
                { question: `${result} = ${number} + _`, answer: randomNum },
                { question: `${result} = ${randomNum} + _`, answer: number },
                { question: `${number} + _ = ${result}`, answer: randomNum },
                { question: `${randomNum} + _ = ${result}`, answer: number },
                { question: `_ + ${number} = ${result}`, answer: randomNum },
                { question: `_ + ${randomNum} = ${result}`, answer: number },
            ];
            break;
        case 'subtraction':
            randomNum = getRandomNumber(10);
            result = number + randomNum;
            formats = [
                { question: `_ = ${result} - ${number}`, answer: randomNum },
                { question: `_ = ${result} - ${randomNum}`, answer: number },
                { question: `${result} - ${number} = _`, answer: randomNum },
                { question: `${result} - ${randomNum} = _`, answer: number },
                { question: `${randomNum} = ${result} - _`, answer: number },
                { question: `${number} = ${result} - _`, answer: randomNum },
                { question: `${result} - _ = ${number}`, answer: randomNum },
                { question: `${result} - _ = ${randomNum}`, answer: number },
                { question: `_ - ${number} = ${randomNum}`, answer: result },
                { question: `_ - ${randomNum} = ${number}`, answer: result },
            ];
            break;
        default:
            throw new Error('Invalid type. Accepted values are multiplication, division, addition, subtraction');
    }

    const position = Math.floor(Math.random() * formats.length);
    const task = formats[position];
    task.question = task.question.replace('_', '<span id="answer"></span>');

    return task;
}

/**
 * Checks the user's solution for a given math question
 * @param {string} question - The math question
 * @param {number} userAnswer - The user's answer
 * @returns {boolean} - Whether the user's answer is correct
 */
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
            case '+':
                return operands[0] + operands[1];
            case '-':
                return operands[0] - operands[1];
            default:
                return null; // Unexpected operator
        }
    };

    const lhsResult = isNaN(lhs) ? evaluateExpression(lhs) : Number(lhs);
    const rhsResult = isNaN(rhs) ? evaluateExpression(rhs) : Number(rhs);

    return lhsResult === rhsResult;
}
