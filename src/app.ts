import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import httpStatus from "http-status";
import { userRouter } from "./modules/users/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.route";


const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.get('/prisma-press', async (req, res) => {
    res.status(httpStatus.CREATED).json({
        name: 'Prisma Press',
        author: 'webdib-rakib',
        successs: true
    })
})

// app.post('/api', )
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRoutes);

// here i will add another route for the comment api.
// 2 exam is finished today
// will finished watching next modules

export default app;