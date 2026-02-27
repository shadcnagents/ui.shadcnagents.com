import { ArrowRight } from "lucide-react";

import { siteConfig } from "@/config/site";

export function AlertBanner() {
	return (
		<div className="relative z-50 w-full bg-[#ADFA1B] text-black">
			<a
				href="https://shadcnagents.com"
				target="_blank"
				rel="noopener"
				className="group flex items-center justify-center gap-3 px-4 py-1.5 transition-colors hover:bg-[#9de610]"
			>
				<div className="hidden h-px w-8 bg-gradient-to-r from-transparent to-black/10 sm:block" />
				<div className="flex items-center gap-2">
					<span className="border shadow-inner border-black/20 bg-black/5 px-1.5 py-0.5 font-pixel-square text-[10px] uppercase tracking-wider text-black">
						New
					</span>
					<span className="font-pixel-square text-[11px] uppercase tracking-wider text-black/80">
						AI SDK Agents
					</span>
					<span className="hidden font-pixel-square text-[11px] text-black/25 sm:inline">
						/
					</span>
					<span className="hidden font-pixel-square text-[11px] tracking-wider text-black/50 sm:inline">
						{siteConfig.counts.stacks}+ AI agent stacks - just copy & paste
					</span>
				</div>
				<ArrowRight className="size-3 text-black/40 transition-transform group-hover:translate-x-0.5 group-hover:text-black" />
				<div className="hidden h-px w-8 bg-gradient-to-l from-transparent to-black/10 sm:block" />
			</a>
		</div>
	);
}
