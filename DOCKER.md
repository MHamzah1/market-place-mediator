# Docker Setup - Marketplace Mediator

Dokumentasi untuk menjalankan aplikasi Marketplace Mediator menggunakan Docker.

## 📋 Prerequisites

Pastikan sudah terinstall:

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

## 🚀 Quick Start

### Development Mode

```bash
# Clone repository dan masuk ke folder
cd market-place-mediator-master

# Copy environment file
cp .env.example .env

# Jalankan development server
docker-compose -f docker-compose.dev.yml up

# Atau menggunakan Makefile
make dev
```

Aplikasi akan berjalan di: http://localhost:9090

### Production Mode

```bash
# Build dan jalankan production
docker-compose up -d --build

# Atau menggunakan Makefile
make prod-build
```

## 📁 Struktur File Docker

```
├── Dockerfile           # Production Dockerfile (multi-stage)
├── Dockerfile.dev       # Development Dockerfile
├── docker-compose.yml   # Production compose file
├── docker-compose.dev.yml # Development compose file
├── .dockerignore        # Files to ignore in Docker build
├── .env.example         # Environment variables template
├── Makefile            # Shortcut commands
└── nginx/
    └── nginx.conf      # Nginx configuration (optional)
```

## ⚙️ Environment Variables

| Variable                   | Default                          | Description            |
| -------------------------- | -------------------------------- | ---------------------- |
| `NODE_ENV`                 | `production`                     | Environment mode       |
| `NEXT_PUBLIC_API_URL`      | `http://localhost:9090/api`      | Backend API URL        |
| `NEXT_PUBLIC_API_URL_FOTO` | `http://localhost:9090/uploads/` | URL untuk foto/uploads |
| `PORT`                     | `9090`                           | Application port       |

## 🔧 Available Commands

### Menggunakan Makefile

```bash
# Development
make dev           # Start development server
make dev-build     # Rebuild and start development
make dev-d         # Start in background

# Production
make build         # Build production image
make prod          # Start production server
make prod-nginx    # Start with Nginx reverse proxy
make prod-build    # Rebuild and start production

# Management
make stop          # Stop all containers
make clean         # Remove containers and images
make logs          # View application logs
make shell         # Open shell in container
make status        # Check container status
make restart       # Restart containers
```

### Menggunakan Docker Compose

```bash
# Development
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose up -d
docker-compose up -d --build
docker-compose down
docker-compose logs -f
```

## 🐳 Docker Images

### Production Image (Multi-stage Build)

- **Base**: `node:20-alpine`
- **Stages**:
  1. `deps` - Install dependencies
  2. `builder` - Build Next.js application
  3. `runner` - Production runtime (minimal)
- **Size**: ~150MB (optimized)

### Development Image

- **Base**: `node:20-alpine`
- **Features**: Hot-reload enabled
- **Volume mounting**: Source code mounted for live editing

## 🔒 Security Features

1. **Non-root user**: Aplikasi berjalan dengan user `nextjs` (bukan root)
2. **Multi-stage build**: Image final hanya berisi file yang diperlukan
3. **No devDependencies**: Production image tidak menyertakan dev dependencies
4. **Standalone output**: Next.js standalone mode untuk ukuran minimal

## 🌐 With Nginx (Production)

Untuk production dengan Nginx reverse proxy:

```bash
# Jalankan dengan Nginx
docker-compose --profile with-nginx up -d

# Atau
make prod-nginx
```

Fitur Nginx:

- Reverse proxy ke Next.js
- Gzip compression
- Static files caching
- Rate limiting
- Ready untuk SSL/HTTPS

### Setup SSL (Optional)

1. Letakkan SSL certificate di `nginx/ssl/`
2. Uncomment HTTPS server block di `nginx/nginx.conf`
3. Update `server_name` dengan domain Anda

## 📊 Health Check

Container memiliki health check built-in:

```bash
# Cek status
docker-compose ps

# Lihat health status
docker inspect marketplace-mediator-app | grep -A 10 Health
```

## 🐛 Troubleshooting

### Container tidak bisa start

```bash
# Lihat logs
docker-compose logs app

# Rebuild dari awal
docker-compose down -v
docker-compose up --build
```

### Port sudah digunakan

```bash
# Cek proses yang menggunakan port 9090
lsof -i :9090

# Atau ganti port di .env
PORT=3001
```

### Perubahan code tidak ter-detect (development)

```bash
# Restart container
docker-compose -f docker-compose.dev.yml restart

# Atau rebuild
docker-compose -f docker-compose.dev.yml up --build
```

### Masalah permission

```bash
# Jika ada masalah permission di Linux
sudo chown -R $USER:$USER .
```

## 📝 Notes

- Development mode menggunakan volume mounting untuk hot-reload
- Production mode menggunakan standalone build untuk performa optimal
- Default API URL mengarah ke Railway backend
- Ganti `NEXT_PUBLIC_API_URL` di `.env` jika menggunakan backend lokal
