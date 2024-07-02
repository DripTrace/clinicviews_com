// const path = require("path");
// const glob = require("glob");

// const replacements = [
// 	{
// 		search: "if this portion of the code contains special characters '\"^<8| \\/",
// 		replace:
// 			"othe special characters ^$&\\/><><> that are between ?:( other",
// 	},
// 	// Add more replacement pairs here as needed
// ];

// const excludePatterns = [
// 	".next",
// 	"node_modules/.ignore*",
// 	"node_modules/.pnpm*",
// 	"node_modules/@*",
// 	"pnpm-lock.yaml",
// 	"README.md",
// 	"node_modules/[a-z]*",
// 	".vercel/*",
// 	"*.map",
// 	"*min*",
// 	"*.d.ts",
// 	"*.svg",
// ];

// function escapeRegExp(string) {
// 	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// }

// function replaceInBuffer(buffer) {
// 	let content = buffer.toString("utf8");
// 	let modified = false;

// 	replacements.forEach(({ search, replace }) => {
// 		const regex = new RegExp(escapeRegExp(search), "g");
// 		if (regex.test(content)) {
// 			content = content.replace(regex, replace);
// 			modified = true;
// 		}
// 	});

// 	return { buffer: Buffer.from(content, "utf8"), modified };
// }

// function searchAndReplace(directory, readFile) {
// 	return new Promise((resolve, reject) => {
// 		const globPattern = path.join(directory, "**/*");
// 		const globOptions = {
// 			ignore: excludePatterns.map((pattern) =>
// 				path.join(directory, pattern)
// 			),
// 			nodir: true,
// 		};

// 		glob(globPattern, globOptions, async (err, files) => {
// 			if (err) {
// 				reject(err);
// 				return;
// 			}

// 			try {
// 				const modifications = await Promise.all(
// 					files.map(async (file) => {
// 						const buffer = await readFile(file);
// 						const { buffer: newBuffer, modified } =
// 							replaceInBuffer(buffer);

// 						return { file, buffer: newBuffer, modified };
// 					})
// 				);

// 				resolve(modifications);
// 			} catch (error) {
// 				reject(error);
// 			}
// 		});
// 	});
// }

// module.exports = searchAndReplace;
