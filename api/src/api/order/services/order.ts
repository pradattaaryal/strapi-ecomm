import Stripe from 'stripe';
import { mailerService } from '../../../services/mailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-10-29.clover',
});

export default ({ strapi }: { strapi: any }) => ({
    async createCheckoutSession(products: any[], customerEmail?: string) {
        try {
            const lineItems = await Promise.all(
                products.map(async (product) => {
                    const item = await strapi.db.query('api::product.product').findOne({
                        where: { id: product.id },
                        populate: { img: true },
                    });

                    if (!item) {
                        throw new Error(`Product ${product.id} not found`);
                    }

                    const lineItem: any = {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.title,
                            },
                            unit_amount: Math.round(item.price * 100),
                        },
                        quantity: product.quantity,
                    };

                    if (item.img && item.img.url) {
                        console.log(`${process.env.STRAPI_BASE_URL || 'http://localhost:1337'}${item.img.url}`,);
                        lineItem.price_data.product_data.images = [
                            `${process.env.STRAPI_BASE_URL || 'http://localhost:1337'}${item.img.url}`,

                        ];
                    }

                    return lineItem;
                })
            );


            const session = await stripe.checkout.sessions.create({
                shipping_address_collection: { allowed_countries: ['US', 'CA'] },
                payment_method_types: ['card'],
                mode: 'payment',
                success_url: `${process.env.CLIENT_URL}?success=true`,
                cancel_url: `${process.env.CLIENT_URL}/cart`,
                line_items: lineItems,
                customer_email: customerEmail,
            });
            console.log('sending the mail from order service');
            // Queue a mail job (worker will only log the payload)

            try {
                await mailerService.queueSingleMail({
                    to: 'pradattaaryal1234@gmail.com',
                    subject: 'cccccccccccccc',
                    text: `Stripe session ${session.id} created for ${products.length} items for proce ${session.amount_total}`,
                });
                strapi.log.info('[Order Service] Queued checkout mail job');
            } catch (queueError: any) {
                strapi.log.error('[Order Service] Failed to queue checkout mail job:', queueError);
            }


            // Persist order in DB
            await strapi.db.query('api::order.order').create({
                data: {
                    products,
                    stripeId: session.id,
                },
            });


            return session;
        } catch (error: any) {
            strapi.log.error('Stripe Checkout creation failed:', error);
            throw new Error(`Failed to create checkout session: ${error.message}`);
        }
    },


});
