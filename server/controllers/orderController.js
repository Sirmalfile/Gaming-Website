// import Order from "../models/Order.js";
// import Product from "../models/Product.js";
// import stripe from "stripe"
// import User from "../models/User.js"

// // Place Order COD : /api/order/cod
// export const placeOrderCOD = async (req, res) => {
//     try {
//         const { userId, items, address } = req.body;
//         if (!address || items.length === 0) {
//             return res.json({ success: false, message: "Invalid data" })
//         }
//         // Calculate Amount Using Items
//         let amount = await items.reduce(async (acc, item) => {
//             const product = await Product.findById(item.product);
//             return (await acc) + product.offerPrice * item.quantity;
//         }, 0)

//         // Add Tax Charge (2%)
//         amount += Math.floor(amount * 0.02);

//         await Order.create({
//             userId,
//             items,
//             amount,
//             address,
//             paymentType: "COD",
//         });

//         return res.json({ success: true, message: "Order Placed Successfully" })
//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// }

// // Place Order Stripe : /api/order/stripe
// export const placeOrderStripe = async (req, res) => {
//     try {
//         const { userId, items, address } = req.body;
//         const { origin } = req.headers;

//         if (!address || items.length === 0) {
//             return res.json({ success: false, message: "Invalid data" })
//         }

//         let productData = [];

//         // Calculate Amount Using Items
//         let amount = await items.reduce(async (acc, item) => {
//             const product = await Product.findById(item.product);
//             productData.push({
//                 name: product.name,
//                 price: product.offerPrice,
//                 quantity: item.quantity,
//             });
//             return (await acc) + product.offerPrice * item.quantity;
//         }, 0)

//         // Add Tax Charge (2%)
//         amount += Math.floor(amount * 0.02);

//         const order = await Order.create({
//             userId,
//             items,
//             amount,
//             address,
//             paymentType: "Online",
//         });

//         // Stripe Gateway Initialize
//         const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

//         // create line items for stripe

//         const line_items = productData.map((item) => {
//             return {
//                 price_data: {
//                     currency: "inr",
//                     product_data: {
//                         name: item.name,
//                     },
//                     unit_amount: Math.floor(item.price + item.price * 0.02) * 100
//                 },
//                 quantity: item.quantity,
//             }
//         })

//         // create session
//         const session = await stripeInstance.checkout.sessions.create({
//             line_items,
//             mode: "payment",
//             success_url: `${origin}/loader?next=my-orders`,
//             cancel_url: `${origin}/cart`,
//             metadata: {
//                 orderId: order._id.toString(),
//                 userId,
//             }
//         })

//         return res.json({ success: true, url: session.url });
//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// }
// // Stripe Webhooks to Verify Payments Action : /stripe
// export const stripeWebhooks = async (request, response) => {
//     // Stripe Gateway Initialize
//     const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

//     const sig = request.headers["stripe-signature"];
//     let event;

//     try {
//         event = stripeInstance.webhooks.constructEvent(
//             request.body,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET
//         );
//     } catch (error) {
//         response.status(400).send(`Webhook Error: ${error.message}`)
//     }

//     // Handle the event
//     switch (event.type) {
//         case "payment_intent.succeeded": {
//             const paymentIntent = event.data.object;
//             const paymentIntentId = paymentIntent.id;

//             // Getting Session Metadata
//             const session = await stripeInstance.checkout.sessions.list({
//                 payment_intent: paymentIntentId,
//             });

//             const { orderId, userId } = session.data[0].metadata;
//             // Mark Payment as Paid
//             await Order.findByIdAndUpdate(orderId, { isPaid: true })
//             // Clear user cart
//             await User.findByIdAndUpdate(userId, { cartItems: {} });
//             break;
//         }
//         case "payment_intent.payment_failed": {
//             const paymentIntent = event.data.object;
//             const paymentIntentId = paymentIntent.id;

//             // Getting Session Metadata
//             const session = await stripeInstance.checkout.sessions.list({
//                 payment_intent: paymentIntentId,
//             });

//             const { orderId } = session.data[0].metadata;
//             await Order.findByIdAndDelete(orderId);
//             break;
//         }


//         default:
//             console.error(`Unhandled event type ${event.type}`)
//             break;
//     }
//     response.json({ received: true });
// }


// // Get Orders by User ID : /api/order/user
// export const getUserOrders = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const orders = await Order.find({
//             userId,
//             $or: [{ paymentType: "COD" }, { isPaid: true }]
//         }).populate("items.product address").sort({ createdAt: -1 });
//         res.json({ success: true, orders });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// }


// // Get All Orders ( for seller / admin) : /api/order/seller
// export const getAllOrders = async (req, res) => {
//     try {
//         const orders = await Order.find({
//             $or: [{ paymentType: "COD" }, { isPaid: true }]
//         }).populate("items.product address").sort({ createdAt: -1 });
//         res.json({ success: true, orders });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// }


import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ----------------------
// Place Order COD
// ----------------------
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);

        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ----------------------
// Place Order (Stripe)
// ----------------------
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        let productData = [];

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);

        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = productData.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
            },
            quantity: item.quantity,
        }));

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            },
        });

        return res.json({ success: true, url: session.url });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ----------------------
// Stripe Webhooks
// ----------------------
export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("❌ Webhook verification failed:", error.message);
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId, userId } = session.data[0].metadata;

            // Mark as paid
            await Order.findByIdAndUpdate(orderId, { isPaid: true });
            await User.findByIdAndUpdate(userId, { cartItems: {} });

            // Send confirmation email
            try {
                const user = await User.findById(userId);
                const email = user.email;

                const msg = {
                    to: email,
                    from: process.env.SENDER_EMAIL,
                    subject: "Payment Successful - Thank You!",
                    text: `Hi ${user.name}, your payment of ₹${paymentIntent.amount / 100} was successful.`,
                    html: `
            <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:10px;">
              <h2 style="color:#4CAF50;">Payment Successful</h2>
              <p>Hi <strong>${user.name}</strong>,</p>
              <p>We’ve received your payment of <strong>₹${paymentIntent.amount / 100}</strong>. Your order has been confirmed!</p>
              <p>You can view your order in <a href="https://eceb-frontend-eight.vercel.app/my-orders" target="_blank">My Orders</a>.</p>
              <hr />
              <p>Thank you for shopping with us!</p>
              <p><strong>ECEB Team</strong></p>
            </div>
          `,
                };

                await sgMail.send(msg);
                console.log(`✅ Email sent to ${email}`);
            } catch (emailError) {
                console.error("❌ SendGrid email error:", emailError);
            }

            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;
        }

        default:
            console.error(`Unhandled event type: ${event.type}`);
    }

    response.json({ received: true });
};

// ----------------------
// Get Orders by User
// ----------------------
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ----------------------
// Get All Orders (Admin)
// ----------------------
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
