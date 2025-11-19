#!/bin/bash

set -e

if [ "$1" = "base" ]; then
  pnpm test:unit run __tests__/index.spec.ts
elif [ "$1" = "new" ]; then
  pnpm test:unit run __tests__/retry.spec.ts
else
  echo "Usage: $0 [base|new]"
  exit 1
fi

