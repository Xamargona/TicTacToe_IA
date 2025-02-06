import { useEffect, useState } from "react";
import Square from "./Square/Square";
import ResetButton from "./ResetButton/ResetButton";
import WebCam from "../../extra/Webcam.jsx";
import "./Board.css";

const Board = () => {

    const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const { winner, winningSquares } = calculateWinner(squares);
    const nextValue = xIsNext ? "X" : "O";

    // Verificamos respuesta
    const status = winner === "X" ? "Player" : winner === "O" ? "IA" : "Draw";

    const handleClick = (i: number) => {
        alert("handleClick");
        if (nextValue === "X" && winner === null && squares[i] === null) {
            const squaresCopy = [...squares];
            squaresCopy[i] = nextValue;
            setSquares(squaresCopy);
            setXIsNext(!xIsNext);
        }
    }

    // Function for IA turn with delay
    const iaTurn = () => {
        setTimeout(() => {
            const emptyCells = squares.map((value, index) => value === null ? index : null).filter(val => val !== null);
            if (emptyCells.length > 0) {
                const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                const squaresCopy = [...squares];
                squaresCopy[randomIndex as number] = "O";
                setSquares(squaresCopy);
                setXIsNext(!xIsNext);
            }
        }, 600); 
    }

    useEffect(() => {
        if (nextValue === "O" && !winner) {
            iaTurn();
        }
    }, [squares, nextValue, winner]);

    const renderSquare = (i: number) => {
        let backgroundColor = '';
        if (winner === "X" && winningSquares.includes(i)) {
            backgroundColor = 'rgb(156, 227, 125)';
        } else if (winner === "O" && winningSquares.includes(i)) {
            backgroundColor = 'rgb(139, 38, 53)';
        } else if (winner === "Draw") {
            backgroundColor = 'rgb(188, 237, 246)';
        }
        return (
            <Square
                values={squares[i]}
                onClick={() => handleClick(i)}
                style={{ backgroundColor }}
                id={`square-${i}`}
            />
        );
    }

    const resetGame = () => {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
    }

    const handleSquareDetected = (squareId: string | null) => {
        if (squareId) {
            const index = parseInt(squareId.replace('square-', ''), 10);
            if (!isNaN(index)) {
                handleClick(index);
            }
        }
    }

    return (
        <>
            <WebCam onSquareDetected={handleSquareDetected} />
            <div className="board" id="video-target">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
            <div className="status">
                {winner !== null ? (
                    winner !== "Draw" ? (
                        <div>
                            <h3>{status} wins!!!</h3>
                        </div>
                    ) : (
                        <div>
                            <h3>{status}</h3>
                        </div>
                    )
                ) : null}
            </div>
            <ResetButton onClick={resetGame} label="Restart" />
        </>
    );

    function calculateWinner(squares: (string | null)[]): { winner: string | null, winningSquares: number[] } {
        const combos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (const combo of combos) {
            const [a, b, c] = combo;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a], winningSquares: combo };
            }
        }
        if (squares.every((square) => square !== null)) {
            return { winner: "Draw", winningSquares: [] };
        }
        return { winner: null, winningSquares: [] };
    }

}

export default Board;