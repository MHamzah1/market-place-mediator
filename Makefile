# ================================
# Marketplace Mediator - Makefile
# ================================

.PHONY: help build dev prod stop clean logs shell

# Default target
help:
	@echo "================================"
	@echo "Marketplace Mediator Docker Commands"
	@echo "================================"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development server with hot-reload"
	@echo "  make dev-build    - Rebuild and start development server"
	@echo ""
	@echo "Production:"
	@echo "  make build        - Build production Docker image"
	@echo "  make prod         - Start production server"
	@echo "  make prod-nginx   - Start production server with Nginx"
	@echo ""
	@echo "Management:"
	@echo "  make stop         - Stop all containers"
	@echo "  make clean        - Remove containers, images, and volumes"
	@echo "  make logs         - View container logs"
	@echo "  make shell        - Open shell in app container"
	@echo ""

# ================================
# Development Commands
# ================================

# Start development server
dev:
	docker-compose -f docker-compose.dev.yml up

# Rebuild and start development server
dev-build:
	docker-compose -f docker-compose.dev.yml up --build

# Start development in detached mode
dev-d:
	docker-compose -f docker-compose.dev.yml up -d

# ================================
# Production Commands
# ================================

# Build production image
build:
	docker-compose build

# Start production server
prod:
	docker-compose up -d

# Start production server with Nginx
prod-nginx:
	docker-compose --profile with-nginx up -d

# Rebuild and start production
prod-build:
	docker-compose up -d --build

# ================================
# Management Commands
# ================================

# Stop all containers
stop:
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes
stop-v:
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v

# Clean everything (containers, images, volumes)
clean:
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v --rmi all
	docker system prune -f

# View logs
logs:
	docker-compose logs -f app

# View logs for all services
logs-all:
	docker-compose logs -f

# Open shell in app container
shell:
	docker-compose exec app sh

# ================================
# Utility Commands
# ================================

# Check container status
status:
	docker-compose ps

# Restart containers
restart:
	docker-compose restart

# Pull latest images
pull:
	docker-compose pull
