"use client";

import { Progress } from "@/components/ui/Progress";

interface ProgressLoaderProps {
  progress: number;
}

export default function ProgressLoader({ progress }: ProgressLoaderProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-black/5 dark:bg-white/5 rounded-xl">
      <div className="w-48">
        <Progress value={progress} className="h-2" />
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {progress}%
      </div>
    </div>
  );
}
