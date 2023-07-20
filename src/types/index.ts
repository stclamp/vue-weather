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

export interface ForecastData {
  clouds: { all: number }
  dt: number
  dt_txt: string
  main: {
    feels_like: number
    grnd_level: number
    humidity: number
    pressure: number
    sea_level: number
    temp: number
    temp_kf: number
    temp_max: number
    temp_min: number
  }
  pop: number
  sys: { pod: string }
  visibility: number
  weather: {
    description: string
    icon: string
    id: number
    main: string
  }[]
  wind: {
    speed: number
    deg: number
    gust: number
  }
}

export interface GroupedForecast {
  [date: string]: ForecastData[]
}

export interface WeekWeather {
  date: string
  temp?: string
  dayOfWeek: string
  averageTemperature: number
  averageHumidity: number
  averageWind: number
  icon: string
}
