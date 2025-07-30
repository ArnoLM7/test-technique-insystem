import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchChroniqueDetail } from "../api/hubeauChroniques";
import { fetchStationMetadata } from "../api/hubeauStations";
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { MoonLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function StationPage() {
	const { codeStation } = useParams();

	const {
		data: mesuresData,
		isLoading: loadingMesures,
		isError: errorMesures,
	} = useQuery({
		queryKey: ["stationChroniques", codeStation],
		queryFn: () => fetchChroniqueDetail(codeStation || ""),
		enabled: !!codeStation,
	});

	const {
		data: metadataData,
		isLoading: loadingMeta,
		isError: errorMeta,
	} = useQuery({
		queryKey: ["stationMetadata", codeStation],
		queryFn: () => fetchStationMetadata(codeStation || ""),
		enabled: !!codeStation,
	});

	if (loadingMesures || loadingMeta) {
		return <MoonLoader className="m-auto mt-64" color="#0004ff" size={40} />;
	}

	if (errorMesures || errorMeta || !mesuresData?.data?.length) {
		return (
			<p className="text-center mt-10 text-red-500">
				Erreur lors du chargement des données ou aucune donnée disponible.
			</p>
		);
	}

	const station = metadataData?.data?.[0];
	const mesures = [...mesuresData.data]
		.filter((m) => m.resultat !== null)
		.sort(
			(a, b) =>
				new Date(a.date_mesure_temp).getTime() -
				new Date(b.date_mesure_temp).getTime()
		)
		.map((m) => ({
			date: m.date_mesure_temp,
			temperature: m.resultat,
		}));

	console.log("METADATA:", metadataData);

	return (
		<div className="p-4">
			<div className="flex gap-2 items-center mb-2">
				<Link to={`/`}>
					<FontAwesomeIcon icon={faArrowLeft} size="lg" />
				</Link>
				<h2 className="text-2xl font-bold">
					Commune : {""}
					{station?.libelle_commune || "Station inconnue"} (
					{station?.code_commune || "N/A"})
				</h2>
			</div>

			<p className="text-sm text-gray-600 mb-4">
				Station : {station?.libelle_station || "N/A"} | Département :{" "}
				{station?.libelle_departement || "N/A"} | Région :{" "}
				{station?.libelle_region || "N/A"}
			</p>

			<div className="bg-white p-4 rounded shadow">
				<h3 className="text-lg font-semibold mb-2">
					Évolution des températures
				</h3>
				{mesures.length > 0 ? (
					<ResponsiveContainer width="100%" height={300}>
						<LineChart
							data={mesures}
							margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
						>
							<Line type="monotone" dataKey="temperature" stroke="#3b82f6" />
							<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
							<XAxis dataKey="date" tick={{ fontSize: 10 }} />
							<YAxis unit=" °C" />
							<Tooltip />
						</LineChart>
					</ResponsiveContainer>
				) : (
					<p className="text-gray-500">
						Aucune mesure disponible pour cette station.
					</p>
				)}
			</div>
		</div>
	);
}
