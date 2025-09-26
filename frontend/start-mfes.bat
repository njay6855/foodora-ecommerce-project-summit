@echo off
echo Starting all microfrontends...

start cmd /k "cd root-config && npm start"
start cmd /k "cd navbar && npm start"
start cmd /k "cd home && npm start"
start cmd /k "cd product-detail && npm start"
start cmd /k "cd cart && npm start"
start cmd /k "cd supplier && npm start"
start cmd /k "cd data-steward && npm start"
start cmd /k "cd auth && npm start"
start cmd /k "cd footer && npm start"

echo All microfrontends started.
pause
