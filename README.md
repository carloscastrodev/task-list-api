# Buzzvel John Task List Api

This is a simple API developed to use with the frontend for Buzzvel Mid Level React Developer hiring test. 

## Getting Started

Follow the instructions below to set up and run the API on your local machine.

### Prerequisites

Before running the API, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/en) (version >=16.13)
- [Docker](https://www.docker.com/get-started/) (if you want to use Docker for database/running the app)
- [npm](https://docs.npmjs.com/getting-started) or [Yarn](https://yarnpkg.com/getting-started) (latest version)

### Clone

1. Clone this repository to your local machine:

```bash
git clone https://github.com/carloscastrodev/task-list-api.git
cd task-list-api
```


### Environment Setup

The API requires a `.env` file to store configuration variables. Create a `.env` file in the root directory of the project and fill it with the necessary values. You can use the `.env.example` file as a template:

```dotenv
# .env.example
DATABASE_URL="postgresql://john:1234@db:5432/buzzvel?connect_timeout=300"
PORT=3333
NODE_ENV=development
```


### Running with Docker

To run the API using Docker, make sure you have Docker installed and running on your system. Then, do the following:

1. Install the dependencies using npm or Yarn:

Using npm:

```bash
npm install
```

Using Yarn:

```bash
yarn
```

2. Run with Docker Compose
```bash
docker-compose up -d
```

This command will start the API server and a PostgresDB container.

It then can be accessed at http://localhost:3333

### Running without Docker

To run the API without Docker, use the following commands:

1. Install the dependencies using npm or Yarn:

Using npm:

```bash
npm install
```

Using Yarn:

```bash
yarn
```

2. Run the app

Using npm:

```bash
npm run dev
```

Using Yarn:

```bash
yarn dev
```

Make sure to configure the `DATABASE_URL` and `PORT` variables at the `.env` file

### API Documentation

You can check out the API documentation by visiting the following URL in your browser:

```
http://localhost:3333/docs
```

### Running Tests

The API includes some unit and integration tests. Before running the tests, make sure to configure the `DATABASE_URL` variable at the `.env` file. Follow the instructions written in the `.env.example` file.

To run the tests, do:

Using npm:

```bash
npm run docker:up:db # Starts the Postgres container (required for tests). This requires you to have docker installed and running.
npm install
npm run test
```

Using Yarn:

```bash
yarn docker:up:db # Starts the Postgres container (required for tests). This requires you to have docker installed and running.
yarn
yarn test
```