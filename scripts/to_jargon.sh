#!/bin/sh

DICT_SET=$1

if [ "x${DICT_SET}" = "x" ]; then
    echo "Euch! Shucks! I need a set to process (in definitions/)"
    echo ""
    echo "Valid sets:"
    echo "  $(ls definitions/ | tr "\n" " ")"
    exit 1
fi

find definitions -type f | while read x; do
    echo ":$(basename "${x}"):"
    fmt "${x}" | sed 's/^/  /g'
    echo ""
done
