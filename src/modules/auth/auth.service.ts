import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { IloginUser } from "./auth.interface"
import jwt from "jsonwebtoken"

const loginUser = async (payload: IloginUser) => {
    const { email, password } = payload
    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if (!isPasswordMatched) {
        throw new Error('Incorrent Password')
    }

    // access token
    const accessToken = jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }, "accesssecret", {
        expiresIn: "1d"
    });

    // refresh token
    const refreshToken = jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }, "refreshtoken", {
        expiresIn: "7d"
    })
    return {
        accessToken,
        refreshToken
    }

}
export const authService = {
    loginUser
}