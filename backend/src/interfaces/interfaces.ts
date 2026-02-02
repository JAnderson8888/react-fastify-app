export type SanitizeCelestialObject = {
  name: string;
  name_limited: string | undefined;
  estimated_diameter: {
    kilometers: { estimated_diameter_min: number; estimated_diameter_max: number };
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
    miles: { estimated_diameter_min: number; estimated_diameter_max: number };
    feet: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
  }>;
};

export interface CacheEntry {
  data: SanitizeCelestialObject[];
  timestamp: number;
}
