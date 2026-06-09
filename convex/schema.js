import {defineTable,defineSchema } from "convex/server";
import {v} from "convex/values";
export const schema = defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro")),
    projectUsed: v.number(),
    exportsThisMonth: v.number(),
    createdAt: v.number(),
    lastActiveAt: v.number(),
  }).index("by_token", ["tokenIdentifier"])
  .index("by_email", ["email"])
  .searchIndex("search_name",{ searchField: "name" })
  .searchIndex("search_email",{ searchField: "email" }),

  projects: defineTable({
    name: v.string(),
    userId: v.id("users"),
    canvasState: v.any(),
    width: v.number(),
    height: v.number(),
    originalImageUrl: v.optional(v.string()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    activeTransformation: v.optional(v.string()),
    backgroundRemoval: v.optional(v.boolean()),
    folder_id: v.optional(v.id("folders")),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_userId", ["userId"])
  .index("by_user_updated",["userId","updatedAt"])
  .index("by_folder",["folder_id"]),

  folders: defineTable({
    name: v.string(),
    userId: v.id("users"),
    createdAt: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

});
export default schema;
