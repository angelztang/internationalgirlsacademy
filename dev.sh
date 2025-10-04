#!/bin/bash

# Start both backend and frontend servers

echo "Starting Backend and Frontend..."
echo ""

# Start backend in background
echo "Starting backend on http://localhost:8000"
cd backend && uv run uvicorn app.main:app --reload &
BACKEND_PID=$!

# Start frontend in background
echo "Starting frontend on http://localhost:3000"
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo " Servers running!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Cleanup on exit
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' SIGINT SIGTERM

# Wait for background processes
wait
