import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type BoardRow = string[];
type Board = BoardRow[];
type Player = "white" | "black";

interface GameState {
  board: Board;
  turn: Player;
  selected: [number, number] | null;
  moves: string[];
  capturedByWhite: string[];
  capturedByBlack: string[];
  moveCount: number;
  status: "playing" | "resigned";
  resignedBy: Player | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const WHITE_PIECES = new Set(["♙", "♖", "♘", "♗", "♕", "♔"]);
const BLACK_PIECES = new Set(["♟", "♜", "♞", "♝", "♛", "♚"]);
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

function createInitialBoard(): Board {
  return [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
  ];
}

function createInitialState(): GameState {
  return {
    board: createInitialBoard(),
    turn: "white",
    selected: null,
    moves: [],
    capturedByWhite: [],
    capturedByBlack: [],
    moveCount: 1,
    status: "playing",
    resignedBy: null,
  };
}

function toAlgebraic(row: number, col: number): string {
  return `${FILES[col]}${8 - row}`;
}

function pieceOwner(piece: string): Player | null {
  if (WHITE_PIECES.has(piece)) return "white";
  if (BLACK_PIECES.has(piece)) return "black";
  return null;
}

function getPieceLabel(piece: string): string {
  const labels: Record<string, string> = {
    "♙": "P",
    "♖": "R",
    "♘": "N",
    "♗": "B",
    "♕": "Q",
    "♔": "K",
    "♟": "p",
    "♜": "r",
    "♞": "n",
    "♝": "b",
    "♛": "q",
    "♚": "k",
  };
  return labels[piece] ?? piece;
}

// ─── ChessBoard Component ──────────────────────────────────────────────────────
function ChessBoard({
  board,
  selected,
  turn,
  onCellClick,
  disabled,
}: {
  board: Board;
  selected: [number, number] | null;
  turn: Player;
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
}) {
  return (
    <div
      className="relative"
      style={{
        background: "oklch(var(--chess-frame))",
        padding: "clamp(12px, 2vw, 24px)",
        borderRadius: "4px",
        boxShadow:
          "0 8px 40px oklch(0 0 0 / 0.7), 0 2px 8px oklch(0 0 0 / 0.4)",
      }}
    >
      {/* Coordinate labels top */}
      <div
        className="flex mb-0.5"
        style={{ paddingLeft: "clamp(16px, 2.5vw, 28px)" }}
      >
        {FILES.map((f) => (
          <div
            key={f}
            className="flex-1 text-center text-xs font-sans font-semibold"
            style={{ color: "oklch(var(--gold-dim))" }}
          >
            {f}
          </div>
        ))}
      </div>

      <div className="flex">
        {/* Rank labels left */}
        <div
          className="flex flex-col"
          style={{ width: "clamp(16px, 2.5vw, 28px)" }}
        >
          {RANKS.map((rank) => (
            <div
              key={rank}
              className="flex-1 flex items-center justify-center text-xs font-sans font-semibold"
              style={{ color: "oklch(var(--gold-dim))" }}
            >
              {rank}
            </div>
          ))}
        </div>

        {/* Board grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(8, 1fr)",
            gridTemplateRows: "repeat(8, 1fr)",
            width: "min(56vw, 480px)",
            height: "min(56vw, 480px)",
            border: "3px solid oklch(var(--chess-frame-inner))",
          }}
        >
          {board.map((row, rIdx) =>
            row.map((piece, cIdx) => {
              const isLight = (rIdx + cIdx) % 2 === 0;
              const isSelected =
                selected !== null &&
                selected[0] === rIdx &&
                selected[1] === cIdx;
              const owner = pieceOwner(piece);
              const isCurrentPlayerPiece = owner === turn;
              const cellKey = `${rIdx}-${cIdx}`;

              const handleClick = () => {
                if (!disabled) onCellClick(rIdx, cIdx);
              };

              return (
                <button
                  type="button"
                  key={cellKey}
                  aria-label={`${toAlgebraic(rIdx, cIdx)}${piece !== "." ? ` ${piece}` : ""}`}
                  data-ocid={`board.cell.${rIdx * 8 + cIdx + 1}`}
                  className={`chess-board-cell ${
                    isLight ? "chess-light" : "chess-dark"
                  } ${isSelected ? "chess-selected" : ""}`}
                  style={{
                    cursor: disabled
                      ? "default"
                      : isCurrentPlayerPiece || selected !== null
                        ? "pointer"
                        : "default",
                  }}
                  onClick={handleClick}
                >
                  {piece !== "." && (
                    <span
                      className="chess-piece"
                      style={{
                        fontSize: "clamp(20px, 4vw, 36px)",
                        filter: isSelected
                          ? "drop-shadow(0 0 6px oklch(65 0.2 85))"
                          : "none",
                      }}
                    >
                      {piece}
                    </span>
                  )}
                </button>
              );
            }),
          )}
        </div>

        {/* Rank labels right */}
        <div
          className="flex flex-col"
          style={{ width: "clamp(16px, 2.5vw, 28px)" }}
        >
          {RANKS.map((rank) => (
            <div
              key={rank}
              className="flex-1 flex items-center justify-center text-xs font-sans font-semibold"
              style={{ color: "oklch(var(--gold-dim))" }}
            >
              {rank}
            </div>
          ))}
        </div>
      </div>

      {/* Coordinate labels bottom */}
      <div
        className="flex mt-0.5"
        style={{ paddingLeft: "clamp(16px, 2.5vw, 28px)" }}
      >
        {FILES.map((f) => (
          <div
            key={f}
            className="flex-1 text-center text-xs font-sans font-semibold"
            style={{ color: "oklch(var(--gold-dim))" }}
          >
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [game, setGame] = useState<GameState>(createInitialState);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (game.status !== "playing") return;

      setGame((prev) => {
        const piece = prev.board[row][col];
        const owner = pieceOwner(piece);

        // Case 1: nothing selected
        if (prev.selected === null) {
          if (owner === prev.turn) {
            return { ...prev, selected: [row, col] };
          }
          return prev;
        }

        const [selRow, selCol] = prev.selected;

        // Case 2: clicking same cell → deselect
        if (selRow === row && selCol === col) {
          return { ...prev, selected: null };
        }

        // Case 3: clicking another own piece → re-select
        if (owner === prev.turn) {
          return { ...prev, selected: [row, col] };
        }

        // Case 4: move
        const movingPiece = prev.board[selRow][selCol];
        const targetPiece = prev.board[row][col];
        const newBoard = prev.board.map((r) => [...r]);
        newBoard[selRow][selCol] = ".";
        newBoard[row][col] = movingPiece;

        const notation = `${getPieceLabel(movingPiece)} ${toAlgebraic(selRow, selCol)} → ${toAlgebraic(row, col)}`;

        const newCapturedByWhite = [...prev.capturedByWhite];
        const newCapturedByBlack = [...prev.capturedByBlack];
        if (targetPiece !== ".") {
          if (prev.turn === "white") {
            newCapturedByWhite.push(targetPiece);
          } else {
            newCapturedByBlack.push(targetPiece);
          }
        }

        return {
          ...prev,
          board: newBoard,
          turn: prev.turn === "white" ? "black" : "white",
          selected: null,
          moves: [...prev.moves, notation],
          capturedByWhite: newCapturedByWhite,
          capturedByBlack: newCapturedByBlack,
          moveCount:
            prev.turn === "black" ? prev.moveCount + 1 : prev.moveCount,
        };
      });
    },
    [game.status],
  );

  const handleReset = () => {
    setGame(createInitialState());
  };

  const handleResign = () => {
    setGame((prev) => ({
      ...prev,
      status: "resigned",
      resignedBy: prev.turn,
    }));
  };

  const currentPlayer = game.turn === "white" ? "Player 1" : "Player 2";
  const matchNumber = 1024;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(38 0.02 80)" }}
    >
      {/* ── Header ── */}
      <header
        className="w-full px-6 py-3 flex items-center justify-between"
        style={{
          background: "oklch(var(--header-bg))",
          borderBottom: "1px solid oklch(75 0.05 80)",
        }}
        data-ocid="nav.panel"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl" style={{ lineHeight: 1 }}>
            ♜
          </span>
          <span
            className="font-serif font-bold text-xl tracking-tight"
            style={{ color: "oklch(20 0.01 80)" }}
          >
            Chess Arena
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {["PLAY", "ANALYSIS", "COMMUNITY", "MY GAMES", "HELP"].map((item) => (
            <button
              key={item}
              type="button"
              data-ocid={`nav.${item.toLowerCase().replace(" ", "_")}.link`}
              className={`text-xs font-sans font-semibold tracking-wider transition-colors ${
                item === "PLAY" ? "border-b-2 pb-0.5" : "hover:opacity-70"
              }`}
              style={{
                color:
                  item === "PLAY"
                    ? "oklch(var(--chess-frame))"
                    : "oklch(40 0.01 80)",
                borderColor:
                  item === "PLAY" ? "oklch(var(--chess-frame))" : "transparent",
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Status Bar ── */}
      <div
        className="w-full px-6 py-2"
        style={{ background: "oklch(var(--status-bar-bg))" }}
      >
        <div
          className="max-w-6xl mx-auto flex items-center gap-1 rounded-lg px-3 py-1.5"
          style={{
            background: "oklch(28 0.01 200)",
            border: "1px solid oklch(35 0.01 200)",
          }}
        >
          <div
            className="flex items-center gap-2 flex-1 border-r pr-3"
            style={{ borderColor: "oklch(35 0.01 200)" }}
          >
            <span
              className="text-xs font-sans"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Status:
            </span>
            <Badge
              className="text-xs font-semibold px-2 py-0"
              style={{ background: "oklch(var(--live-green))", color: "white" }}
            >
              Live Game
            </Badge>
          </div>
          <div
            className="flex items-center gap-2 flex-1 border-r px-3"
            style={{ borderColor: "oklch(35 0.01 200)" }}
          >
            <span
              className="text-xs font-sans"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Match
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "oklch(var(--gold))" }}
            >
              #{matchNumber}
            </span>
          </div>
          <div
            className="flex items-center gap-2 flex-1 border-r px-3"
            style={{ borderColor: "oklch(35 0.01 200)" }}
          >
            <span
              className="text-xs font-sans"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Moves:
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "oklch(90 0.01 80)" }}
            >
              {game.moves.length}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3">
            <span
              className="text-xs font-sans"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Turn:
            </span>
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{
                color:
                  game.turn === "white"
                    ? "oklch(95 0.01 80)"
                    : "oklch(var(--gold))",
              }}
            >
              {game.status === "playing" ? game.turn : "GAME OVER"}
            </span>
          </div>
          <div className="ml-auto pl-3">
            <span className="text-sm">👤</span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 flex gap-6 items-start">
        {/* Left: board + bottom panel */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Board area */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  background: "oklch(var(--dark-panel))",
                  border: "1px solid oklch(35 0.01 200)",
                }}
              >
                <span className="text-xl">♛</span>
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "oklch(var(--gold))" }}
                  >
                    Player 2
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    Black
                  </p>
                </div>
                {game.turn === "black" && game.status === "playing" && (
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "oklch(var(--live-green))" }}
                  />
                )}
              </div>

              <ChessBoard
                board={game.board}
                selected={game.selected}
                turn={game.turn}
                onCellClick={handleCellClick}
                disabled={game.status !== "playing"}
              />

              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  background: "oklch(var(--dark-panel))",
                  border: "1px solid oklch(35 0.01 200)",
                }}
              >
                <span className="text-xl">♔</span>
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "oklch(var(--gold))" }}
                  >
                    Player 1
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    White
                  </p>
                </div>
                {game.turn === "white" && game.status === "playing" && (
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "oklch(var(--live-green))" }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Game Over Banner */}
          <AnimatePresence>
            {game.status === "resigned" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg p-4 text-center"
                style={{
                  background: "oklch(var(--dark-panel))",
                  border: "1px solid oklch(var(--gold))",
                }}
                data-ocid="game.status_state"
              >
                <p
                  className="font-serif font-bold text-lg"
                  style={{ color: "oklch(var(--gold))" }}
                >
                  {game.resignedBy === "white"
                    ? "Player 1 (White)"
                    : "Player 2 (Black)"}{" "}
                  resigned!
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  {game.resignedBy === "white"
                    ? "Player 2 (Black)"
                    : "Player 1 (White)"}{" "}
                  wins!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom actions panel */}
          <div
            className="rounded-lg p-4 flex items-center justify-between gap-3"
            style={{
              background: "oklch(var(--dark-panel))",
              border: "1px solid oklch(35 0.01 200)",
            }}
          >
            <div>
              <p
                className="text-xs font-semibold"
                style={{ color: "oklch(var(--gold))" }}
              >
                {game.status === "playing"
                  ? `${currentPlayer}'s Turn`
                  : "Game Over"}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                {game.status === "playing"
                  ? game.selected
                    ? `Selected: ${toAlgebraic(game.selected[0], game.selected[1])} — click destination`
                    : "Click a piece to select"
                  : `After ${game.moves.length} moves`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResign}
                disabled={game.status !== "playing"}
                data-ocid="game.resign.button"
                className="text-xs font-semibold uppercase tracking-wide"
                style={{
                  borderColor: "oklch(55 0.18 25)",
                  color: "oklch(70 0.15 25)",
                  background: "transparent",
                }}
              >
                Resign
              </Button>
              <Button
                size="sm"
                onClick={handleReset}
                data-ocid="game.reset.button"
                className="text-xs font-semibold uppercase tracking-wide"
                style={{
                  background: "oklch(var(--gold))",
                  color: "oklch(15 0.01 80)",
                  border: "none",
                }}
              >
                New Game
              </Button>
            </div>
          </div>
        </div>

        {/* Right: sidebar */}
        <aside
          className="w-64 xl:w-72 rounded-lg flex flex-col gap-0 overflow-hidden flex-shrink-0 hidden lg:flex"
          style={{
            background: "oklch(var(--sidebar-bg))",
            border: "1px solid oklch(35 0.01 200)",
            boxShadow: "0 4px 20px oklch(0 0 0 / 0.4)",
          }}
          data-ocid="sidebar.panel"
        >
          {/* Sidebar Header */}
          <div
            className="px-4 py-3"
            style={{
              background: "oklch(var(--darker-panel))",
              borderBottom: "1px solid oklch(35 0.01 200)",
            }}
          >
            <h2
              className="font-serif font-bold text-sm"
              style={{ color: "oklch(var(--gold))" }}
            >
              Match #{matchNumber}
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Local Two-Player
            </p>
          </div>

          {/* Players */}
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid oklch(35 0.01 200)" }}
          >
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Players
            </h3>
            {[
              {
                label: "Player 1",
                color: "White",
                icon: "♔",
                side: "white" as Player,
              },
              {
                label: "Player 2",
                color: "Black",
                icon: "♚",
                side: "black" as Player,
              },
            ].map(({ label, color, icon, side }) => (
              <div
                key={side}
                className="flex items-center gap-3 py-1.5"
                data-ocid={`sidebar.${side}.panel`}
              >
                <span className="text-xl">{icon}</span>
                <div className="flex-1">
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "oklch(92 0.01 80)" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    {color}
                  </p>
                </div>
                {game.turn === side && game.status === "playing" && (
                  <Badge
                    className="text-xs px-1.5 py-0"
                    style={{
                      background: "oklch(var(--live-green))",
                      color: "white",
                    }}
                  >
                    Active
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Captured Pieces */}
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid oklch(35 0.01 200)" }}
          >
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Captured
            </h3>
            <div className="mb-1">
              <p className="text-xs" style={{ color: "oklch(70 0.01 80)" }}>
                White captures:
              </p>
              <p
                className="text-base tracking-wide min-h-[1.5rem]"
                data-ocid="sidebar.captured_white.panel"
              >
                {game.capturedByWhite.length > 0 ? (
                  game.capturedByWhite.join("")
                ) : (
                  <span style={{ color: "oklch(50 0.01 200)" }}>—</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "oklch(70 0.01 80)" }}>
                Black captures:
              </p>
              <p
                className="text-base tracking-wide min-h-[1.5rem]"
                data-ocid="sidebar.captured_black.panel"
              >
                {game.capturedByBlack.length > 0 ? (
                  game.capturedByBlack.join("")
                ) : (
                  <span style={{ color: "oklch(50 0.01 200)" }}>—</span>
                )}
              </p>
            </div>
          </div>

          {/* Move List */}
          <div className="flex-1 flex flex-col px-4 py-3 min-h-0">
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Move History
            </h3>
            <ScrollArea
              className="flex-1"
              style={{ maxHeight: "280px" }}
              data-ocid="sidebar.moves.list"
            >
              {game.moves.length === 0 ? (
                <p
                  className="text-xs italic"
                  style={{ color: "oklch(50 0.01 200)" }}
                  data-ocid="sidebar.moves.empty_state"
                >
                  No moves yet
                </p>
              ) : (
                <div className="space-y-0.5">
                  {game.moves.map((move, idx) => {
                    const moveNum = idx + 1;
                    return (
                      <div
                        key={`move-${moveNum}`}
                        className="flex items-center gap-2 text-xs py-0.5"
                        data-ocid={`sidebar.moves.item.${moveNum}`}
                      >
                        <span
                          className="w-5 text-right font-mono"
                          style={{ color: "oklch(var(--muted-foreground))" }}
                        >
                          {moveNum}.
                        </span>
                        <span style={{ color: "oklch(85 0.01 80)" }}>
                          {move}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </aside>
      </main>

      {/* ── Footer ── */}
      <footer
        className="w-full py-4 px-6"
        style={{
          background: "oklch(var(--darker-panel))",
          borderTop: "1px solid oklch(30 0.01 200)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs" style={{ color: "oklch(50 0.01 200)" }}>
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "oklch(var(--gold-dim))" }}
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex gap-4">
            {["About", "Rules", "Privacy"].map((link) => (
              <button
                key={link}
                type="button"
                className="text-xs hover:opacity-80 transition-opacity"
                style={{ color: "oklch(50 0.01 200)" }}
                data-ocid={`footer.${link.toLowerCase()}.link`}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
