# Installing Deno (to run test)

For Linux & MacOS
```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

For Windows
```
irm https://deno.land/install.ps1 | iex
```

# Run test locally 

API-side
```
deno test --no-check -A api/test/auth.test.ts
deno test --no-check -A api/test/user.test.ts
deno test --no-check -A api/test/hotel.test.ts
deno test --no-check -A api/test/booking.test.ts
```

For any reason you'll need to terminate command (Ctrl+C)

Front-side

Sorry to this part I didn't find any testing part for this framework

# Execute app

[Installing Docker](https://www.docker.com/)

Starting stack
```
docker-compose up -d
```

Stopping stack 
```
docker-compose down
````
