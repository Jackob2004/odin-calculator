const calculationState = [];
let currentOperand = "";

const display = document.querySelector(".display span");

function addOperand() {
    if (currentOperand === "") return;

    if (!isNaN(calculationState.at(-1))) {
        calculationState[calculationState.length -1] = currentOperand;
        currentOperand = "";
        return;
    }

    calculationState.push(currentOperand);
    currentOperand = "";
}

function isOperator(value) {
    return value === "*" || value === "/" || value === "+" || value === "-";
}

function addOperator(operator) {
    if (currentOperand === "" && calculationState.length > 0 && isOperator(calculationState.at(-1))) {
        calculationState[calculationState.length - 1] = operator;
        return;
    }

    if (!isOperator(currentOperand.at(-1))) {
        addOperand();
        evaluate();
        calculationState.push(operator);
        return;
    }

    if (operator === "*" || operator === "/") return;

    currentOperand = operator;
}

function constructOperand(input) {
    if (input === "0" && currentOperand.length === 0) return;

    if (input.length + currentOperand.length > 17) return;

    currentOperand += input;
}

function calculateExpression(a, b, operator) {
    let result = 0;
    switch (operator) {
        case "*":
            result = a * b;
            break;
        case "/":
            result = a / b;
            break;
        case "-":
            result = a - b;
            break;
        case "+":
            result = a + b;
            break;
    }

    return result;
}

function evaluate() {
    if (calculationState.length < 3) return;

    const b = +calculationState.pop();
    const operator = calculationState.pop();
    const a = +calculationState.pop();

    calculationState.push(calculateExpression(a, b, operator));
}

function clearAll() {
    calculationState.length = 0;
    currentOperand = "";
}

function populateDisplay() {
    if (currentOperand === "" && calculationState.length === 0) {
        display.textContent = "|";
        return;
    }

    const expressionText = calculationState.reduce((prev, curr) => prev + curr, "");
    let displayText = expressionText + currentOperand;

    if (calculationState.length === 1 && currentOperand !== "" && !isOperator(currentOperand.at(-1))) {
        displayText = currentOperand;
    }

    display.textContent = displayText;
}

function handleButtonClick(event) {
    switch (event.target.className) {
        case "btn-number":
            constructOperand(event.target.textContent);
            break;
        case "btn-operator":
            addOperator(event.target.textContent);
            break;
        case "btn-clear":
            clearAll();
            break;
        case "btn-eval":
            addOperand();
            evaluate();
            break;
    }

    populateDisplay();
}

document.querySelector(".calculator-container").addEventListener("click", handleButtonClick);