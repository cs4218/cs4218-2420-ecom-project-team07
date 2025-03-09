# Development Instructions

## Pre-requisites

- Git
- Node.js v22 or higher
- MongoDB Compass, with initial database created
  (<https://cs4218.github.io/user-guide/contents/topic1b.html>)

## First-time Setup

Install dependencies:

1. In the root directory, run `npm i` for the backend server
1. In the `client` directory, run `npm i` for the frontend client

Set up environment file:

1. Make a copy of `env.example` and rename it to `.env`
1. Replace the value of `MONGO_URL` with that of your own MongoDB connection string. Be sure to specify the correct database name at the end

Import sample data:

1. 4 JSON files of sample data have been zipped together and provided on Canvas. They are `test.categories.json`, `test.orders.json`, `test.products.json`, and `test.users.json`
1. In Compass, create 4 collections in your database accordingly: `categories`, `orders`, `products`, `users`
1. For each collection, import its respective JSON file

## Running the Project

1. In the root directory, run `npm run dev`. This starts both the front and backend
1. Your browser should automatically open to <http://localhost:3000/>

## Running Tests

1. In the root directory, run `npm run test`. This tests both the front and backend, printing results to the console and generating code coverage report files

# Developer Documentation

## Provided Test Account

- The sample data from Canvas includes a user account whose email and password are both `cs4218@test.com`. This may be useful when testing out the website

## Elevating an Account to Admin

1. In Compass, change the user object's `role` value from `0` to `1`

---

# Deliverables

- MS1 CI link: <https://github.com/cs4218/cs4218-2420-ecom-project-team07/actions/runs/13257127913/job/37005801949>
