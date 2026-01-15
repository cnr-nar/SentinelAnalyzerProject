"use client";
import React from "react";
import { ComposableMap, Geographies, Geography, Marker, Point } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface SentinelAlert {
  country: string;
  city?: string;
  src: string;
  dst: string;
  reason: string;
}

interface CountryData {
  [key: string]: [number, number];
}

interface GeoFeature {
  rsmKey: string;
  geometry: unknown;
  properties: Record<string, unknown>;
}

const countryCoordinates: CountryData = {
  "Turkey": [35.24, 38.96],
  "USA": [-95.71, 37.09],
  "Russia": [105.31, 61.52],
  "Germany": [10.45, 51.16],
  "China": [104.19, 35.86],
  "Netherlands": [5.29, 52.13],
  "Local": [0, 0]
};

interface ThreatMapProps {
  readonly alerts: readonly SentinelAlert[];
}

export default function ThreatMap({ alerts }: ThreatMapProps) {
  return (
    <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
        Global Threat Map
      </h2>
      
      {/* Container div: Yüksekliği sabitledik ve flex ile içeriği ortaladık */}
      <div className="h-[400px] w-full flex items-center justify-center relative bg-black/20 rounded-2xl overflow-hidden">
        <ComposableMap 
          // viewBox: SVG'nin kendi iç koordinat sistemini belirler (taşmayı önler)
          viewBox="0 0 800 450"
          projectionConfig={{ 
            scale: 145, 
            center: [0, 5] // Haritayı dikeyde (Y ekseni) biraz yukarı kaydırarak ortalar
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
<Geographies geography={geoUrl}>
  {({ geographies }: { geographies: GeoFeature[] }) => 
    geographies.map((geo) => (
      <Geography
        key={geo.rsmKey}
        geography={geo}
        fill="#0f172a"
        stroke="#1e293b"
        strokeWidth={0.5}
        style={{
          default: { outline: "none" },
          hover: { fill: "#1e293b", outline: "none" },
          pressed: { outline: "none" }
        }}
      />
    ))
  }
</Geographies>
          
          {alerts.map((alert, i) => {
            const coords = countryCoordinates[alert.country];
            if (!coords) return null;

            return (
              <Marker key={`${alert.src}-${i}`} coordinates={coords}>
                <g>
                  {/* Darbe efekti veren dış halka */}
                  <circle r={8} fill="#ef4444" fillOpacity={0.2} className="animate-ping" />
                  {/* Sabit merkez nokta */}
                  <circle r={3.5} fill="#ef4444" className="shadow-lg shadow-red-500" />
                </g>
                <text 
                  textAnchor="middle" 
                  y={-12} 
                  style={{ 
                    fontFamily: "monospace", 
                    fill: "#64748b", 
                    fontSize: "9px",
                    fontWeight: "bold",
                    pointerEvents: "none",
                    textShadow: "0 0 4px rgba(0,0,0,0.8)"
                  }}
                >
                  {alert.country.toUpperCase()}
                </text>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>
    </div>
  );
}