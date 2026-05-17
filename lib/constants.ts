export interface Planet {
  name: string;
  position?: [number, number, number];
  orbitRadius?: number;
  radius: number;
  color: string;
  emissive: string;
  emissiveIntensity?: number;
  route: string | null;
  type: "star" | "planet" | "asteroid";
}

export const PLANETS: Planet[] = [
  {
    name: "SOL-ADI",
    type: "star",
    position: [0, 0, 0],
    radius: 3.5,
    color: "#fff8e7",
    emissive: "#ff8c00",
    emissiveIntensity: 0.8,
    route: null,
  },
  {
    name: "KETH-7",
    type: "planet",
    orbitRadius: 18,
    radius: 1.8,
    color: "#1a3a6b",
    emissive: "#2255aa",
    route: "/projects/webtale-studio",
  },
  {
    name: "ANIMA-9",
    type: "planet",
    orbitRadius: 28,
    radius: 2.0,
    color: "#2d1b4e",
    emissive: "#6b35cc",
    route: "/projects/anima-9",
  },
  {
    name: "VELTRIX-1",
    type: "planet",
    orbitRadius: 22,
    radius: 1.4,
    color: "#0a2a2a",
    emissive: "#00ccaa",
    route: "/projects/veltrix-1",
  },
  {
    name: "ETHEREA-2",
    type: "planet",
    orbitRadius: 35,
    radius: 1.2,
    color: "#2a0a0f",
    emissive: "#8b2040",
    route: "/projects/etherea-2",
  },
  {
    name: "FRAGMENT-0",
    type: "asteroid",
    orbitRadius: 45,
    radius: 0.4,
    color: "#1a1a1a",
    emissive: "#333333",
    route: null,
  },
];
