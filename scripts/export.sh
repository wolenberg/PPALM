#!/bin/bash

echo "Exporting solution..."

pac solution export \
  --environment https://orgbc1db0d2.crm3.dynamics.com \
  --name PPALMCore \
  --path ./exports/PPALMCore.zip

echo "Unpacking solution..."

pac solution unpack \
  --zipfile ./exports/PPALMCore.zip \
  --folder ./solutions/PPALMCore

echo "Done!"
