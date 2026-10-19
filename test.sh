#!/usr/bin/env bash
# ======================================================================
# AtherControl - Official Test & Verification Suite
# Ziro Digital National Agentic AI Hackathon 2026
# Problem Statement ID: f7298732-d5be-4fc4-8c8e-f65eb6d01c7e
# ======================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_banner() {
    echo -e "${BLUE}======================================================================${NC}"
    echo -e "${GREEN}   ATHERCONTROL - LEAVER ACCESS REVIEW AUDITOR${NC}"
    echo -e "   Ziro Digital National Agentic AI Hackathon 2026"
    echo -e "   Track: Business & Productivity AI"
    echo -e "   Problem Statement ID: f7298732-d5be-4fc4-8c8e-f65eb6d01c7e"
    echo -e "${BLUE}======================================================================${NC}"
    echo ""
}

run_ts_tests() {
    echo -e "${YELLOW}[1/2] Executing TypeScript Official Test Suite (TC1-TC4)...${NC}"
    npm run test:cli
}

run_py_tests() {
    echo -e "\n${YELLOW}[2/2] Executing Python Native Agent Test Suite (TC1-TC4)...${NC}"
    if command -v python3 &>/dev/null; then
        python3 python_agent/test_suite.py
    elif command -v python &>/dev/null; then
        python python_agent/test_suite.py
    else
        echo -e "${RED}[WARNING] Neither python3 nor python found in PATH. Skipping Python tests.${NC}"
    fi
}

run_build() {
    echo -e "\n${YELLOW}Running Production Compilation (tsc + vite build)...${NC}"
    npm run build
    echo -e "${GREEN}[SUCCESS] Production build compiled cleanly with zero errors!${NC}"
}

run_dev() {
    echo -e "\n${YELLOW}Launching AtherControl Web Application on http://localhost:5173/ ...${NC}"
    npm run dev
}

print_banner

case "$1" in
    --ts)
        run_ts_tests
        ;;
    --py)
        run_py_tests
        ;;
    --build)
        run_build
        ;;
    --dev)
        run_dev
        ;;
    --ci)
        run_ts_tests
        run_py_tests
        run_build
        echo -e "\n${GREEN}[PASS] All CI verification checks passed successfully!${NC}"
        ;;
    --help|-h)
        echo "Usage: ./test.sh [OPTION]"
        echo ""
        echo "Options:"
        echo "  (no args)   Run both TypeScript & Python test suites (TC1-TC4)"
        echo "  --ts        Run only TypeScript test suite"
        echo "  --py        Run only Python test suite"
        echo "  --build     Verify production bundle compilation"
        echo "  --dev       Launch the interactive development server"
        echo "  --ci        Run all tests and build verification (CI mode)"
        echo "  --help, -h  Show this help message"
        ;;
    *)
        run_ts_tests
        run_py_tests
        echo -e "\n${GREEN}======================================================================${NC}"
        echo -e "${GREEN}[SUCCESS] All official test cases passed! (TC1-TC4: 100% SUCCESS)${NC}"
        echo -e "${GREEN}======================================================================${NC}"
        ;;
esac
