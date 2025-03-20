import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";

export const create = internalMutation({
    args: {
        username: v.string(),
        imageUrl: v.string(),
        email: v.string(),
        clerkId: v.string()
    },
    handler: async (ctx, args) => {
        console.log("Creating/updating user with args:", args);
        await ctx.db.insert("users", args);
    }
});

export const get = internalQuery({
    args: {
        clerkId: v.string()
    },
    handler: async (ctx, args) => {
        console.log("Searching for user with clerkId:", args.clerkId);
        const user = await ctx.db.query("users")
            .withIndex("by_clerkId", q => q.eq("clerkId", args.clerkId))
            .unique();
        console.log("Found user:", user);
        return user;
    },
});

// New query to get current user data
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        
        console.log("Getting current user with identity:", identity);
        const user = await ctx.db.query("users")
            .withIndex("by_clerkId", q => 
                q.eq("clerkId", identity.subject)
            )
            .unique();
        console.log("Found current user:", user);
        return user;
    },
});
