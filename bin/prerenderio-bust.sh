#!/bin/bash

curl -X POST ${CACHEBUST_ENDPOINT} 2>/dev/null || true
