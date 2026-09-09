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

// not meet yet what so ever
// will meet Tuesday 
// we will meet tomorrow 
// i am sooooo excited 
// trying to be good at
// what to do go back on track
// getting behind day by day
// finally we meet eqch other.
// doing shits
// wasting time
export default app;