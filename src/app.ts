import express from 'express';
import path from "path";
import authRouter from "@/api/routes/Auth.routes"
import externalRoutes from "@/api/routes/external.route"
import helmet from 'helmet';
import cors from 'cors'
import compression from 'compression';
import hpp from 'hpp';


const app = express();


app.use(helmet());
app.use(cors({origin:"http://localhost:5173"}));
app.use(compression());
app.use(hpp());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use("/ext", externalRoutes);

app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.send("API çalışıyor");
});


export default app;
