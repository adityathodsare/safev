import { NextResponse } from "next/server";

const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { originLat, originLng, destLat, destLng } = body;

    if (
      typeof originLat !== "number" ||
      typeof originLng !== "number" ||
      typeof destLat !== "number" ||
      typeof destLng !== "number" ||
      isNaN(originLat) ||
      isNaN(originLng) ||
      isNaN(destLat) ||
      isNaN(destLng)
    ) {
      return NextResponse.json(
        { error: "Invalid origin or destination coordinates" },
        { status: 400 }
      );
    }

    // Query OSRM driving route API
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;

    const response = await fetch(osrmUrl, {
      headers: { "User-Agent": "RAKSHAK-GPS-Assistant/1.0" },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const rawCoords: [number, number][] = route.geometry.coordinates; // [lng, lat]
        const routeCoords: [number, number][] = rawCoords.map(([lng, lat]) => [
          lat,
          lng,
        ]);
        const distanceKm = Number((route.distance / 1000).toFixed(2));
        const durationMins = Math.max(1, Math.round(route.duration / 60));

        return NextResponse.json({
          routeCoords,
          distanceKm,
          durationMins,
        });
      }
    }

    // Fallback if OSRM router is offline/unreachable
    const distanceKm = Number(
      calculateHaversineDistance(originLat, originLng, destLat, destLng).toFixed(2)
    );
    const durationMins = Math.max(1, Math.round((distanceKm / 35) * 60));
    const fallbackCoords: [number, number][] = [
      [originLat, originLng],
      [destLat, destLng],
    ];

    return NextResponse.json({
      routeCoords: fallbackCoords,
      distanceKm,
      durationMins,
      isFallback: true,
    });
  } catch (error) {
    console.error("AI Route API Error:", error);
    return NextResponse.json(
      { error: "Failed to calculate route" },
      { status: 500 }
    );
  }
}
