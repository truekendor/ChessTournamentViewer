#!/bin/bash
git clone https://github.com/Yoshie2000/ChessTournamentViewer.git tmp
cd tmp
npm install stockfish
cp node_modules/stockfish/bin/stockfish-18.js ../public
cp node_modules/stockfish/bin/stockfish-18.wasm ../public
cd ..
rm -rf tmp