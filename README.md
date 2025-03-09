# Development Instructions

## Pre-requisites

- Git
- Node.js v22 or higher
- MongoDB Compass, with initial database created
  (<https://cs4218.github.io/user-guide/contents/topic1b.html>)

## First-time Setup

Install dependencies:

1. In the root directory, run `npm i` for the backend
1. In the `client` directory, run `npm i` for the frontend

Set up environment file:

1. Make a copy of `env.example` and rename it to `.env`
1. Replace the value of `MONGO_URL` with that of your own MongoDB connection string

Import sample data:

1. 4 JSON files of sample data have been zipped together and provided on Canvas. They are `test.categories.json`, `test.orders.json`, `test.products.json`, and `test.users.json`
1. In Compass, create 4 collections in your database accordingly: `categories`, `orders`, `products`, `users`
1. For each collection, import its respective JSON file

## Running the project

1. In the root directory, run `npm run dev`
1. Your browser should automatically open to <http://localhost:3000/>

---

# Deliverables

- MS1 CI link: <https://github.com/cs4218/cs4218-2420-ecom-project-team07/actions/runs/13257127913/job/37005801949>
