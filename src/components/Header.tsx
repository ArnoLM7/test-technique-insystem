import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureHigh } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
	return (
		<>
			<div className="flex items-center justify-center w-full h-16 bg-blue-800 px-4">
				<FontAwesomeIcon
					icon={faTemperatureHigh}
					color="white"
					size="lg"
					className="mr-2"
				/>
				<p className="w-full text-white text-xl">Température des cours d'eau</p>
			</div>
		</>
	);
}
