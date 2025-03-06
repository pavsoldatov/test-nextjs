import { GithubButton } from "@/components/matterport/buttons/GithubButton";
import MatterportView from "@/components/matterport/MatterportView";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 min-h-screen px-0 py-4 sm:py-10 sm:px-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-1 w-full">
        <div className="w-full relative">
          <MatterportView
            sdkKey={process.env.PUBLIC_MATTERPORT_SDK_KEY ?? ""}
            modelId={process.env.PUBLIC_MATTERPORT_MODEL_ID ?? ""}
          />
        </div>
      </main>

      <footer className="row-start-3 flex gap-1 flex-wrap items-center justify-center">
        <GithubButton href="https://github.com/pavsoldatov/" />
      </footer>
    </div>
  );
}
