interface LocalNames {
  [key: string]: string
}

export interface CityInfo {
  country: string
  lat: number
  local_names: LocalNames
  lon: number
  name: string
  state: string
}
