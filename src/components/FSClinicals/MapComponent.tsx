import React from "react";

interface MapComponentProps {
	address: string;
	isDarkMode: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ address, isDarkMode }) => {
	const encodedAddress = encodeURIComponent(address);
	const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodedAddress}&zoom=14`;

	return (
		<iframe
			width="100%"
			height="300"
			frameBorder="0"
			style={{ border: 0 }}
			src={mapUrl}
			allowFullScreen
			className={`rounded-lg ${isDarkMode ? "opacity-80" : ""}`}
		></iframe>
	);
};

export default MapComponent;
