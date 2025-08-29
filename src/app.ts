import express from 'express';
import path from "path";
import authRouter from "@/api/routes/Auth.routes"
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.send("API çalışıyor");
});


export default app;
