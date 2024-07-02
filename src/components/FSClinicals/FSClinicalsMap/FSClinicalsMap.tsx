import React from "react";

interface FSClinicalsMapProps {
	address: string;
	isDarkMode: boolean;
}

const FSClinicalsMap: React.FC<FSClinicalsMapProps> = ({
	address,
	isDarkMode,
}) => {
	const encodedAddress = encodeURIComponent(address);
	const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodedAddress}&zoom=14`;

	return (
		<iframe
			src={mapUrl}
			width="100%"
			height="100%"
			style={{ border: 0 }}
			allowFullScreen={false}
			loading="lazy"
			referrerPolicy="no-referrer-when-downgrade"
			title={`Map of ${address}`}
			className={`rounded-md size-full ${isDarkMode ? "opacity-80" : ""}`}
		></iframe>
	);
};

export default FSClinicalsMap;
