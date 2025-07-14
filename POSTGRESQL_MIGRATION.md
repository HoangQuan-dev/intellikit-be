# Migration Guide: SQL Server to PostgreSQL

This guide will help you migrate the IntelliKit backend from SQL Server to PostgreSQL for easier deployment and better cloud platform support.

## Why PostgreSQL?

- **Better Cloud Support**: Most cloud platforms have excellent PostgreSQL support
- **Open Source**: No licensing costs
- **Better Performance**: Often faster for web applications
- **Rich Ecosystem**: Extensive tooling and community support
- **JSON Support**: Native JSON/JSONB data types
- **Easier Deployment**: Simpler setup on platforms like Heroku, Railway, Render

## Migration Steps

### 1. Install PostgreSQL Dependencies

```bash
# Remove SQL Server dependency
npm uninstall mssql

# Install PostgreSQL dependencies
npm install pg
npm install --save-dev @types/pg
```

### 2. Update Database Configuration

The main changes are in `src/app.module.ts`:

```typescript
// Before (SQL Server)
TypeOrmModule.forRoot({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  username: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'intellikit',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
})

// After (PostgreSQL)
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'intellikit',
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
})
```

### 3. Update Environment Variables

```bash
# Before (SQL Server)
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=your_password
DB_NAME=intellikit

# After (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=intellikit
```

### 4. Install PostgreSQL Locally

#### Windows
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 5. Set Up PostgreSQL Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE intellikit;
CREATE USER intellikit_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE intellikit TO intellikit_user;
\q
```

### 6. Data Migration (If You Have Existing Data)

If you have existing data in SQL Server, you'll need to export and import:

```bash
# Export from SQL Server (using sqlcmd)
sqlcmd -S localhost -U sa -P your_password -d intellikit -Q "SELECT * FROM users" -o users.csv

# Import to PostgreSQL (using psql)
psql -U postgres -d intellikit -c "\COPY users FROM 'users.csv' WITH CSV HEADER"
```

### 7. Test the Migration

```bash
# Start the application
npm run start:dev

# Check GraphQL playground
# http://localhost:8080/graphql
```

## Docker Setup

### Using Docker Compose (Recommended for Development)

```bash
# Start PostgreSQL and the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Setup

```bash
# Start PostgreSQL container
docker run --name intellikit-postgres \
  -e POSTGRES_DB=intellikit \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15-alpine

# Build and run the application
docker build -t intellikit-be .
docker run -p 8080:8080 \
  -e DB_HOST=localhost \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=password \
  -e DB_NAME=intellikit \
  -e NEST_PUBLIC_OPENAI_API_KEY=your_key \
  intellikit-be
```

## Cloud Deployment

### Heroku
```bash
# Install Heroku CLI
# Create app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NEST_PUBLIC_OPENAI_API_KEY=your_key

# Deploy
git push heroku main
```

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway init

# Add PostgreSQL service
railway add

# Deploy
railway up
```

### Render
```bash
# Connect your GitHub repository
# Add PostgreSQL service
# Set environment variables
# Deploy automatically
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql
   
   # Check port
   netstat -an | grep 5432
   ```

2. **Authentication Failed**
   ```bash
   # Check pg_hba.conf
   sudo nano /etc/postgresql/*/main/pg_hba.conf
   
   # Restart PostgreSQL
   sudo systemctl restart postgresql
   ```

3. **SSL Issues in Production**
   ```typescript
   // In app.module.ts
   ssl: process.env.NODE_ENV === 'production' 
     ? { rejectUnauthorized: false } 
     : false,
   ```

### Performance Optimization

```typescript
// Add connection pooling
TypeOrmModule.forRoot({
  // ... other config
  extra: {
    max: 20, // Maximum number of connections
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
})
```

## Benefits After Migration

1. **Easier Deployment**: Better support on cloud platforms
2. **Cost Savings**: No SQL Server licensing costs
3. **Better Performance**: Optimized for web applications
4. **Rich Features**: JSON support, full-text search, etc.
5. **Community Support**: Large open-source community

## Next Steps

1. Test all GraphQL operations
2. Verify data integrity
3. Update deployment scripts
4. Monitor performance
5. Set up backups

## Support

If you encounter issues during migration:
1. Check PostgreSQL logs: `sudo tail -f /var/log/postgresql/postgresql-*.log`
2. Verify connection: `psql -h localhost -U postgres -d intellikit`
3. Test with simple query: `SELECT version();` 