#!/bin/bash

tsc --target es6 --moduleResolution nodenext --outDir ./build \
    *.ts \
    snake/*.ts \
    snake/wrappers/*.ts &

