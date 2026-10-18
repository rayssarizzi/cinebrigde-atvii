```powershell
cd cinebridge
npm install
Copy-Item .env.example .env
docker run --name cinebridge-postgres -e POSTGRES_USER=cinebridge -e POSTGRES_PASSWORD=cinebridge -e POSTGRES_DB=cinebridge_recomendacao -p 5432:5432 -d postgres:16
npm run dev
```
