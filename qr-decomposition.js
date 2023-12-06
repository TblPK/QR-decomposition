function isValidInput(N) {
    return !isNaN(N) && parseInt(N) > 0;
}

function generateEmptyTable() {
    const N = document.getElementById('matrixSize').value;
    if (!isValidInput(N)) {
        alert('Please enter a valid positive number for N.');
        return;
    }

    const table = document.getElementById('inputMatrix');
    table.innerHTML = '';

    for (let i = 0; i < N; i++) {
        const row = table.insertRow();
        for (let j = 0; j < N; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            row.insertCell().appendChild(input);
        }
    }
}

function generateRandomTable() {
    const N = document.getElementById('matrixSize').value;
    if (!isValidInput(N)) {
        alert('Please enter a valid positive number for N.');
        return;
    }

    const table = document.getElementById('inputMatrix');
    table.innerHTML = '';

    for (let i = 0; i < N; i++) {
        const row = table.insertRow();
        for (let j = 0; j < N; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = Math.floor(Math.random() * 100);
            row.insertCell().appendChild(input);
        }
    }
}

function performQRDecomposition() {
    const N = document.getElementById('matrixSize').value;
    if (!isValidInput(N)) {
        alert('Please enter a valid positive number for N.');
        return;
    }

    const inputMatrix = [];
    const table = document.getElementById('inputMatrix');
    for (let i = 0; i < N; i++) {
        inputMatrix.push([]);
        const row = table.rows[i];
        for (let j = 0; j < N; j++) {
            const input = row.cells[j].querySelector('input');
            inputMatrix[i][j] = parseFloat(input.value);
        }
    }

    let {qMatrix, rMatrix} = QRDecomposition(inputMatrix);
    let qrMatrix = multiplyMatrices(qMatrix, rMatrix);

    displayMatrix('qMatrix', qMatrix);
    displayMatrix('rMatrix', rMatrix);
    displayMatrix('qrMatrix', qrMatrix);
}

function QRDecomposition(inputMatrix) {
    let qMatrix = inputMatrix;
    let rMatrix = inputMatrix;

    //TODO:
    return {qMatrix, rMatrix};

}

function multiplyMatrices(qMatrix, rMatrix) {
    var result = [];

    for (var i = 0; i < qMatrix.length; i++) {
        result.push([]);
        for (var j = 0; j < rMatrix[0].length; j++) {
            result[i][j] = 0;
            for (var k = 0; k < qMatrix[0].length; k++) {
                result[i][j] += qMatrix[i][k] * rMatrix[k][j];
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
            cell.textContent = matrix[i][j].toFixed(2);
        }
    }
}