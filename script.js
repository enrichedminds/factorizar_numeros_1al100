let currentNumber = 0;
let factorPairs = [];
let guessedFactors = [];
let incorrectAttempts = 0;

function nextNumber() {
    // Generar un número aleatorio entre 1 y 100
    currentNumber = Math.floor(Math.random() * 100) + 1;
    factorPairs = calculateFactors(currentNumber);
    guessedFactors = [];
    incorrectAttempts = 0;
    updateUI();
}

function calculateFactors(number) {
    const factors = [];
    for (let i = 1; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
            factors.push([i, number / i]);
        }
    }
    return factors;
}

function updateUI() {
    document.getElementById('current-number').innerText = currentNumber;
    document.getElementById('factors-container').innerHTML = '';
    document.getElementById('feedback').innerText = '';
    document.getElementById('factor1').value = '';
    document.getElementById('factor2').value = '';
}

function checkFactors() {
    const factor1 = parseInt(document.getElementById('factor1').value);
    const factor2 = parseInt(document.getElementById('factor2').value);
    const feedback = document.getElementById('feedback');

    if (isNaN(factor1) || isNaN(factor2)) {
        feedback.innerText = 'Por favor, introduce números válidos.';
        feedback.className = 'feedback-error';
        return;
    }

    const isValidPair = factorPairs.some(pair => 
        (pair[0] === factor1 && pair[1] === factor2) || 
        (pair[0] === factor2 && pair[1] === factor1)
    );

    const isGuessedPair = guessedFactors.some(pair => 
        (pair[0] === factor1 && pair[1] === factor2) || 
        (pair[0] === factor2 && pair[1] === factor1)
    );

    if (!isValidPair) {
        incorrectAttempts++;
        feedback.innerText = 'Esa combinación no es válida. Intenta de nuevo.';
        feedback.className = 'feedback-error';

        // Dar una pista tras dos intentos incorrectos
        if (incorrectAttempts >= 2) {
            const remaining = factorPairs.length - guessedFactors.length;
            feedback.innerText += ` Pista: Quedan ${remaining} combinaciones de factores.`;
            feedback.className = 'feedback-hint';
        }
        return;
    }

    if (isGuessedPair) {
        feedback.innerText = 'Ya has introducido esa combinación. Intenta con otra.';
        feedback.className = 'feedback-error';
        return;
    }

    guessedFactors.push([factor1, factor2]);
    const factorContainer = document.getElementById('factors-container');
    const factorPairElement = document.createElement('div');
    factorPairElement.className = 'factor-pair';
    factorPairElement.innerText = `${factor1} x ${factor2} = ${currentNumber}`;
    factorContainer.appendChild(factorPairElement);

    feedback.innerText = '¡Combinación correcta!';
    feedback.className = 'feedback-success';

    // Comprobar si todas las combinaciones han sido adivinadas
    if (guessedFactors.length === factorPairs.length) {
        feedback.innerText = '¡Has encontrado todas las combinaciones de factores!';
        feedback.className = 'feedback-success';
    }

    // Limpiar campos de entrada
    document.getElementById('factor1').value = '';
    document.getElementById('factor2').value = '';
}

// Inicia el juego con un número
nextNumber();