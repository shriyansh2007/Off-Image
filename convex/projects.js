import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const create = mutation({
  args: {
   
    name: v.string(),
    originalImageUrl: v.string(),
    thumbnailUrl: v.string(),
    width: v.number(),
    height: v.number(),
    canvasState: v.optional(v.any()),
    
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: No authentication token found");
    }
    const user = await ctx.runQuery(api.users.getCurrentUser);

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (user.plan === "free") {
      // Optimizations: Only take up to 3 items to check the limit
      const existingProjects = await ctx.db
        .query("projects")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .take(3);

      if (existingProjects.length >= 3) {
        throw new Error(
          "Free plan users can only create up to 3 projects."
        );
      }
    }

    const projectId = await ctx.db.insert("projects", {
      userId: user._id,
     
      name: args.name,
      originalImageUrl: args.originalImageUrl,
      thumbnailUrl: args.thumbnailUrl,
      width: args.width,
      height: args.height,
      canvasState: args.canvasState,
       createdAt: Date.now(),
  updatedAt: Date.now(),

    });

    await ctx.db.patch(user._id, {
      projectUsed: (user.projectUsed || 0) + 1,
      lastActiveAt: Date.now(),
    });

    return projectId;
  },
});

export const getUserProjects = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return []; // Return empty array instead of throwing an error if auth isn't ready yet
    }
    const user = await ctx.runQuery(api.users.getCurrentUser);

    if (!user) {
      return [];
    }

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc") // Fixed: Passing string literal instead of imported function
      .collect();

    return projects;
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Access denied");
    }
    const user = await ctx.runQuery(api.users.getCurrentUser);

    if (!user) {
      throw new Error("Access denied");
    }

    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== user._id) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(args.projectId);

    await ctx.db.patch(user._id, {
      projectUsed: Math.max(0, (user.projectUsed || 1) - 1),
      lastActiveAt: Date.now(),
    });

    return { success: true };
  },
});
export const getProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});