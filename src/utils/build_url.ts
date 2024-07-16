import _ from 'lodash'
import JsonURL from "@jsonurl/jsonurl";

type ParamValue = string | number | string[] | number[] | boolean | boolean[]
type ParamValueNullable = ParamValue | undefined | null
type ParamValueFlat = string | number | boolean



export const build_search_params = (search_params: {[key: string]: ParamValueNullable} | URLSearchParams) => 
  (search_params instanceof URLSearchParams ? [...search_params.entries()] : Object.entries(search_params))
    .filter((pair): pair is [string, ParamValue] => pair[1] != null)
    .map(([key, value]): [string, ParamValueFlat] => [key, _.isArray(value) ? value.join(",") : value])
    .map(pair => pair.map(encodeURIComponent).join('='))
    .join('&');


export const build_url = (path_name: string, search_params: {[key: string]: ParamValueNullable} | URLSearchParams) => {
  return `${path_name}?${build_search_params(search_params)}`
}


export const build_search_params_safe = (search_params: {[key: string]: ParamValueNullable} | URLSearchParams) => 
  (search_params instanceof URLSearchParams ? [...search_params.entries()] : Object.entries(search_params))
    .filter((pair): pair is [string, ParamValue] => pair[1] != null)
    .map(([key, value]): [string, ParamValueFlat] => [key, _.isArray(value) ? value.join(",") : value])
    .map(pair => pair.join('='))
    .join('&');


export const build_url_safe = (path_name: string, search_params: {[key: string]: ParamValueNullable} | URLSearchParams) => {
  return `${path_name}?${build_search_params_safe(search_params)}`
}


// Ninja


export const build_search_params_ninja = (search_params: {[key: string]: ParamValueNullable} | URLSearchParams) => 
  (search_params instanceof URLSearchParams ? [...search_params.entries()] : Object.entries(search_params))
    .filter((pair): pair is [string, ParamValue] => pair[1] != null)
    .map(([key, value]): [string, ParamValueFlat][]  => _.isArray(value) ? value.map((item): [string, ParamValueFlat] => [key, item]) : [[key, value]])
    .flat()
    .map(pair => pair.map(encodeURIComponent).join('='))
    .join('&');


export const build_url_ninja = (path_name: string, search_params: {[key: string]: ParamValueNullable} | URLSearchParams) => {
  return `${path_name}?${build_search_params_ninja(search_params)}`
}


export const build_url_jsonurl = (path_name: string, key: string, value: any) => {
  const encoded_value = encodeURIComponent(JsonURL.stringify(value, { AQF: true }) ?? "")
  return `${path_name}?${key}=${encoded_value}`
}