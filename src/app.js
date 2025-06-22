import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import os from "os";
import passport from "./middlewares/passport.js";
import router from "./routes/index.routes.js";
import { handlerAnyError } from "./errors/handle_error.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 2002;

app.use(morgan("dev"));
app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(passport.initialize());

app.use("/api", router);

app.use((err, req, res, next) => {
    handlerAnyError(err, res);
});

function getNetworkAddresses() {
    const addrs = [];
    const ifaces = os.networkInterfaces();
    for (const name of Object.keys(ifaces)) {
        for (const iface of ifaces[name] || []) {
            if (iface.family === "IPv4" && !iface.internal) {
                addrs.push(iface.address);
            }
        }
    }
    return addrs;
}

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`• Server running on:`);
        console.log(`   Local:   http://localhost:${port}`);
        const addrs = getNetworkAddresses();
        for (const addr of addrs) {
            console.log(`   Network: http://${addr}:${port}`);
        }
    });

    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.warn(`Port ${port} in use, trying ${port + 1}…`);
            startServer(port + 1);
        } else {
            console.error("Server error:", err);
        }
    });
}

startServer(PORT);