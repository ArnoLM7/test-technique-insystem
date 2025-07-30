import axios from "axios";

const STATION_URL = "https://hubeau.eaufrance.fr/api/v1/temperature/station";

export const fetchStations = async ({ size = 100 } = {}) => {
	const response = await axios.get(STATION_URL, {
		params: {
			size,
		},
	});
	return response.data;
};

export const fetchStationMetadata = async (code_station: string) => {
	if (!code_station) throw new Error("code_station manquant !");
	const response = await axios.get(STATION_URL, {
		params: {
			code_station,
		},
	});
	return response.data;
};
