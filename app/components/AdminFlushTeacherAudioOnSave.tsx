"use client";

import type { UIFieldClientComponent } from "payload";
import { useEffect } from "react";

import { installTeacherAudioFetchFlush } from "@/src/features/elearning/teacher-audio-staging";

/** Przed PATCH /api/submissions zapisuje oczekujący feedback głosowy w bazie. */
export const AdminFlushTeacherAudioOnSaveField: UIFieldClientComponent = () => {
  useEffect(() => installTeacherAudioFetchFlush(), []);

  return null;
};
