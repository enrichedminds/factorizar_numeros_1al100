let currentNumber = 0;
let factorPairs = [];
let guessedFactors = [];
let incorrectAttempts = 0;
const maxAttempts = 4;

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
    document.getElementById('remaining-attempts').innerText = maxAttempts - incorrectAttempts;
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

    const isRepeatedPair = guessedFactors.some(pair => 
        (pair[0] === factor1 && pair[1] === factor2) || 
        (pair[0] === factor2 && pair[1] === factor1)
    );

    if (isRepeatedPair) {
        feedback.innerText = 'Ya has introducido esa combinación. Intenta con otra.';
        feedback.className = 'feedback-error';
        return;
    }

    const isValidPair = factorPairs.some(pair => 
        (pair[0] === factor1 && pair[1] === factor2) || 
        (pair[0] === factor2 && pair[1] === factor1)
    );

    if (!isValidPair) {
        incorrectAttempts++;
        guessedFactors.push([factor1, factor2]); // Registrar combinación incorrecta
        feedback.innerText = 'Esa combinación no es válida. Intenta de nuevo.';
        feedback.className = 'feedback-error';

        // Actualizar intentos restantes
        document.getElementById('remaining-attempts').innerText = maxAttempts - incorrectAttempts;

        // Mostrar pista exactamente después de 2 intentos incorrectos
        if (incorrectAttempts === 2) {
            const remaining = factorPairs.length - guessedFactors.filter(pair =>
                factorPairs.some(validPair =>
                    (pair[0] === validPair[0] && pair[1] === validPair[1]) ||
                    (pair[0] === validPair[1] && pair[1] === validPair[0])
                )
            ).length;

            feedback.innerText += ` Pista: Quedan ${remaining} combinaciones de factores.`;
            feedback.className = 'feedback-hint';
        }

        // Mostrar factores faltantes tras 4 intentos incorrectos
        if (incorrectAttempts >= maxAttempts) {
            const remainingFactors = factorPairs.filter(pair => 
                !guessedFactors.some(guessed =>
                    (pair[0] === guessed[0] && pair[1] === guessed[1]) ||
                    (pair[0] === guessed[1] && pair[1] === guessed[0])
                )
            );

            feedback.innerText = `Has alcanzado ${maxAttempts} intentos fallidos. Los factores que faltaron son: ${remainingFactors.map(pair => `${pair[0]} x ${pair[1]}`).join(', ')}. Cambiando al siguiente número...`;
            feedback.className = 'feedback-error';

            // Cambiar al siguiente problema después de mostrar los factores faltantes
            setTimeout(nextNumber, 3000);
        }
        return;
    }

    // Registrar combinación correcta
    guessedFactors.push([factor1, factor2]);
    const factorContainer = document.getElementById('factors-container');
    const factorPairElement = document.createElement('div');
    factorPairElement.className = 'factor-pair';
    factorPairElement.innerText = `${factor1} x ${factor2} = ${currentNumber}`;
    factorContainer.appendChild(factorPairElement);

    feedback.innerText = '¡Combinación correcta!';
    feedback.className = 'feedback-success';

    // Comprobar si todas las combinaciones han sido adivinadas
    if (guessedFactors.filter(pair =>
        factorPairs.some(validPair =>
            (pair[0] === validPair[0] && pair[1] === validPair[1]) ||
            (pair[0] === validPair[1] && pair[1] === validPair[0])
        )
    ).length === factorPairs.length) {
        feedback.innerText = '¡Has encontrado todas las combinaciones de factores! Cambiando al siguiente número...';
        feedback.className = 'feedback-success';

        // Cambiar al siguiente problema después de completar correctamente
        setTimeout(nextNumber, 3000);
    }

    // Limpiar campos de entrada
    document.getElementById('factor1').value = '';
    document.getElementById('factor2').value = '';
}

// Inicia el juego con un número
nextNumber();