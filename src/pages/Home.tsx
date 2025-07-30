import { Link } from "react-router-dom";
import { fetchStations } from "../api/hubeauStations";
import { fetchLastResultByStation } from "../api/hubeauChroniques";
import { useQuery, useQueries } from "@tanstack/react-query";
import { BeatLoader, MoonLoader } from "react-spinners";
import { useState } from "react";

export default function Home() {
	const [selectedCommune, setSelectedCommune] = useState<string>("");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

	const { data, isLoading, isError } = useQuery({
		queryKey: ["stations"],
		queryFn: () => fetchStations({ size: 50 }),
	});

	const resultQueries = useQueries({
		queries:
			data?.data?.map((item: { code_station: string }) => ({
				queryKey: ["result", item.code_station],
				queryFn: () => fetchLastResultByStation(item.code_station),
				enabled: !!item.code_station,
			})) ?? [],
	});

	const communes = Array.from(
		new Set(
			data?.data
				?.map((item: { libelle_commune: string }) => item.libelle_commune)
				.filter(Boolean)
		)
	).sort();

	const filteredStations =
		selectedCommune === ""
			? data?.data
			: data?.data?.filter(
					(item: { libelle_commune: string }) =>
						item.libelle_commune === selectedCommune
			  );

	const combinedData =
		filteredStations?.map(
			(station: { code_station: string }, index: number) => ({
				...station,
				tempResult: resultQueries[index]?.data,
				tempLoading: resultQueries[index]?.isLoading,
			})
		) ?? [];

	if (sortOrder === "asc") {
		combinedData.sort(
			(a: { tempResult: number }, b: { tempResult: number }) => {
				if (
					typeof a.tempResult === "number" &&
					typeof b.tempResult === "number"
				) {
					return a.tempResult - b.tempResult;
				}
				return 0;
			}
		);
	} else if (sortOrder === "desc") {
		combinedData.sort(
			(a: { tempResult: number }, b: { tempResult: number }) => {
				if (
					typeof a.tempResult === "number" &&
					typeof b.tempResult === "number"
				) {
					return b.tempResult - a.tempResult;
				}
				return 0;
			}
		);
	}

	if (isLoading)
		return <MoonLoader className="m-auto mt-64" color="#0004ff" size={40} />;
	if (isError)
		return (
			<p className="text-center mt-10 text-red-500">Erreur de chargement.</p>
		);

	return (
		<div className="p-4">
			<h2 className="text-xl font-semibold mb-4">
				Liste des températures par communes
			</h2>

			<div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
				<div>
					<label htmlFor="commune" className="block mb-1 text-sm font-medium">
						Filtrer par commune :
					</label>
					<select
						id="commune"
						value={selectedCommune}
						onChange={(e) => setSelectedCommune(e.target.value)}
						className="border border-gray-300 rounded p-2 w-full sm:w-64"
					>
						<option value="">-- Toutes les communes --</option>
						{communes.map((commune) => (
							<option key={commune as string} value={commune as string}>
								{commune as string}
							</option>
						))}
					</select>
				</div>

				<div>
					<label htmlFor="sort" className="block mb-1 text-sm font-medium">
						Trier par température :
					</label>
					<select
						id="sort"
						value={sortOrder}
						onChange={(e) =>
							setSortOrder(e.target.value as "asc" | "desc" | "")
						}
						className="border border-gray-300 rounded p-2 w-full sm:w-64"
					>
						<option value="">-- Aucun tri --</option>
						<option value="asc">Ordre croissant</option>
						<option value="desc">Ordre décroissant</option>
					</select>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{combinedData.map(
					(item: {
						code_station: string;
						libelle_commune: string;
						libelle_bassin: string;
						tempResult: number | undefined;
						tempLoading: boolean;
					}) => (
						<Link to={`/station/${item.code_station}`} key={item.code_station}>
							<div className="bg-white p-4 shadow-lg rounded-lg hover:bg-gray-300 transition-shadow duration-300">
								<div className="flex place-content-between items-center">
									<div>
										<p className="font-semibold">
											{item.libelle_commune || "Commune inconnue"}
										</p>
										<p className="text-sm text-gray-500">
											Bassin : {item.libelle_bassin || "Région inconnue"}
										</p>
									</div>
									<div className="bg-blue-700 text-white px-4 py-1 rounded-3xl">
										{item.tempLoading ? (
											<BeatLoader color="#ffffff" size={5} />
										) : typeof item.tempResult === "number" ? (
											<p>{item.tempResult.toFixed(2)} °C</p>
										) : (
											<p>N/A</p>
										)}
									</div>
								</div>
							</div>
						</Link>
					)
				)}
			</div>
		</div>
	);
}
