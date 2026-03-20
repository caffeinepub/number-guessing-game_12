# Chess Game

## Current State
No existing app. Starting fresh.

## Requested Changes (Diff)

### Add
- Interactive 8x8 chessboard displayed in the browser
- Chess pieces displayed using Unicode symbols
- Two-player local chess: Player 1 (white) and Player 2 (black) alternate turns
- Click-to-move interface: click a piece to select it, click destination to move
- Turn indicator showing whose turn it is
- Board labels (a-h columns, 1-8 rows)
- Basic move execution (no rule validation beyond selecting own pieces)

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
- Backend: store board state, current turn, handle move actions
- Frontend: render chessboard grid, handle click selection and move, show turn indicator
