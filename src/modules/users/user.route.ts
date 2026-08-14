import { Router } from "express";
import { userController } from './user.controller';
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";

const router = Router();

router.post('/register', userController.createUser);

router.get('/me', auth(Role.ADMIN, Role.USER, Role.AUTHOR),
    //     (req: Request, res: Response, next: NextFunction) => {
    //     console.log(req.cookies);

    //     const { accessToken } = req.cookies;

    //     const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);

    //     if (!verifiedToken.success) {
    //         throw new Error(verifiedToken.error)
    //     }

    //     const { email, name, id, role } = verifiedToken.data as JwtPayload
    //     // const requiredRoles = ["ADMIN","USER","AUTHOR"]
    //     const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR]
    //     if (!requiredRoles.includes(role)) {
    //         return res.status(403).json({
    //             success: false,
    //             statusCode: httpStatus.FORBIDDEN,
    //             message: "Forbidden.You don't have permission to access this resource"
    //         });
    //     };

    //     req.user = {
    //         email,
    //         name,
    //         id,
    //         role
    //     }
    //     next();
    // }, 
    userController.getMyProfile);

router.put('/my-profile', auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.updateMyProfile);

export const userRouter = router;