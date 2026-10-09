#!/bin/sh
set -eu

exec node scripts/qa-lokalsider.mjs "${1:-test-results/sv-da/skjermbilder}"
