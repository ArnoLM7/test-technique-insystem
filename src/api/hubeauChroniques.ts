import axios from "axios";

const BASE_URL = "https://hubeau.eaufrance.fr/api/v1/temperature/chronique";

export const fetchChronique = async (params = {}) => {
	const response = await axios.get(BASE_URL, { params });
	return response.data;
};

export const fetchChroniqueDetail = async (
	code_station: string,
	date_debut?: string,
	date_fin?: string
) => {
	const response = await axios.get(BASE_URL, {
		params: {
			code_entite: code_station,
			size: 800,
			date_debut_mesure: date_debut,
			date_fin_mesure: date_fin,
		},
	});
	return response.data;
};

export const fetchLastResultByStation = async (code_station: string) => {
	const response = await axios.get(BASE_URL, {
		params: {
			code_station,
			size: 1,
			sort: "desc",
		},
	});

	return response.data?.data?.[0]?.resultat ?? null;
};
