function convertToJson(res) {
    if (res.ok) {
        return res.json();
    } else {
        throw new Error(`Bad Response: ${res.status} ${res.statusText}`);
    }
}

export default class BaseApi {
    constructor(baseURL, headers) {
        this.baseURL = baseURL;
        this.headers = headers;
    }

    async getData(endpoint, params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = query ? `${this.baseURL}${endpoint}?${query}` : `${this.baseURL}${endpoint}`;

        const response = await fetch(url, { headers: this.headers });
        const data = await convertToJson(response);
        this.checkForErrors(data);

        return data;
    }

    checkForErrors() { }
}


