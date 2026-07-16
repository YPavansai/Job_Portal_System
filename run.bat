@echo off
echo Launching CareerSphere Portal...
start cmd /k "cd backend && .\mvnw.cmd spring-boot:run"
start cmd /k "cd frontend && npm run dev"
