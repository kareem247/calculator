const display = document.getElementById("display");
let justCalculated = false; 

function appendValue(value) {
    // If last action was a calculation and user types a digit, dot, or a function (letters, √, π, e, or opening paren), start a new input
    if (justCalculated && (/^[0-9.]$/.test(value) || /^[a-zπe√(]/i.test(value))) {
        display.textContent = value;
        justCalculated = false;
        return;
    }

    // Replace leading zero (but allow starting with an operator when appropriate)
    if (display.textContent === "0" && !/^[+\-*/^]$/.test(value)) {
        display.textContent = value;
    } else {
        display.textContent += value;
    }
    justCalculated = false;
} 

function clearDisplay() {
    display.textContent = "0";
    justCalculated = false;
}  

function deleteLast() {
    const txt = display.textContent.slice(0, -1);
    display.textContent = txt === "" ? "0" : txt;
    justCalculated = false;
}  

// Convert degrees to radians
function toRadians(deg) {
    return deg * Math.PI / 180;
}

// Balance unmatched parentheses
function balanceParentheses(exp) {
    const open = (exp.match(/\(/g) || []).length;
    const close = (exp.match(/\)/g) || []).length;
    if (open > close) {
        return exp + ")".repeat(open - close);
    }
    return exp;
}

// Factorial (x!)
function factorial() {
    try {
        let exp = balanceParentheses(display.textContent);
        let n = eval(exp);

        if (n < 0 || !Number.isInteger(n)) {
            display.textContent = "Error";
            justCalculated = true;
            return;
        }

        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        display.textContent = String(result);
        justCalculated = true;
    } catch (e) {
        display.textContent = "Error";
        justCalculated = true;
    }
} 

function calculate() {
    try {
        let exp = display.textContent;

        // Auto-close brackets
        exp = balanceParentheses(exp);

        // Constants
        exp = exp.replace(/π/g, "Math.PI");
        exp = exp.replace(/\be\b/g, "Math.E");

        // Square root
        exp = exp.replace(/√\(/g, "Math.sqrt(");

        // Trigonometric functions (degrees)
        exp = exp.replace(/sin\(([^)]+)\)/g, "Math.sin(toRadians($1))");
        exp = exp.replace(/cos\(([^)]+)\)/g, "Math.cos(toRadians($1))");
        exp = exp.replace(/tan\(([^)]+)\)/g, "Math.tan(toRadians($1))");

        // Logarithmic functions
        exp = exp.replace(/log\(([^)]+)\)/g, "Math.log10($1)");
        exp = exp.replace(/ln\(([^)]+)\)/g, "Math.log($1)");

        // Powers
        exp = exp.replace(/\^/g, "**");

        const result = eval(exp);
        display.textContent = String(result);
        justCalculated = true;
    } catch (e) {
        display.textContent = "Error";
        justCalculated = true;
    }
}
