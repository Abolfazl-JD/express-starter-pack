import axios, { AxiosRequestConfig } from 'axios';
import { IToken } from '../token';
import { ApiRequest, Methods } from './api-request';

export enum Formats {
    JSON = 'json',
    FORM = 'form'
}

interface IRequestConfig {
    method: Methods;
    url: string;
    headers: Record<string, string>;
    params?: Record<string, string | number>;
    data?: Record<string, any>;
    format?: Formats;
}

class AxiosRequest extends ApiRequest<IRequestConfig> {
    method: Methods;
    url: string;
    headers: Record<string, string> = {};
    private params?: Record<string, string | number>;
    private data?: Record<string, any>;

    constructor(method: Methods, url: string, token?: IToken) {
        super()
        this.method = method;
        this.url = url;

        // default headers
        if (token) {
            const t = token.getToken();
            this.headers = { Authorization: `${t.tokenType} ${t.accessToken}` };
        }
    }

    setHeaders(headers: Record<string, string>) {
        this.headers = { ...this.headers, ...headers };
        return this;
    }

    setParams(params: Record<string, string | number>) {
        this.params = { ...this.params, ...params };
        return this;
    }

    setData(data: Record<string, any>, format: Formats = Formats.JSON) {
        this.data = (format === Formats.FORM) ? axios.toFormData({ ...this.data, ...data }) : { ...this.data, ...data };
        return this;
    }

    async call(): Promise<any> {
        // this.setHeaders({ activityId: generateUniqueNumber() });

        const requestConfig: AxiosRequestConfig = {
            url: this.url,
            method: this.method,
            headers: this.headers,
            params: this.params,
            data: this.data
        };

        const { data } = await axios(requestConfig);
        return data;
    }
}

export { AxiosRequest };
