# 🕹️ Realtime Tic-Tac-Toe Backend – Node.js + WebSocket

## 📌 Introduction

This backend powers the **Realtime Tic-Tac-Toe** game by handling player matchmaking, move validation, and real-time broadcasts. Built with **Node.js** and a lightweight WebSocket server, it provides a scalable, event-driven foundation for seamless two-player games.

## 🌐 Live Demo

Check out the live game at [link](https://cross-and-zero.vercel.app/)

---

## 📖 Project Description

Key technologies and patterns:

- **Node.js** – Fast, non-blocking I/O for real-time applications  
- **ws** – Simple WebSocket server library for bidirectional client communication  
- **Event-Driven Architecture** – Clean separation of responsibilities via custom modules  
- **In-Memory Queue** – Lightweight player matchmaking with constant-time enqueue/dequeue  

This service exposes a single WebSocket endpoint (`index.js`) that clients (React frontend) connect to. All game logic and state management live here.

---

## 🧱 Project Structure

```plaintext
root/
├── index.js             # Starts the WebSocket server & routes messages
├── GameManager.js       # Manages player queue, games, and room assignments
└── CrossAndZero.js      # Validates moves, updates board state, checks win/tie
```

## 🚀 How It Works

### WebSocket Server (`index.js`)

1. **Listens for new client connections**  
2. **Routes incoming messages** to `GameManager` or `CrossAndZero` based on `type`  
3. **Emits events back to clients**  
   - `matched`  
   - `move-accepted`  
   - `invalid-move`  
   - `opponent-move`  

### Matchmaking & Game Lifecycle (`GameManager.js`)

- **Queue**  
  Holds all connected players waiting for a match  
- **Pairing**  
  When two players are available, assigns them to a new game “room”  
- **State Tracking**  
  Tracks active games, player sockets, and assigned markers (X/O)  
- **Disconnection Handling**  
  Cleans up queue entries and active games if a player disconnects  

### Move Validation & Broadcast (`CrossAndZero.js`)

- **Board Representation**  
  Uses a flat string of nine cells (`***/***/***`)  
- **Validation**  
  Ensures correct turn, unoccupied cell, and valid marker  
- **Win/Tie Detection**  
  After each move, checks for a winning line or a full board  
- **Broadcast**  
  Sends the updated board and game status to both players  
