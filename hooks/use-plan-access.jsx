import { useAuth } from "@clerk/nextjs";
export function usePlanAccess() {
    const {has}= useAuth();
    const isPro= has?.({plan:"pro"})|| false;
    const isFree= !isPro;
    const planAccess={
        resize:true,
        adjust:true,
        text: true,
        crop: true,
        background: isPro,
        ai_extender: isPro,
        ai_edit: isPro,
    }
    const hasAccess=(toolId)=>{
        return Object.entries(planAccess).filter(([_,hasAccess])=>!hasAccess).map(([toolId])=>toolId);
    }
    const canCreateProject= (currentProjectCount)=>{
        if(isPro) return true;
        return currentProjectCount<3;
    }
    const canExport = (currentExportsThisMonth)=>{
        if(isPro) return true;
        return currentExportsThisMonth<3;
    }
    return{
        userPlan: isPro? "pro":"free",
        isPro,
        isFree,
        hasAccess,
        canCreateProject,
        canExport,
        
    }

    
    
}