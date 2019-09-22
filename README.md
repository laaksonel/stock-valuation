# Stock valuation tool

- Web app for calculating current intrinsic value of chosen company
- Scala backend fetches stock data from Morning star and Yahoo Finance
- React frontend displays a form filled with the data requested from the backend and calculates the current value

## How it works
- Pass the official stock ticker
- The app fetches the required stats and calculates the current value of the company with the selected margin of safety and discount value
- The calculation formula basically just extrapolates the historical performance of the company
	- Yes, this is the very first mistake an investor can make, so please *do not buy anything based on the past numbers*

## Build & Run

#### Backend
- Install sbt

In `server` directory

```
sbt run
```

Build docker image
```
sbt docker
```
More detailed instructions about the deployment (to Heroku) are in README.md under the `server` directory

#### Frontend

This is just a basic create-react-app, I'm pretty sure most people know the drill

## TODOS / Further ideas

Client:
- Try out Immer-reducer instead of plain Redux (https://github.com/epeli/immer-reducer)

Backend:
- Change the base docker image to alpine version instead of full JDK image
