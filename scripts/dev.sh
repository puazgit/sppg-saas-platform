#!/bin/bash

# SPPG SaaS Platform - Development Helper Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
}

# Wait for database to be ready
wait_for_db() {
    log_info "Waiting for PostgreSQL to be ready..."
    max_tries=30
    counter=0
    
    while [ $counter -lt $max_tries ]; do
        if docker-compose exec -T postgres pg_isready -U sppg_admin -d sppg_saas_platform > /dev/null 2>&1; then
            log_success "Database is ready!"
            return 0
        fi
        
        counter=$((counter + 1))
        log_info "Waiting... ($counter/$max_tries)"
        sleep 2
    done
    
    log_error "Database failed to start within expected time"
    exit 1
}

# Setup function
setup() {
    log_info "Setting up SPPG SaaS Platform development environment..."
    
    check_docker
    
    # Start Docker containers
    log_info "Starting Docker containers..."
    docker-compose up -d
    
    # Wait for database
    wait_for_db
    
    # Install dependencies
    log_info "Installing NPM dependencies..."
    npm install
    
    # Generate Prisma client
    log_info "Generating Prisma client..."
    npx prisma generate
    
    # Run migrations
    log_info "Running database migrations..."
    npx prisma migrate dev --name init
    
    # Seed database (if seed file exists)
    if [ -f "prisma/seed.ts" ]; then
        log_info "Seeding database..."
        npm run db:seed
    else
        log_warning "Seed file not found. Database seeding skipped."
    fi
    
    log_success "Setup completed successfully!"
    echo ""
    log_info "🌐 Access points:"
    echo "  • Application: http://localhost:3000"
    echo "  • Adminer (DB): http://localhost:8080"
    echo "  • MinIO Console: http://localhost:9001"
    echo ""
    log_info "📝 Next steps:"
    echo "  1. Run 'npm run dev' to start the development server"
    echo "  2. Open http://localhost:3000 in your browser"
}

# Start function
start() {
    log_info "Starting SPPG SaaS Platform..."
    check_docker
    docker-compose up -d
    wait_for_db
    log_success "All services are running!"
}

# Stop function
stop() {
    log_info "Stopping SPPG SaaS Platform..."
    docker-compose down
    log_success "Services stopped!"
}

# Reset function
reset() {
    log_warning "This will delete all database data. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        log_info "Resetting database..."
        npx prisma migrate reset --force
        log_success "Database reset completed!"
    else
        log_info "Reset cancelled."
    fi
}

# Main script logic
case "${1:-}" in
    "setup")
        setup
        ;;
    "start")
        start
        ;;
    "stop")
        stop
        ;;
    "restart")
        log_info "Restarting services..."
        stop
        start
        ;;
    "reset")
        reset
        ;;
    "logs")
        docker-compose logs -f
        ;;
    *)
        echo "SPPG SaaS Platform Development Helper"
        echo ""
        echo "Usage: $0 {setup|start|stop|restart|reset|logs}"
        echo ""
        echo "Commands:"
        echo "  setup    - Initial setup (first time)"
        echo "  start    - Start all services"
        echo "  stop     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  reset    - Reset database (⚠️  DATA LOSS)"
        echo "  logs     - View service logs"
        exit 1
        ;;
esac