import React, { useRef, useEffect } from "react";
import OLMap from "ol/Map";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();

  const { center, zoom } = props;

  useEffect(() => {
    const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#e74c3c"/>
  <circle cx="12" cy="12" r="5" fill="#fff"/>
</svg>`;

    const markerFeature = new Feature({
      geometry: new Point(fromLonLat([center.lng, center.lat])),
    });

    markerFeature.setStyle(
      new Style({
        image: new Icon({
          src: `data:image/svg+xml;utf8,${encodeURIComponent(pinSvg)}`,
          anchor: [0.5, 1],
        }), // or use CircleStyle
      }),
    );

    const markerLayer = new VectorLayer({
      source: new VectorSource({ features: [markerFeature] }),
    });

    const map = new OLMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        markerLayer,
      ],
      view: new View({
        center: fromLonLat([center.lng, center.lat]),
        zoom: zoom,
      }),
    });

    return () => map.setTarget(null);
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
