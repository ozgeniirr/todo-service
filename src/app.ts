import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
import authRouter from "./api/routes/Auth.routes";
import i18n from "./config/i18n";
import type { CorsOptions } from "cors";
import session from "express-session";
import externalRoutes from "./api/routes/external.route";
import passport, { initialize } from "passport";



const app = express();

app.use(i18n.init);
app.get('/', (req, res )=>{
  res.send(res.__("hoşgeldiniz"));
});




app.use(session({
  secret: process.env.SESSION_SECRET || "dev-secret",
  resave:false,
  saveUninitialized:false,
  cookie: {
    httpOnly:true,
    secure:false,
    maxAge: 100 * 60 * 60 
  }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://jsonplaceholder.typicode.com"],
        imgSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
      },
    },
  })
);

const corsOpts: CorsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
} ;

app.use(cors(corsOpts));

 
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));


app.use(hpp({ whitelist: ["tags", "ids"] }));


app.use(
  compression({
    level: 6,
    threshold: 1024,
  })
);


app.use(express.static(path.join(__dirname, "public")));


app.use("/ext", externalRoutes);
app.use("/auth", authRouter);

app.get("/", (_req, res) => {
  res.send("API çalışıyor");
});

app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || 500;
    const body: any = { message: err.message || "Internal Server Error" };
    if (process.env.NODE_ENV !== "production") body.stack = err.stack; 
    res.status(status).json(body);
  }
);

export default app;
