import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handlCheckoutCompleted, handleChangeSubscription } from "../../utils/subscription.utils";

const createCheckoutSession = async (userId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            include: {
                subscription: true
            }
        });

        let stripeCustomerId = user.subscription?.stripeCustomerId;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id }
            })
            stripeCustomerId = customer.id
        };

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: config.stripe_product_price_id,
                    quantity: 1
                }
            ],
            mode: "subscription",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${config.app_url}/premium?success=true`,
            cancel_url: `${config.app_url}/payment?success=false`,
            metadata: { userId: user.id }
        })
        return session.url;
    });
    return {
        paymentUrl: transactionResult
    }
};

const handleWebhook = async (payload: Buffer, signature: string) => {
    const endpointSecret = config.stripe_webhook_secret
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    );

    switch (event.type) {
        case 'checkout.session.completed':
            //Occurs when a Checkout Session has been successfully completed.
            await handlCheckoutCompleted(event.data.object)
            break;
        case 'customer.subscription.updated':
            //Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
            await handleChangeSubscription(event.data.object)
            break;
        /**
         * To test this run this comman 
         * "stripe subscriptions cancel existing_sub_id"
         * run this on terminal
         */
        case 'customer.subscription.deleted':
            //Occurs whenever a customer’s subscription ends
            await handleChangeSubscription(event.data.object)
            break;
        default:
            // Unexpected event type
            console.log(`No events matched. Unhandled event type ${event.type}.`);
            break;
    }

    // switch (event.type) {
    //     case 'checkout.session.completed':
    //         // Occurs when a Checkout Session has been successfully completed.
    //         const session: Stripe.Checkout.Session = event.data.object;
    //         const userId = session.metadata?.userId;
    //         const stripeCustomerId = session.customer as string;
    //         const stripeSubscriptionId = session.subscription as string;

    //         if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    //             throw new Error("Webhook Failed: Missing required session data");
    //         }

    //         const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

    //         // FIXED: current_period_end is directly on the subscription object!
    //         const currentPeriodEndInSeconds = stripeSubscription.current_period_end;
    //         const currentPeriodEnd = new Date(currentPeriodEndInSeconds * 1000);

    //         await prisma.subscription.upsert({
    //             where: {
    //                 userId
    //             },
    //             create: {
    //                 userId,
    //                 stripeCustomerId,
    //                 stripeSubscriptionId,
    //                 status: "ACTIVE",
    //                 currentPeriodEnd
    //             },
    //             update: {
    //                 stripeCustomerId,
    //                 stripeSubscriptionId,
    //                 status: "ACTIVE",
    //                 currentPeriodEnd
    //             }
    //         });

    //         break;

    //     case 'customer.subscription.updated':
    //         break;
    //     case 'customer.subscription.deleted':
    //         break;
    //     default:
    //         console.log(`No events matched. Unhandled event type ${event.type}.`);
    //         break;
    // }
};

const getSubscriptionStatus = async (userId: string) => {
    const isSubscriptionExist = await prisma.subscription.findUnique({
        where: {
            userId
        }
    });
    const isActive = isSubscriptionExist?.status === "ACTIVE" && isSubscriptionExist.currentPeriodEnd && new Date(isSubscriptionExist.currentPeriodEnd) > new Date();

    return {
        status: isSubscriptionExist?.status,
        isSubscribed: isActive,
        currentPeriodEnd: isSubscriptionExist?.currentPeriodEnd
    }
}

export const subscriptionService = {
    createCheckoutSession,
    handleWebhook,
    getSubscriptionStatus
}