export function handleFetchErrors(response: Response): Promise<any> {
  if (!response.ok) {
    console.log(JSON.stringify(response));
    // throw Error(response.statusText);
    return Promise.reject<any>(response.statusText);
  }
  return response.json();
}
