interface UnitedHealthcareProps {
	id?: string;
	className?: string;
}

const UnitedHealthcare = ({ id, className }: UnitedHealthcareProps) => {
	return (
		<>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 38 66"
				id={id}
				className={className}
			>
				<path
					fill="#002677"
					d="M10.57 62.92A20.47 20.47 0 0 0 17.22 64c10 0 17-7.26 17-21V1.87L38 .06v43.63c0 14.06-7.25 22.25-17.53 22.25a18.1 18.1 0 0 1-9.9-3.02Zm-4.34-4.18A21.79 21.79 0 0 0 12.88 60c8.41 0 14-5.28 14-17.2V5l3.74-1.76v39.9C30.63 55.61 24.31 62 15.52 62a15.84 15.84 0 0 1-9.29-3.26ZM3.6 55a20.24 20.24 0 0 0 5.55 1c6.53 0 10.54-3.58 10.54-13V8.19l3.69-1.76v36.05c0 10.55-4.84 15.33-11.76 15.33A13.08 13.08 0 0 1 3.6 55Zm12.63-11V9.62L0 16.93v27.91c0 5.33 3.36 8.9 8.3 8.9s7.93-3.62 7.93-9.74Z"
				/>
				<path fill="none" d="M0 0h38v66H0z" />
			</svg>
		</>
	);
};

export default UnitedHealthcare;
