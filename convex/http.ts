import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const validatePayload = async (req: Request): Promise<WebhookEvent | undefined> => {
    try {
        const payload = await req.text();
        console.log("Raw webhook payload:", payload);

        const svixId = req.headers.get("svix-id");
        const svixTimestamp = req.headers.get("svix-timestamp");
        const svixSignature = req.headers.get("svix-signature");

        if (!svixId || !svixTimestamp || !svixSignature) {
            console.error("Missing headers:", {
                "svix-id": svixId,
                "svix-timestamp": svixTimestamp,
                "svix-signature": svixSignature
            });
            return;
        }

        const svixHeaders = {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        };

        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

        try {
            const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
            console.log("Webhook verification successful");
            return event;
        } catch (err) {
            const error = err as Error;
            console.error("Webhook verification failed:", error.message);
            return;
        }
    } catch (err) {
        const error = err as Error;
        console.error("Error in validatePayload:", error.message);
        return;
    }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
    console.log("Received webhook request");
    
    const event = await validatePayload(req);
    
    if (!event) {
        console.error("Failed to validate webhook payload");
        return new Response("Could not validate Clerk payload", {
            status: 400,
        });
    }

    try {
        console.log("Processing webhook event:", event.type, "with data:", JSON.stringify(event.data));
        
        switch (event.type) {
            case "user.created": {
                const userData = {
                    username: `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim(),
                    imageUrl: event.data.image_url || '',
                    clerkId: event.data.id,
                    email: event.data.email_addresses[0].email_address
                };
                console.log("Creating new user with data:", userData);
                const result = await ctx.runMutation(internal.user.create, userData);
                console.log("User created successfully:", result);
                break;
            }

            case "user.updated": {
                // For user.updated, we should first check if the user exists
                const existingUser = await ctx.runQuery(internal.user.get, {
                    clerkId: event.data.id
                });
                console.log("Existing user found:", existingUser);

                const userData = {
                    username: `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim(),
                    imageUrl: event.data.image_url || '',
                    clerkId: event.data.id,
                    email: event.data.email_addresses[0].email_address
                };
                console.log("Updating user with data:", userData);
                const result = await ctx.runMutation(internal.user.create, userData);
                console.log("User updated successfully:", result);
                break;
            }

            default: {
                console.log("Unsupported webhook event type:", event.type);
            }
        }

        return new Response(null, {
            status: 200
        });
    } catch (err) {
        const error = err as Error;
        console.error("Error processing webhook:", error.message, error.stack);
        return new Response(`Error processing webhook: ${error.message}`, {
            status: 500
        });
    }
});

const http = httpRouter();

// Make sure this exact path matches
http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: handleClerkWebhook
});

export default http;
