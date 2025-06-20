<!-- ![Finished project](https://img.shields.io/badge/status-finished-green) -->

<p align="center">
	<img src="https://skillicons.dev/icons?i=ts,next,tailwind,vercel" height="30" />
</p>

<!-- <p align="center">
	<img src="docs/logo.png" alt="Icon of the project" height="150"/>
</p> -->

# <div align="center">Projet de Kseniya</div>
<div align="center">
	<samp>Le projet de fin de formation de Kseniya.</samp>
</div>

<hr>

## 🛠️ Quick start

### Installation
```bash
$ pnpm install
$ cp .env.example .env
```
Fill in the `.env` file with your environment variables.

Then, if a database is already set up, you can generate the Prisma client and push the schema to the database:

```bash
$ pnpm run db:push		# Applies migrations to the database
$ pnpm run db:generate	# Generate Prisma client
```

If you need to seed the database with initial data (located in `prisma/seed/data.ts`), you can run:
```bash
$ pnpm run db:seed		# Seed the database with initial data
```
> ⚠ Warning: The seed script will delete all existing data in the database before inserting new data. Use with caution!

### Migration
If you need to create a new migration, first modify the Prisma schema in `prisma/schema.prisma`. Then, you can edit your migration with the following commands:
```bash
$ pnpm run db:migration --<name>	# Create a new migration, without applying it
$ pnpm run db:push					# Apply migrations to the database
$ pnpm run db:generate				# Generate Prisma client
```