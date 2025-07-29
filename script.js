const calculationState = [];
let currentOperand = "";

const display = document.querySelector(".display span");

const MAX_DISPLAY_TEXT_LENGTH = 14;
const MAX_NUMBER_OF_DECIMALS = 17;
const MIN_CALCULATION_ITEMS = 3;

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
    // Supports switching operator if one is entered already
    if (currentOperand === "" && isOperator(calculationState.at(-1))) {
        calculationState[calculationState.length - 1] = operator;
        return;
    }

    // Enable placing "+" or "-" before the first operand and prevent the same operation with "*" or "/"
    if (calculationState.length === 0 && (currentOperand === "" || isOperator(currentOperand))) {
        if (operator === "+" || operator === "-") {
            currentOperand = operator;
        }

        return;
    }

    evaluate()
    calculationState.push(operator);
}

function constructOperand(input) {
    if (input.length + currentOperand.length > MAX_NUMBER_OF_DECIMALS) return;

    // Allow only one "." in an operand
    if (input === "." && currentOperand.search("\\.") > -1) return;

    // Allow only one leading "0" in an operand
    if (currentOperand.length < 2 && currentOperand[0] === "0" && input !== ".") {
        currentOperand = input;
        return;
    }

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

    return Number.isInteger(result) ? result : result.toFixed(2);
}

function evaluate() {
    addOperand();
    if (calculationState.length < MIN_CALCULATION_ITEMS) return;

    const b = +calculationState.pop();
    const operator = calculationState.pop();
    const a = +calculationState.pop();

    if (b === 0) return;

    calculationState.push(calculateExpression(a, b, operator));
}

function clearAll() {
    calculationState.length = 0;
    currentOperand = "";
}

function populateDisplay() {
    const expressionText = calculationState.reduce((prev, curr) => prev + curr, "");
    let displayText = expressionText + currentOperand;

    // Display only newly entered number in place of evaluated expression
    if (calculationState.length === 1 && currentOperand !== "" && !isOperator(currentOperand.at(-1))) {
        displayText = currentOperand;
    }

    display.textContent = displayText;

    if (displayText.length >= MAX_DISPLAY_TEXT_LENGTH) {
        display.scrollTo({left: display.scrollWidth, behavior: "instant" });
    }
}

function backspace() {
    if (currentOperand !== "") {
        currentOperand = currentOperand.substring(0, currentOperand.length - 1);
        return;
    }

    if (calculationState.length === 0) return;

    if (isOperator(calculationState.at(-1))) {
        calculationState.pop();
        return;
    }

    const operand = String(calculationState.pop());
    currentOperand = operand.substring(0, operand.length - 1);
}

function choseAction(value) {
    if ((value >= "0" && value <= "9") || value === ".") {
        constructOperand(value);
    } else if (value === "*" || value === "/" || value === "+" || value === "-") {
        addOperator(value);
    } else if (value === "escape") {
        clearAll();
    } else if (value === "backspace") {
        backspace();
    } else if (value === "=") {
        evaluate();
    }
}

function handleInput(value) {
    if (!value) return;

    const sanitizedValue = value.toLowerCase();
    choseAction(sanitizedValue)
    populateDisplay();
}

function animatePrompt() {
    if (currentOperand !== "" || calculationState.length !== 0) return;

    display.textContent = (display.textContent === "") ? "|" : "";
}

document.querySelector(".calculator-container").addEventListener("click", (e) => handleInput(e.target.dataset.value));
document.body.addEventListener("keyup", (e) => handleInput(e.key));
setInterval(animatePrompt, 600);