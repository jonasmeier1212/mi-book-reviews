# Run with Docker

Simply run `docker-compose up`, it will install all dependencies automatically and will start a local Postgres database.
The application is reachable at http://localhost:3000

# Run without Docker

### Dependencies

- Node >= 10
- NPM >= 6

First install dependencies via `npm install`.
Run `npm run start` to start server. The default port is 3000 so the application is reachable at http://localhost:3000
You don't have to setup any environment variables because everything is already in the `.env` file
