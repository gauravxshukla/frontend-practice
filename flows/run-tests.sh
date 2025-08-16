#!/bin/bash

# Maestro Test Runner Script
# This script helps you run Maestro web automation tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Maestro is installed
check_maestro() {
    if ! command -v maestro &> /dev/null; then
        print_error "Maestro is not installed. Please install it first:"
        echo "curl -Ls \"https://get.maestro.mobile.dev\" | bash"
        exit 1
    fi
    print_success "Maestro is installed"
}

# Function to run tests
run_tests() {
    local test_file="test.yaml"
    local output_dir="reports"
    local format="html"
    local verbose=""
    local debug=""
    local profile="desktop"
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --verbose)
                verbose="--verbose"
                shift
                ;;
            --debug)
                debug="--debug"
                shift
                ;;
            --headless)
                export MAESTRO_HEADLESS=true
                shift
                ;;
            --browser)
                export MAESTRO_BROWSER="$2"
                shift 2
                ;;
            --profile)
                profile="$2"
                shift 2
                ;;
            --output)
                output_dir="$2"
                shift 2
                ;;
            --format)
                format="$2"
                shift 2
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Create output directory if it doesn't exist
    mkdir -p "$output_dir"
    
    print_status "Running Maestro tests..."
    print_status "Test file: $test_file"
    print_status "Output directory: $output_dir"
    print_status "Format: $format"
    print_status "Profile: $profile"
    
    # Run the tests
    maestro test "$test_file" \
        --profile "$profile" \
        --format "$format" \
        --output "$output_dir" \
        $verbose \
        $debug
    
    if [ $? -eq 0 ]; then
        print_success "Tests completed successfully!"
        print_status "Results saved to: $output_dir/"
        
        # Open results in browser if HTML format
        if [ "$format" = "html" ]; then
            if command -v open &> /dev/null; then
                open "$output_dir/index.html"
            elif command -v xdg-open &> /dev/null; then
                xdg-open "$output_dir/index.html"
            fi
        fi
    else
        print_error "Tests failed!"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "Maestro Test Runner"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --verbose          Run with verbose output"
    echo "  --debug            Run in debug mode"
    echo "  --headless         Run in headless mode"
    echo "  --browser BROWSER  Set browser (chrome, firefox, safari)"
    echo "  --profile PROFILE  Set device profile (desktop, mobile, tablet)"
    echo "  --output DIR       Set output directory (default: reports)"
    echo "  --format FORMAT    Set output format (html, json, junit)"
    echo "  --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Run basic tests"
    echo "  $0 --verbose --debug                  # Run with verbose and debug"
    echo "  $0 --headless --browser chrome        # Run headless in Chrome"
    echo "  $0 --profile mobile --output results  # Run mobile tests"
}

# Function to install Maestro
install_maestro() {
    print_status "Installing Maestro..."
    curl -Ls "https://get.maestro.mobile.dev" | bash
    print_success "Maestro installed successfully!"
    
    # Add to PATH if not already there
    if [[ ":$PATH:" != *":$HOME/.maestro/bin:"* ]]; then
        echo 'export PATH="$HOME/.maestro/bin:$PATH"' >> ~/.bashrc
        echo 'export PATH="$HOME/.maestro/bin:$PATH"' >> ~/.zshrc
        print_warning "Please restart your terminal or run: source ~/.bashrc"
    fi
}

# Function to open Maestro Studio
open_studio() {
    print_status "Opening Maestro Studio..."
    maestro studio
}

# Main script logic
main() {
    case "${1:-run}" in
        "install")
            install_maestro
            ;;
        "studio")
            check_maestro
            open_studio
            ;;
        "run"|"")
            check_maestro
            run_tests "${@:2}"
            ;;
        "help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
