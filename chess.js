// Game State Variables
let board = []; // 8x8 array representing the chess board
let selectedSquare = null; // Currently selected square
let currentPlayer = 'white'; // Current player's turn
let gameId = null; // Current game ID for multiplayer
let playerColor = null; // This player's assigned color
let gameRef = null; // Firebase database reference

// Chess piece symbols
const pieces = {
    white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
    },
    black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
    }
};

// Initialize the chess board with starting positions
function initBoard() {
    // Create an 8x8 empty board
    board = Array(8).fill(null).map(() => Array(8).fill(null));

    // Set up black pieces (top of board)
    board[0] = [
        { type: 'rook', color: 'black' },
        { type: 'knight', color: 'black' },
        { type: 'bishop', color: 'black' },
        { type: 'queen', color: 'black' },
        { type: 'king', color: 'black' },
        { type: 'bishop', color: 'black' },
        { type: 'knight', color: 'black' },
        { type: 'rook', color: 'black' }
    ];

    // Set up black pawns
    board[1] = Array(8).fill({ type: 'pawn', color: 'black' });

    // Set up white pawns
    board[6] = Array(8).fill({ type: 'pawn', color: 'white' });

    // Set up white pieces (bottom of board)
    board[7] = [
        { type: 'rook', color: 'white' },
        { type: 'knight', color: 'white' },
        { type: 'bishop', color: 'white' },
        { type: 'queen', color: 'white' },
        { type: 'king', color: 'white' },
        { type: 'bishop', color: 'white' },
        { type: 'knight', color: 'white' },
        { type: 'rook', color: 'white' }
    ];

    currentPlayer = 'white';
    renderBoard();
    updateStatus();
}

// Render the chess board on the screen
function renderBoard() {
    const boardElement = document.getElementById('chessBoard');
    boardElement.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square';

            // Alternate colors for chess board pattern
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');

            // Add piece if present
            const piece = board[row][col];
            if (piece) {
                square.textContent = pieces[piece.color][piece.type];
                square.classList.add('has-piece');
            }

            // Add click event
            square.onclick = () => handleSquareClick(row, col);

            // Store position data
            square.dataset.row = row;
            square.dataset.col = col;

            boardElement.appendChild(square);
        }
    }
}

// Handle clicking on a square
function handleSquareClick(row, col) {
    // Check if it's this player's turn in multiplayer
    if (playerColor && currentPlayer !== playerColor) {
        updateStatus("It's not your turn!");
        return;
    }

    const clickedPiece = board[row][col];

    // If no square is selected yet
    if (!selectedSquare) {
        // Only select if there's a piece of the current player
        if (clickedPiece && clickedPiece.color === currentPlayer) {
            selectedSquare = { row, col };
            highlightSquare(row, col);
            showValidMoves(row, col);
        }
    } else {
        // A square is already selected
        const fromRow = selectedSquare.row;
        const fromCol = selectedSquare.col;

        // If clicking the same square, deselect it
        if (fromRow === row && fromCol === col) {
            clearHighlights();
            selectedSquare = null;
        }
        // If clicking another piece of the same color, select that instead
        else if (clickedPiece && clickedPiece.color === currentPlayer) {
            clearHighlights();
            selectedSquare = { row, col };
            highlightSquare(row, col);
            showValidMoves(row, col);
        }
        // Try to move to the clicked square
        else if (isValidMove(fromRow, fromCol, row, col)) {
            makeMove(fromRow, fromCol, row, col);
            clearHighlights();
            selectedSquare = null;

            // Switch turns
            currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
            updateStatus();

            // Update Firebase if in multiplayer mode
            if (gameRef) {
                updateGameState();
            }
        } else {
            // Invalid move
            clearHighlights();
            selectedSquare = null;
        }
    }
}

// Check if a move is valid
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const targetPiece = board[toRow][toCol];

    // Can't capture your own piece
    if (targetPiece && targetPiece.color === piece.color) {
        return false;
    }

    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    // Check movement rules for each piece type
    switch (piece.type) {
        case 'pawn':
            return isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, targetPiece);
        case 'rook':
            return isValidRookMove(fromRow, fromCol, toRow, toCol);
        case 'knight':
            return isValidKnightMove(rowDiff, colDiff);
        case 'bishop':
            return isValidBishopMove(fromRow, fromCol, toRow, toCol);
        case 'queen':
            return isValidQueenMove(fromRow, fromCol, toRow, toCol);
        case 'king':
            return isValidKingMove(rowDiff, colDiff);
        default:
            return false;
    }
}

// Pawn movement rules
function isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, targetPiece) {
    const direction = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    // Moving forward
    if (colDiff === 0 && !targetPiece) {
        // One square forward
        if (rowDiff === direction) return true;
        // Two squares forward from starting position
        if (fromRow === startRow && rowDiff === 2 * direction) {
            // Check if path is clear
            const middleRow = fromRow + direction;
            return !board[middleRow][fromCol];
        }
    }

    // Capturing diagonally
    if (colDiff === 1 && rowDiff === direction && targetPiece) {
        return true;
    }

    return false;
}

// Rook movement rules (straight lines)
function isValidRookMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow !== toRow && fromCol !== toCol) return false;
    return isPathClear(fromRow, fromCol, toRow, toCol);
}

// Knight movement rules (L-shape)
function isValidKnightMove(rowDiff, colDiff) {
    return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
           (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);
}

// Bishop movement rules (diagonals)
function isValidBishopMove(fromRow, fromCol, toRow, toCol) {
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
    return isPathClear(fromRow, fromCol, toRow, toCol);
}

// Queen movement rules (rook + bishop)
function isValidQueenMove(fromRow, fromCol, toRow, toCol) {
    return isValidRookMove(fromRow, fromCol, toRow, toCol) ||
           isValidBishopMove(fromRow, fromCol, toRow, toCol);
}

// King movement rules (one square in any direction)
function isValidKingMove(rowDiff, colDiff) {
    return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
}

// Check if path between two squares is clear
function isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        if (board[currentRow][currentCol]) return false;
        currentRow += rowStep;
        currentCol += colStep;
    }

    return true;
}

// Make a move on the board
function makeMove(fromRow, fromCol, toRow, toCol) {
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = null;
    renderBoard();
}

// Highlight selected square
function highlightSquare(row, col) {
    const squares = document.querySelectorAll('.square');
    const index = row * 8 + col;
    squares[index].classList.add('selected');
}

// Show valid moves for selected piece
function showValidMoves(row, col) {
    const squares = document.querySelectorAll('.square');

    for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(row, col, toRow, toCol)) {
                const index = toRow * 8 + toCol;
                squares[index].classList.add('valid-move');
            }
        }
    }
}

// Clear all highlights
function clearHighlights() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.remove('selected', 'valid-move');
    });
}

// Update game status message
function updateStatus(customMessage) {
    const statusElement = document.getElementById('statusMessage');
    if (customMessage) {
        statusElement.textContent = customMessage;
    } else {
        const turnText = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
        statusElement.textContent = `${turnText}'s turn`;

        // Update turn indicator
        const turnIndicator = document.getElementById('turnIndicator');
        if (turnIndicator) {
            if (playerColor && currentPlayer === playerColor) {
                turnIndicator.textContent = 'Your Turn';
                turnIndicator.style.background = '#4ade80';
            } else if (playerColor) {
                turnIndicator.textContent = "Opponent's Turn";
                turnIndicator.style.background = '#f87171';
            } else {
                turnIndicator.textContent = `${turnText}'s Turn`;
            }
        }
    }
}

// Create a new game
function createGame() {
    gameId = generateGameId();
    playerColor = 'white';

    document.getElementById('gameIdText').textContent = gameId;
    document.getElementById('gameIdDisplay').style.display = 'block';

    // Initialize Firebase reference
    if (typeof firebase !== 'undefined' && firebase.database) {
        gameRef = firebase.database().ref('games/' + gameId);

        // Set initial game state
        gameRef.set({
            board: board,
            currentPlayer: currentPlayer,
            players: {
                white: true,
                black: false
            },
            createdAt: Date.now()
        });

        // Listen for opponent joining
        gameRef.child('players/black').on('value', (snapshot) => {
            if (snapshot.val() === true) {
                startMultiplayerGame();
            }
        });
    } else {
        alert('Multiplayer not configured. See SETUP.md for instructions.');
    }

    initBoard();
}

// Show join game input
function showJoinGame() {
    document.getElementById('joinGameSection').style.display = 'block';
}

// Join an existing game
function joinGame() {
    const inputGameId = document.getElementById('gameIdInput').value.trim().toUpperCase();

    if (!inputGameId) {
        alert('Please enter a game ID');
        return;
    }

    if (typeof firebase !== 'undefined' && firebase.database) {
        gameId = inputGameId;
        gameRef = firebase.database().ref('games/' + gameId);

        // Check if game exists
        gameRef.once('value').then((snapshot) => {
            if (snapshot.exists()) {
                const gameData = snapshot.val();

                // Check if black player spot is available
                if (!gameData.players.black) {
                    playerColor = 'black';

                    // Update that black player has joined
                    gameRef.child('players/black').set(true);

                    startMultiplayerGame();
                } else {
                    alert('This game is already full!');
                }
            } else {
                alert('Game not found! Check the Game ID.');
            }
        });
    } else {
        alert('Multiplayer not configured. See SETUP.md for instructions.');
    }
}

// Start the multiplayer game
function startMultiplayerGame() {
    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('currentGameId').textContent = gameId;
    document.getElementById('playerColor').textContent = playerColor.charAt(0).toUpperCase() + playerColor.slice(1);

    // Listen for game state changes
    gameRef.on('value', (snapshot) => {
        const gameData = snapshot.val();
        if (gameData) {
            board = gameData.board;
            currentPlayer = gameData.currentPlayer;
            renderBoard();
            updateStatus();
        }
    });
}

// Update game state in Firebase
function updateGameState() {
    if (gameRef) {
        gameRef.update({
            board: board,
            currentPlayer: currentPlayer
        });
    }
}

// Generate random game ID
function generateGameId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// Copy game ID to clipboard
function copyGameId() {
    const gameIdText = document.getElementById('gameIdText').textContent;
    navigator.clipboard.writeText(gameIdText).then(() => {
        alert('Game ID copied to clipboard!');
    });
}

// Reset/New game
function resetGame() {
    if (confirm('Start a new game? This will return to the main menu.')) {
        // Clean up Firebase listeners
        if (gameRef) {
            gameRef.off();
            gameRef = null;
        }

        gameId = null;
        playerColor = null;
        selectedSquare = null;

        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('setupScreen').style.display = 'block';
        document.getElementById('gameIdDisplay').style.display = 'none';
        document.getElementById('joinGameSection').style.display = 'none';
        document.getElementById('gameIdInput').value = '';

        initBoard();
    }
}

// Initialize the game when page loads
window.onload = function() {
    initBoard();
};
