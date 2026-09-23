import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionServices } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";

const createCheckoutSession = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const result = await subscriptionServices.createCheckoutSession(userId as string);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Checkout completed successfully",
            data: result
        })
    }
);

const handleWebHook = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const event = req.body as Buffer;
        const signature = req.headers['stripe-signature']!;
        await subscriptionServices.handleWebHook(event, signature as string);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Webhook trigger successfully",
            data: null
        })
    }
)

export const subscriptionController = {
    createCheckoutSession,
    handleWebHook
}