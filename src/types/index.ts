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

export enum EButton {
  ADD = 'Добавить в избранное',
  REMOVE = 'Убрать из избранного',
  ORANGE = '#DE9426',
  TRANSPARENT = 'transparent'
}

export interface CurrentWeather {
  feelsLike: number
  humidity: number
  name: string
  temp: number
  wind: number
  weather: {
    description: string
    icon: string
    id: number
    main: string
  }
}
