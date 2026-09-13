#!/bin/bash

pac solution export \
  --name PPALMCore \
  --path ./exports/PPALMCore.zip

pac solution unpack \
  --zipfile ./exports/PPALMCore.zip \
  --folder ./solutions/PPALMCore
