#!/bin/sh
set -eu

exec node scripts/qa-lokalsider.mjs "${1:-qa/sv-da/skjermbilder}"
