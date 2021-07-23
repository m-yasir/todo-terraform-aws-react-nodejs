type REST_METHOD = "GET" | "POST" | "PATCH" | "UPDATE" | "DELETE";

export async function _fetch<T>(
	url: string,
	method: REST_METHOD = "GET",
	body?: any,
	contentType?: string
): Promise<T> {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(url, {
				headers: {
					"content-type": contentType ?? "application/json"
				},
				body: body ? JSON.stringify(body) : body,
				method
			})
				.then(async (res) => {
					const json = res.json();
					if (res.ok) {
						return json;
					}
					throw new Error(await json);
				})
				.catch((err) => {
					reject(err);
				});
			resolve(response as T);
		} catch (err) {
			return reject(err);
		}
	});
}
