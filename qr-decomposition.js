function isValidInput(n) {
    return !isNaN(n) && 0 < parseInt(n) && parseInt(n) < 25 && !Number.isInteger(n);
} 

function generateTable(isRandom) {
    const numRows = document.getElementById('numRows').value;
    const numColumns = document.getElementById('numColumns').value;
    const errorM = document.getElementById('error');

    if (!isValidInput(numRows) || !isValidInput(numColumns)) {
        errorM.innerHTML = 'Please enter a valid positive number for rows and columns.';
        return;
    }
    errorM.innerHTML = '';

    const table = document.getElementById('inputMatrix');
    table.innerHTML = '';
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    for (let i = 0; i < numRows; i++) {
        const row = table.insertRow();
        for (let j = 0; j < numColumns; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            if (isRandom) input.value = getRandomInt(-50, 50);
            row.insertCell().appendChild(input);
        }
    }
}

function performQRDecomposition() {
    const numRows = document.getElementById('numRows').value;
    const numColumns = document.getElementById('numColumns').value;
    const errorM = document.getElementById('error');

    if (!isValidInput(numRows) || !isValidInput(numColumns)) {
        errorM.innerHTML = 'Please enter a valid positive number for rows and columns.';
        return;
    }
    errorM.innerHTML = '';

    const inputMatrix = [];
    const table = document.getElementById('inputMatrix');
    for (let i = 0; i < numRows; i++) {
        inputMatrix[i] = [];
        const input = table.rows[i].cells;
        for (let j = 0; j < numColumns; j++) {
            const el = input[j].querySelector('input');
            inputMatrix[i][j] = parseFloat(el.value);
        }
    }

    let [Q, R] = QRGivens(inputMatrix, numRows, numColumns);
    let QR = multiplyMatrices(Q, R);

    displayMatrix('qMatrix', Q);
    displayMatrix('rMatrix', R);
    displayMatrix('qrMatrix', QR);
}

function QRGivens(matrix, numRows, numColumns) {
    let Q = eye(numRows);
    let R = matrix.map(row => ([...row]));

    for (let j = 0; j < numColumns; j++) {
        for (let i = numRows - 1; i > j; i--) {
            let G = eye(numRows);
            let { c, s } = givensRotation(R[i - 1][j], R[i][j]);
            G[i - 1][i - 1] = c;
            G[i - 1][i] = -s;
            G[i][i - 1] = s;
            G[i][i] = c;
            Q = multiplyMatrices(Q, G);
            G = G[0].map((_, colIndex) => G.map(row => row[colIndex])); // transpose
            R = multiplyMatrices(G, R);
        }
    }

    return [Q, R];
}

function givensRotation(a, b) {
    let c = 1;
    let s = 0;
    if (b !== 0) {
        let r = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        c = a / r;
        s = b / r;
    }
    return { c, s };
}

function eye(size) {
    return Array.from({ length: size }, (_, i) => Array.from({ length: size }, (_, j) => (i === j ? 1 : 0)));
}

function multiplyMatrices(A, B) {
    let result = [];

    if (A[0].length !== B.length) throw new Error("Invalid matrix dimensions for multiplication");

    for (let i = 0; i < A.length; i++) {
        result[i] = [];
        for (let j = 0; j < B[0].length; j++) {
            result[i][j] = 0;
            for (let k = 0; k < A[0].length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return result;
}

function displayMatrix(matrixId, matrix) {
    const table = document.getElementById(matrixId);
    table.innerHTML = '';

    for (let i = 0; i < matrix.length; i++) {
        const row = table.insertRow();
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = row.insertCell();
            cell.textContent = matrix[i][j].toFixed(4);
        }
    }
}