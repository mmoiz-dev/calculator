// Basic math functions
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    if (b === 0) return 'Nice try!';
    return a / b;
}

function roundResult(num) {
    return Math.round(num * 100000) / 100000;
}

function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    switch (operator) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case '*': return multiply(a, b);
        case '/': return divide(a, b);
        default: return null;
    }
}

// Calculator state
let firstNumber = '';
let secondNumber = '';
let currentOperator = null;
let shouldResetDisplay = false;

const display = document.getElementById('display');
const digitButtons = document.querySelectorAll('.digit');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const decimalButton = document.getElementById('decimal');
const backspaceButton = document.getElementById('backspace');

// Event listeners

digitButtons.forEach(button =>
    button.addEventListener('click', () => appendDigit(button.dataset.digit))
);

operatorButtons.forEach(button =>
    button.addEventListener('click', () => setOperator(button.dataset.operator))
);

equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
decimalButton.addEventListener('click', appendDecimal);
backspaceButton.addEventListener('click', backspace);

document.addEventListener('keydown', handleKeyboardInput);

function appendDigit(digit) {
    if (display.textContent === '0' || shouldResetDisplay) resetDisplay();
    display.textContent += digit;
}

function resetDisplay() {
    display.textContent = '';
    shouldResetDisplay = false;
}

function clear() {
    display.textContent = '0';
    firstNumber = '';
    secondNumber = '';
    currentOperator = null;
    shouldResetDisplay = false;
    decimalButton.disabled = false;
}

function appendDecimal() {
    if (shouldResetDisplay) resetDisplay();
    if (display.textContent.includes('.')) return;
    if (display.textContent === '') display.textContent = '0';
    display.textContent += '.';
    decimalButton.disabled = true;
}

function setOperator(operator) {
    if (currentOperator !== null) {
        if (shouldResetDisplay) {
            currentOperator = operator;
            return;
        }
        evaluate();
    }
    firstNumber = display.textContent;
    currentOperator = operator;
    shouldResetDisplay = true;
    decimalButton.disabled = false;
}

function evaluate() {
    if (currentOperator === null || shouldResetDisplay) return;
    secondNumber = display.textContent;
    let result = operate(currentOperator, firstNumber, secondNumber);
    if (result === 'Nice try!') {
        display.textContent = result;
    } else {
        display.textContent = roundResult(result);
    }
    firstNumber = display.textContent;
    currentOperator = null;
    shouldResetDisplay = true;
    decimalButton.disabled = false;
}

function backspace() {
    if (shouldResetDisplay) return;
    display.textContent = display.textContent.slice(0, -1) || '0';
    if (!display.textContent.includes('.')) decimalButton.disabled = false;
}

function handleKeyboardInput(e) {
    if (e.key >= '0' && e.key <= '9') appendDigit(e.key);
    if (e.key === '.') appendDecimal();
    if (e.key === '=' || e.key === 'Enter') evaluate();
    if (e.key === 'Backspace') backspace();
    if (e.key === 'Escape') clear();
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') setOperator(e.key);
}

// Disable decimal if already present
const observer = new MutationObserver(() => {
    decimalButton.disabled = display.textContent.includes('.');
});
observer.observe(display, { childList: true });

// Initialize
clear(); 