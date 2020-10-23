```js

import express from "express";
import routeLogger from "..";
import isPrime from "prime-number";
// config options all are optional.
interface RouteLoggerConfig {
    redisConnection: string;
    threshold: number;
    frequency: number;
    prefixSafe: string;
    prefixDanger: string;
    logger(err: Error | string): void | Promise<void>;
}

const app = express();
app.use(routeLogger({
    threshold: 10,
    frequency: 500,
    logger(item) {
        if (item instanceof Error) {
            console.error(item.message);
        } else {
            console.log(item);
        }
    }
}));

app.get("/do-some-hard-work", (req, res) => {
    let total = 0, counter = 0, gen = 2000;
    let interval = setInterval(() => {
        if(total >= gen) {
            clearInterval(interval);
            res.send("Hard work done successfully, total: " + total);
        }
        if (isPrime(counter)) {
            total += 1;
        }
        counter++;
    }, 0);
});
app.listen(3000, () => console.log("App started listening"));
```