"use client";

import React from "react";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FolderOpen,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { BarLoader } from "react-spinners";
import NewProjectModal from "./_components/new-project-model";
import Link from "next/link";

const Dashboard = () => {
  const [showNewProjectModal, setShowNewProjectModal] =
    React.useState(false);

  const {
    data: projects,
    isLoading,
    error,
  } = useConvexQuery(api.projects.getUserProjects);

  return (
    <div className="relative min-h-screen bg-[#080808] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-32 left-[-200px] w-[400px] h-[400px] bg-[#C8FF00]/10 rounded-full blur-[180px]" />

      <div className="absolute bottom-20 right-[-200px] w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-32 pb-20">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl mb-5">
              <Sparkles className="h-4 w-4 text-[#C8FF00]" />
              <span className="text-sm text-white/70">
                Creative Workspace
              </span>
            </div>

            <h1
              className="text-white font-black leading-none tracking-tight text-[clamp(2.5rem,6vw,5rem)]"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Your
              <span className="text-[#C8FF00]"> Projects</span>
            </h1>

            <p className="text-white/60 mt-4 text-base sm:text-lg max-w-xl">
              Create, organize and manage your AI-powered image
              editing projects in one place.
            </p>
          </div>

          <Button
            onClick={() => setShowNewProjectModal(true)}
            className="
              h-14
              px-7
              rounded-2xl
              bg-[#C8FF00]
              text-black
              hover:bg-[#d6ff4f]
              hover:scale-[1.02]
              transition-all
              duration-300
              font-semibold
              shadow-[0_0_30px_rgba(200,255,0,0.25)]
            "
          >
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5">
            <p className="text-white/50 text-sm">Projects</p>
            <h3 className="text-3xl font-bold text-white mt-2">
              {projects?.length || 0}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5">
            <p className="text-white/50 text-sm">Workspace</p>
            <h3 className="text-white font-semibold mt-2">
              Active
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5">
            <p className="text-white/50 text-sm">AI Tools</p>
            <h3 className="text-white font-semibold mt-2">
              Enabled
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5">
            <p className="text-white/50 text-sm">Storage</p>
            <h3 className="text-white font-semibold mt-2">
              Synced
            </h3>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="py-10">
            <BarLoader
              width={"100%"}
              color="#C8FF00"
            />
          </div>
        ) : (
          <>
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link
                    href={`/editor/${project._id}`}
                    key={project._id}
                  >
                    <div
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-[28px]
                        border
                        border-white/10
                        bg-white/[0.04]
                        backdrop-blur-2xl
                        p-6
                        h-full
                        transition-all
                        duration-500
                        hover:-translate-y-2
                        hover:border-[#C8FF00]/30
                      "
                    >
                      {/* Top Highlight */}
                      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#C8FF00]/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                      <div className="flex items-start justify-between mb-8">
                        <div className="h-14 w-14 rounded-2xl bg-[#C8FF00]/10 flex items-center justify-center">
                          <FolderOpen className="h-7 w-7 text-[#C8FF00]" />
                        </div>

                        <ArrowUpRight className="h-5 w-5 text-white/40 group-hover:text-[#C8FF00] transition-all" />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-1">
                        {project.name}
                      </h3>

                      <p className="text-white/50 text-sm line-clamp-3">
                        {project.description ||
                          "Continue editing your creative design project."}
                      </p>

                      <div className="mt-6 pt-4 border-t border-white/10">
                        <span className="text-xs uppercase tracking-widest text-[#C8FF00]">
                          Open Project
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl p-12 text-center">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-[#C8FF00]/10 flex items-center justify-center mb-6">
                  <FolderOpen className="h-12 w-12 text-[#C8FF00]" />
                </div>

                <h2
                  className="text-3xl font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  No Projects Yet
                </h2>

                <p className="text-white/60 max-w-md mx-auto mb-8">
                  Start creating stunning AI-powered image edits by
                  launching your first project.
                </p>

                <Button
                  onClick={() => setShowNewProjectModal(true)}
                  className="
                    bg-[#C8FF00]
                    text-black
                    rounded-2xl
                    px-6
                    h-12
                    hover:scale-105
                    transition-all
                  "
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Project
                </Button>
              </div>
            )}
          </>
        )}

        {showNewProjectModal && (
          <NewProjectModal
            isOpen={showNewProjectModal}
            onClose={() => setShowNewProjectModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;