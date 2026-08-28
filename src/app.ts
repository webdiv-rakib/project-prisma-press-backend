import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import httpStatus from "http-status";
import { userRouter } from "./modules/users/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";


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
});

app.get('/prisma-press', async (req, res) => {
    res.status(httpStatus.CREATED).json({
        name: 'Prisma Press',
        author: 'webdib-rakib',
        successs: true
    })
});

// app.post('/api', )
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRoutes);
app.use('/api/comments',commentRoutes);

//final exam finished.
export default app;