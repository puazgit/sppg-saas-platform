# SPPG SaaS Platform - Development Commands
.PHONY: help setup start stop restart clean logs db-migrate db-reset db-seed db-studio

# Default target
help:
	@echo "SPPG SaaS Platform - Available Commands:"
	@echo ""
	@echo "🐳 Docker Commands:"
	@echo "  make setup     - Initial setup (build and start containers)"
	@echo "  make start     - Start all containers"
	@echo "  make stop      - Stop all containers"
	@echo "  make restart   - Restart all containers"
	@echo "  make clean     - Stop containers and remove volumes (⚠️  DATA LOSS)"
	@echo "  make logs      - View logs from all containers"
	@echo ""
	@echo "🗄️  Database Commands:"
	@echo "  make db-migrate - Run Prisma migrations"
	@echo "  make db-reset   - Reset database (⚠️  DATA LOSS)"
	@echo "  make db-seed    - Seed database with sample data"
	@echo "  make db-studio  - Open Prisma Studio"
	@echo ""
	@echo "🚀 Development Commands:"
	@echo "  npm run dev     - Start Next.js development server"
	@echo "  npm run build   - Build for production"
	@echo ""
	@echo "📊 Database Access:"
	@echo "  Adminer: http://localhost:8080"
	@echo "  MinIO Console: http://localhost:9001"

# Docker commands
setup:
	@echo "🚀 Setting up SPPG SaaS Platform..."
	docker-compose up -d
	@echo "⏳ Waiting for database to be ready..."
	@sleep 10
	@echo "📦 Installing dependencies..."
	npm install
	@echo "🗄️  Running database migrations..."
	npx prisma migrate dev --name init
	@echo "🌱 Seeding database..."
	npm run db:seed 2>/dev/null || echo "⚠️  Seeding will be available after creating seed script"
	@echo ""
	@echo "✅ Setup completed!"
	@echo "🌐 Access Adminer at: http://localhost:8080"
	@echo "📦 Access MinIO Console at: http://localhost:9001"
	@echo ""
	@echo "Next steps:"
	@echo "1. Run 'npm run dev' to start the development server"
	@echo "2. Open http://localhost:3000 in your browser"

start:
	@echo "🚀 Starting containers..."
	docker-compose up -d
	@echo "✅ Containers started!"

stop:
	@echo "🛑 Stopping containers..."
	docker-compose down
	@echo "✅ Containers stopped!"

restart:
	@echo "🔄 Restarting containers..."
	docker-compose restart
	@echo "✅ Containers restarted!"

clean:
	@echo "🧹 Cleaning up containers and volumes..."
	@echo "⚠️  This will delete all data. Continue? [y/N]"
	@read -r confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		docker-compose down -v --remove-orphans; \
		docker volume prune -f; \
		echo "✅ Cleanup completed!"; \
	else \
		echo "❌ Cleanup cancelled."; \
	fi

logs:
	@echo "📄 Viewing logs..."
	docker-compose logs -f

# Database commands
db-migrate:
	@echo "🗄️  Running database migrations..."
	npx prisma migrate dev

db-reset:
	@echo "🗄️  Resetting database..."
	@echo "⚠️  This will delete all data. Continue? [y/N]"
	@read -r confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		npx prisma migrate reset --force; \
		echo "✅ Database reset completed!"; \
	else \
		echo "❌ Database reset cancelled."; \
	fi

db-seed:
	@echo "🌱 Seeding database..."
	npm run db:seed

db-studio:
	@echo "🎨 Opening Prisma Studio..."
	npx prisma studio

# Check if Docker is installed
check-docker:
	@which docker > /dev/null || (echo "❌ Docker is not installed. Please install Docker first." && exit 1)
	@which docker-compose > /dev/null || (echo "❌ Docker Compose is not installed. Please install Docker Compose first." && exit 1)