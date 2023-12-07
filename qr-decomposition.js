function isValidInput(N, M) {
    return !isNaN(N) && parseInt(N) > 0 && !isNaN(M) && parseInt(M) > 0;
}

function generateTable(isRandom) {
    const N = document.getElementById('matrixSizeN').value;
    const M = document.getElementById('matrixSizeM').value;
    if (!isValidInput(N, M)) {
        alert('Please enter a valid positive number for N and M.');
        return;
    }

    const table = document.getElementById('inputMatrix');
    table.innerHTML = '';

    for (let i = 0; i < N; i++) {
        const row = table.insertRow();
        for (let j = 0; j < M; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            if (isRandom) {
                input.value = Math.floor((Math.random() - 0.5) * 100); // [-50, 50]
            }
            row.insertCell().appendChild(input);
        }
    }
}

function performQRDecomposition() {
    const N = document.getElementById('matrixSizeN').value;
    const M = document.getElementById('matrixSizeM').value;
    if (!isValidInput(N, M)) {
        alert('Please enter a valid positive number for N and M.');
        return;
    }

    const inputMatrix = [];
    const table = document.getElementById('inputMatrix');
    for (let i = 0; i < N; i++) {
        inputMatrix[i] = [];
        const input = table.rows[i].cells;
        for (let j = 0; j < M; j++) {
            const el = input[j].querySelector('input').value;
            inputMatrix[i][j] = parseFloat(el);
        }
    }

    let [ qMatrix, rMatrix ] = QRGivens(inputMatrix, N, M);
    let qrMatrix = multiplyMatrices(qMatrix, rMatrix);

    displayMatrix('qMatrix', qMatrix);
    displayMatrix('rMatrix', rMatrix);
    displayMatrix('qrMatrix', qrMatrix);
}

function QRGivens(A, N, M) {
    let Q = eye(N);
    let R = A.map(a => ([...a])); // deep copy

    for(let j = 0; j < M - 1; j++) {
        for (let i = N - 1; i > j; i--) {
            let G = eye(N);
            let {c, s} = givensRotation(R[i-1][j], R[i][j]);
            G[i - 1][i - 1] = c;
            G[i - 1][i] = -s;
            G[i][i - 1] = s;
            G[i][i] = c;
            let tG = G[0].map((_, colIndex) => G.map(row => row[colIndex])); // transpose
            R = multiplyMatrices(tG, R);
            Q = multiplyMatrices(Q, G);
        }
    }

    return [Q, R];
}

function givensRotation(a, b) {
    let c = 1;
    let s = 0;
    if (b != 0) {
        if (Math.abs(b) > Math.abs(a)) {
            let r = a / b;
            s = 1 / Math.sqrt(1 + Math.pow(r, 2));
            c = s * r;
        } else {
            let r = b / a;
            c = 1 / Math.sqrt(1 + Math.pow(r, 2));
            s = c * r;
        }
    }
    return {c, s}
}

function eye(N) {
    const identityMatrix = [];

    for (let i = 0; i < N; i++) {
        identityMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            identityMatrix[i][j] = (i == j ? 1 : 0);
        }
    }

    return identityMatrix;
}

function multiplyMatrices(matrixA, matrixB) {
    let result = [];

    if (matrixA[0].length !== matrixB.length) {
        console.error("Invalid matrix dimensions for multiplication");
        return result;
    }

    for (let i = 0; i < matrixA.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrixB[0].length; j++) {
            result[i][j] = 0;
            for (let k = 0; k < matrixA[0].length; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
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