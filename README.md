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

## 🛠️ Getting started

### Installation
```bash
$ pnpm install
$ cp .env.example .env
````

Fill in the `.env` file with your environment variables. Then init the database:
```bash
$ pnpm prisma db push
$ pnpm run seed
```

### Development
```bash
$ pnpm run dev 
#or, with vercel
$ vercel dev
```

### Production
```bash
$ vercel --prod
```	
Or simply push to the main branch, if you have the vercel integration enabled.
> **Note:** Don't forget to set the environment variables in the vercel dashboard.
