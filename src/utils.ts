const tiny = require('tiny-json-http')
import axios from 'axios';

export async function get(url:string, params?:any, config?:any) {
    let opts = {
        url : url,
        headers : null,
        data : null
    };
    
    if (config && config.headers) {
        opts['headers'] = config.headers;
    }

    if (params) {
        opts['data'] = params;
    }

    try {
        const response = await tiny.get(opts);
        return response.body;
    } catch(error) {
        throw error;
    }
}

export async function post(url:string, data:any, config?:any) {
    let opts = {
        url : url,
        headers : null,
        data : null
    };
    
    if (config && config.headers) {
        opts['headers'] = config.headers;
    }

    if (data) {
        opts['data'] = data;
    }

    try {
        const response = await tiny.post(opts);
        return response.body;
    } catch(error) {
        throw error;
    }
}


export async function get2(url:string, params?:any, config?:any) {
    let args = config ? config : null;
    
    if (params != null) {
        if (args == null) {
            args = {};
        }
        args['params'] = params;
    }
    
    try {
        const response = await axios.get(url, args);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function post2(url:string, data:any, config?:any) {
    try {
        const response = await axios.post(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports = { get, post };
