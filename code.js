const operators = ["+", "-", "/", "*"];
let box = null;
let lastOperation = null;
let operator = null;
let equal = null;
let dot = null;
let firstNum = true;
let numbers = [];
let operator_value;
let last_operator;
let total;

function buttonNumber(button) {
    operator = document.getElementsByClassName("operator");
    box = document.getElementById("box");
    lastOperation = document.getElementById("lastOperation");
    equal = document.getElementById("equalSign").value;
    dot = document.getElementById("dot").value;
    if (!operators.includes(button) && button != equal) {
        if (firstNum) {
            box.innerText = button == dot ? "0" + dot : button;
            firstNum = false;
        } else {
            if (box.innerText.length == 1 && box.innerText == 0 && button != dot) return;
            if (box.innerText.includes(dot) && button == dot) return;
            if (box.innerText.length == 20) return;
            box.innerText += button;
        }
    } else {
        if (operator_value != null && button == operator_value) return;
        if (button == "-" && box.innerText == 0) {
            box.innerText = button;
            firstNum = false;
            operator_value = button;
            showSelectedOperator();
            return;
        }
        if (operators.includes(button)) {
            if (typeof last_operator != "undefined" && last_operator != null) calc_operator = last_operator;
            else calc_operator = button;
            last_operator = button == "*" ? "×" : button == "/" ? "÷" : button;
            operator_value = button;
            firstNum = true;
            showSelectedOperator();
        }
        if (numbers.length == 0) {
            numbers.push(box.innerText);
            if (typeof last_operator != "undefined" && last_operator != null) lastOperation.innerText = box.innerText + " " + last_operator;
        } else {
            if (numbers.length == 1) numbers[1] = box.innerText;
            let temp_num = box.innerText;
            if (button == equal && calc_operator != null) {
                total = calculate(numbers[0], numbers[1], calc_operator);
                box.innerText = total;
                if (!lastOperation.innerText.includes("=")) lastOperation.innerText += " " + numbers[1] + " =";
                temp_num = numbers[0];
                numbers[0] = total;
                operator_value = null;
                showSelectedOperator();
                const history_arr = lastOperation.innerText.split(" ");
                history_arr[0] = temp_num;
                lastOperation.innerText = history_arr.join(" ");
            } else if (calc_operator != null) {
                lastOperation.innerText = temp_num + " " + last_operator;
                calc_operator = button;
                numbers = [];
                numbers.push(box.innerText);
            }
        }
    }
}

function showSelectedOperator() {
    const elements = document.getElementsByClassName("operator");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "#e68a00";
    }
    if (operator_value) document.getElementById(operator_value == "+" ? "plusOp" : operator_value == "-" ? "subOp" : operator_value == "*" ? "multiOp" : "divOp").style.backgroundColor = "#ffd11a";
}

function calculate(num1, num2, operator) {
    switch (operator) {
        case "+": total = parseFloat(num1) + parseFloat(num2); break;
        case "-": total = parseFloat(num1) - parseFloat(num2); break;
        case "*": total = parseFloat(num1) * parseFloat(num2); break;
        case "/": total = parseFloat(num1) / parseFloat(num2); break;
        default: return box.innerText == total ? total : box.innerText;
    }
    if (!Number.isInteger(total)) total = total.toPrecision(12);
    return parseFloat(total);
}

function button_clear() {
    window.location.reload();
}

function backspaceRemove() {
    box = document.getElementById("box");
    const elements = document.getElementsByClassName("operator");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "#e68a00";
    }
    const last_num = box.innerText.slice(0, -1);
    box.innerText = last_num;
    if (!box.innerText.length) {
        box.innerText = 0;
        firstNum = true;
    }
}

function plus_minus() {
    box = document.getElementById("box");
    if (typeof last_operator != "undefined") {
        if (numbers.length > 0) {
            if (operators.includes(last_button)) {
                if (box.innerText == "-") {
                    box.innerText = 0;
                    firstNum = true;
                    return;
                } else {
                    box.innerText = "-";
                    firstNum = false;
                }
            } else {
                box.innerText = -box.innerText;
                if (numbers.length == 1) numbers[0] = box.innerText;
                else numbers[1] = box.innerText;
            }
        }
        return;
    }
    if (box.innerText == 0) {
        box.innerText = "-";
        firstNum = false;
        return;
    }
    box.innerText = -box.innerText;
}

function clear_entry() {
    box = document.getElementById("box");
    if (numbers.length > 0 && typeof last_operator != "undefined") {
        box.innerText = 0;
        const temp = numbers[0];
        numbers = [];
        numbers.push(temp);
        firstNum = true;
    }
}

document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyReleased);

function keyPressed(e) {
    e.preventDefault();
    const equal = document.getElementById("equalSign").value;
    const dot = document.getElementById("dot").value;
    if (e.key == "Delete") {
        button_clear();
        return;
    }
    const isNumber = isFinite(e.key);
    let enterPress;
    let dotPress;
    let commaPress = false;
    if (e.key == "Enter") enterPress = equal;
    if (e.key == ".") dotPress = dot;
    if (e.key == ",") commaPress = true;
    if (isNumber || operators.includes(e.key) || e.key == enterPress || e.key == dotPress || commaPress || e.key == "Backspace") {
        if (e.key == "Enter") buttonNumber(enterPress);
        else if (e.key == "Backspace") {
            document.getElementById("backspaceButton").style.backgroundColor = "#999999";
            backspaceRemove();
        } else if (commaPress) buttonNumber(dot);
        else buttonNumber(e.key);
    }
}

function keyReleased(e) {
    if (keyCombination['ControlLeft'] && keyCombination['KeyV']) {
        navigator.clipboard.readText().then(text => {
            box = document.getElementById("box");
            const isNumber = isFinite(text);
            if (isNumber) {
                const copyNumber = text;
                firstNum = true;
                buttonNumber(copyNumber);
            }
        }).catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
    }
    if (keyCombination['ControlLeft'] && keyCombination['KeyC']) {
        box = document.getElementById("box");
        navigator.clipboard.writeText(box.innerText);
    }
    keyCombination = [];
    e.preventDefault();
    if (e.key == "Backspace") document.getElementById("backspaceButton").style.backgroundColor = "#666666";
}