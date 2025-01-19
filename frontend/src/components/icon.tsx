import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

// Most of icons are from Material Deisgn Icons
// https://pictogrammers.com/library/mdi/

interface SpritesMap {
	common:
		| "logo"
		| "chevron-down"
		| "translate"
		| "moon-waning-crescent"
		| "white-balance-sunny"
		| "menu"
		| "email"
		| "lock"
		| "eye"
		| "books"
		| "dictionary"
		| "logo"
		| "ukraine"
		| "add"
		| "exit"
		| "filter"
		| "gear"
		| "search"
		| "profile"
		| "add-photo"
		| "busket"
		| "sound"
		| "filter-outline";
	socials: "facebook" | "discord" | "github" | "twitter";
}

type SpriteKey = {
	[Key in keyof SpritesMap]: `${Key}/${SpritesMap[Key]}`;
}[keyof SpritesMap];

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
	name: SpriteKey;
}

const Icon = ({ name, className, ...props }: IconProps) => {
	const [spriteName, iconName] = name.split("/");
	return (
		<svg className={cn("icon", className)} focusable="false" {...props}>
			<use xlinkHref={`/sprites/${spriteName}.svg#${iconName}`} />
		</svg>
	);
};

export default Icon;
