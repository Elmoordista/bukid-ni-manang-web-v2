export interface PointOfInterest {
  title: string;
  description: string;
}

export interface Hotspot {
  id: string;
  targetId: string;
  yaw: number;
  pitch: number;
  label: string;
  screenX?: number;
  screenY?: number;
  type?: string;
  description?: string;
}

export interface VirtualTourLocation {
  id: string;
  name: string;
  image: string;
  description?: string;
  pointsOfInterest?: PointOfInterest[];
  hotspots?: Hotspot[];
}