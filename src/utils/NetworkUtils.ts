const API_BASE_URL =
  "https://z65rx9b6cf.execute-api.ca-central-1.amazonaws.com";

export interface SaveDeviceRequest {
  deviceId: string;
  token?: string | undefined;
  active?: boolean | undefined;
}
export const SaveDevice = (device: SaveDeviceRequest): Promise<void> =>
  fetch(`${API_BASE_URL}/save-device`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ device }),
  }).then(extractJson);

const extractJson = async (resp: Response) => {
  const res = await resp.json();
  if (!resp.ok) {
    let error = new Error(res);

    Object.assign(error, res);
    throw error;
  }

  return res;
};
