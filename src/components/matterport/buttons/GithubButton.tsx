import Image from "next/image";
import githubSvg from "/public/svg/github.svg";

export const GithubButton = ({ href = "", className = "" }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      <span className="hover:underline">Pavlo Soldatov</span>
      <div className="p-2 rounded-full group-hover:bg-accent transition-colors duration-300">
        <div className="w-6 h-6 relative">
          <Image
            src={githubSvg}
            alt="GitHub"
            fill
            style={{
              transition: "transform 0.5s ease-in-out",
            }}
            className="group-hover:rotate-[360deg]"
          />
        </div>
      </div>
    </a>
  );
};
