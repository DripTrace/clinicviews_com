"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
// import Webcam from 'react-webcam';
// import { useNavigate } from 'react-router-dom';
// import {
//   selectCameraImage,
//   setCameraImage,
// } from '../../../../app/state/slices/cameraSlice';
// import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
// import { useRouter } from 'next/router';
// import CloseIcon from '@material-ui/icons/Close';
// import SendIcon from '@material-ui/icons/Send';
// import { useDispatch, useSelector } from 'react-redux';
// import { getSession, useSession } from 'next-auth/react';
import Image from "next/image";
// import useDocumentUpload from 'pages/server/hooks/useDocumentUpload';
// import { motion } from 'framer-motion';
// import {
//   getDownloadURL,
//   ref,
//   uploadBytesResumable,
//   uploadString,
// } from 'firebase/storage';
// import {
//   db,
//   projectStorage,
//   timestamp,
// } from 'pages/server/lib/database/firebaseStorage';
// import { addDoc, collection } from 'firebase/firestore';
// import { v4 as uuid } from 'uuid';

type Props = {};

// const videoConstraints = {
//   // width: 1080,
//   // height: 720,
//   width: 720,
//   height: 540,
//   facingMode: 'user',
// } as any;

// const screenshotDimensions = { width: 1080, height: 720 };
// const screenshotDimensions = { width: 720, height: 540 };

export default function UploadLLPMGForm({}: Props) {
	const [captured, setCaptured] = useState(false);
	const [uploadingDocument, setUploadingDocument] = useState(false);
	const [createdFile, setCreatedFile] = useState({
		lastModified: 0,
		name: "",
		size: 0,
		type: "",
		webkitRelativePath: "",
	});

	const webcamRef = useRef(null) as any;
	const documentRef = useRef(null) as any;
	const pageRef = useRef(null) as any;
	//   const dispatch = useDispatch() as any;
	//   const router = useRouter();
	//   const { data: session } = useSession();

	//   const cameraImage = useSelector(selectCameraImage);

	const uploadFile = (data: any, info: any) => {
		// define data and connections
		const blob = new Blob([data]);
		const infoBlob = new Blob([JSON.stringify(info)]);
		const url = URL.createObjectURL(blob);

		let xhr = new XMLHttpRequest();
		xhr.open("POST", "/api/documents", true);

		// define new form
		let formData = new FormData();
		formData.append(
			"documentVerification",
			blob,
			"document_verification.png"
		);
		formData.append("accountInfo", infoBlob, "accountInfo.json");

		// action after uploading happens
		xhr.onload = function (e) {
			console.log("File uploading completed!");
		};

		// do the uploading
		console.log("File uploading started!");
		xhr.send(formData);
	};

	// This data/text below is local to the JS script, so we are allowed to send it!
	const uploadDocument = (e: any) => {
		e.preventDefault();

		//     uploadFile(cameraImage, {
		//       stripeAccess: session.user.stripeId,
		//       username: session.user.username,
		//     });
		//   };

		const dataURLtoFile = (dataurl: any, filename: any) => {
			const arr = dataurl.split(",");
			const mime = arr[0].match(/:(.*?);/)[1];
			const bstr = arr[0].toString("base64");
			let n = bstr.length;
			let u8arr = new Uint8Array(n);

			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}

			return new File([u8arr], filename, { type: mime });
		};

		// xmlHTTP return blob respond
		const getImgURL = (url: any, callback: any) => {
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				callback(xhr.response);
			};
			xhr.open("GET", url);
			xhr.responseType = "blob";
			xhr.send();
		};

		const loadURLToInputFiled = (url: any) => {
			getImgURL(url, (imgBlob: any) => {
				// Load img blob to input
				// WIP: UTF8 character error
				let fileName = "verification_document.png";
				let file = new File(
					[imgBlob],
					fileName,
					{ type: "image/png", lastModified: new Date().getTime() }
					// , 'utf-8'
				);
				let container = new DataTransfer();
				container.items.add(file);
				if (captured == true) {
					pageRef.current.querySelector("#png_file").files =
						container.files;
					console.log(documentRef.current.value);
					console.log(documentRef.current.files);
				} else return;
			});
		};

		//   const capture = useCallback(() => {
		// const imageSrc = webcamRef.current!.getScreenshot(screenshotDimensions);
		// dispatch(setCameraImage(imageSrc));

		//     setCaptured(true);
		//   }, [webcamRef]);

		const sendDocument = () => {
			// const id = uuid();
			// const capturedImage = `users/${session.id}/documents/`;
			// const imageRef = ref(projectStorage, `${capturedImage}${id}.png`);
			// const capturedImageRef = collection(db, capturedImage);
			// uploadString(imageRef, cameraImage, 'data_url').then((snapshot) => {
			//   const getUrl = async () => {
			//     const imageUrl = await getDownloadURL(snapshot.ref);
			//     const createdAt = timestamp;
			//     const documentAddition = {
			//       id,
			//       cameraImage,
			//       createdAt,
			//       documentName: 'onboarding_verification',
			//       description: 'additional document verification',
			//       username: session.user.username,
			//       stripeId: session.user.stripeId,
			//     };
			//     const addDocument = {
			//       method: 'POST',
			//       body: JSON.stringify(documentAddition),
			//       headers: {
			//         // 'Content-Type': 'application/json',
			//         'Content-Type': 'multipart/form-data',
			//         // 'Content-Type': 'application/octet-stream',
			//       },
			//     };
			//     await fetch('/api/documents', addDocument).then((res) =>
			//       console.log(res)
			//     );
			//     await addDoc(capturedImageRef, {
			//       imageUrl,
			//       read: false,
			//       createdAt,
			//       username: session.user.username,
			//     });
			//   };
			//   getUrl();
			//   setCaptured(false);
			// });
		};

		//   useEffect(() => {
		//     if (!cameraImage) {
		//       console.log('no image present');
		//     } else {
		//       loadURLToInputFiled(cameraImage);
		//     }
		//   }, [cameraImage, captured]);

		return (
			<div
				className="relative h-[100%] w-[100%] overflow-hidden flex items-center justify-center"
				ref={pageRef}
			>
				{captured === false ? (
					<div className="h-[100%] w-[100%] flex items-center justify-center">
						<div className="h-[25rem] w-[37.5rem] flex items-center justify-center">
							{/* <Webcam
              audio={false}
              height={720}
              imageSmoothing={true}
              ref={webcamRef}
              screenshotFormat="image/png"
              width={1080}
              videoConstraints={videoConstraints}
              mirrored={true}
              screenshotQuality={1}
              className="glass-container object-fill flex items-center justify-center h-[100%] w-[100%]"
            /> */}
						</div>
						{/* <RadioButtonUncheckedIcon
            className="absolute bottom-0 left-[50%] transform translate-x-[-50%] translate-y-[-50%] cursor-pointer text-black dark:text-[#4C8EFF]"
            onClick={capture}
            fontSize="large"
          /> */}
					</div>
				) : (
					<form
						className="h-[100%] w-[100%] flex items-center justify-center"
						// method="post"
						// action="/api/documents"
						// encType="multipart/form-data"
						// onSubmit={}
					>
						{/* <CloseIcon
            onClick={(e) => setCaptured(false)}
            className="absolute top-0 left-0 margin-[5px] cursor-pointer z-50 glass-container"
          /> */}
						<div className="glass-container h-[25rem] w-[37.5rem] flex items-center justify-center">
							{/* <img src={cameraImage} alt="" className="object-contain" /> */}
							{/* <Image
              height={720}
              width={1080}
              src={cameraImage}
              alt=""
              className="glass-container object-fill flex items-center justify-center h-[100%] w-[100%]"
            /> */}
						</div>
						<div
							onClick={sendDocument}
							className="absolute bottom-0 right-0 glass-container flex justify-center items-center p-[1rem] cursor-pointer"
						>
							<h2>Save</h2>
							{/* <SendIcon fontSize="small" className="text-large" /> */}
						</div>
						{/* {createdFile && ( */}
						<input
							title="s"
							className="flex-1"
							name="png"
							id="png_file"
							type="file"
							accept=".png"
							ref={documentRef}
							onChange={(e) => {
								e.preventDefault();
								console.log(e.target.value);
							}}
							disabled
						/>

						<input type="submit" value="upload document" />
						<button
							onClick={(e) => {
								uploadDocument(e);
							}}
						>
							Upload Document
						</button>
					</form>
				)}
			</div>
		);
	};
}
