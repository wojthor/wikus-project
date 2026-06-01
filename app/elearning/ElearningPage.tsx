import { Suspense } from "react";

import { ElearningHeader } from "@/app/elearning/ElearningHeader";
import { LoginForm } from "@/app/elearning/LoginForm";
import { PasswordSetSuccessBanner } from "@/app/elearning/PasswordSetSuccessBanner";
import { StudentPanel } from "@/app/elearning/StudentPanel";
import { getElearningUser } from "@/src/features/elearning/auth";
import { fetchElearningModules } from "@/src/features/elearning/fetch-course";

export default async function ElearningPage() {
  const user = await getElearningUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8faff] font-sans text-slate-900 selection:bg-[#cfd8ff]">
        <ElearningHeader />
        <Suspense fallback={null}>
          <PasswordSetSuccessBanner />
        </Suspense>
        <LoginForm />
      </div>
    );
  }

  const modules = await fetchElearningModules();

  return (
    <div className="min-h-screen bg-[#f8faff] font-sans text-slate-900 selection:bg-[#cfd8ff]">
      <ElearningHeader
        user={{
          displayName: user.displayName,
          isCourseAdmin: user.isCourseAdmin,
        }}
      />
      <StudentPanel modules={modules} userId={user.id} isCourseAdmin={user.isCourseAdmin} />
    </div>
  );
}
