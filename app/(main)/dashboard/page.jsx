"use client";
import react from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BarLoader } from 'react-spinners';
import NewProjectModal from './_components/new-project-model';
import Link from 'next/link';
// import getUserProjects from '@/convex/projects';
const Dashboard=()=>{
    const [showNewProjectModal, setShowNewProjectModal] = react.useState(false);
    const {data: projects, isLoading: isloading, error: error}=useConvexQuery(api.projects.getUserProjects);
    console.log(projects);
    return(
        
        <div className="min-h-screen pt-32 pb-16">
            <div className="container mt-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Your Projects</h1>
                        <p className="text-white/70">Create and manage your ai powered image designs</p>

                    </div>
                    <Button onClick={() => setShowNewProjectModal(true)} variant="primary" size="lg" className="gap-2">
                        <Plus className="h-5 w-5"/>
                        New Project</Button>
                </div>
                {isloading ? <BarLoader color="#36d7b7" className="my-4" /> : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {projects && projects.length > 0 ? (
                            projects.map((project) => (
                                <Link href={`/editor/${project._id}`} key={project._id}>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                        <h3 className="text-xl font-bold text-white">{project.name}</h3>
                                        <p className="text-white/70">{project.description}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-white/70">You haven't created any projects yet.</p>
                        )}
                    </div>
                )}
                {showNewProjectModal && (
  <NewProjectModal
    isOpen={showNewProjectModal}
    onClose={() => setShowNewProjectModal(false)}
  />
)}
                {/* <NewProjectModal isOpen={showNewProjectModal} onClose={() => setShowNewProjectModal(false)} /> */}
            </div>
        </div>
    )
}
export default Dashboard;