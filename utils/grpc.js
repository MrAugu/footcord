export function getAutocompleteLeaguesAsync(gRpcClient, query, limit) {
	return new Promise((resolve, reject) => {
		gRpcClient.GetAutocompleteLeagues({ query, limit }, (error, response) => {
			if (error) return reject(error);

			return resolve(response);
		});
	});
}

export function getLeagueInfoAsync(gRpcClient, id) {
	console.log(`calling for ${id}`);

	return new Promise((resolve, reject) => {
		gRpcClient.GetLeagueInfo({ id }, (error, response) => {
			if (error) return reject(error);

			return resolve(response);
		});
	});
}

export function getAutocompleteTeamsAsync(gRpcClient, query, limit) {
	return new Promise((resolve, reject) => {
		gRpcClient.GetAutocompleteTeams({ query, limit }, (error, response) => {
			if (error) return reject(error);

			return resolve(response);
		});
	});
}
