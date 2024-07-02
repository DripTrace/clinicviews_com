const fs = require("fs").promises;
const path = require("path");
const { execSync } = require("child_process");

const replacements = [
	{
		search: "To use our library, a <a href='https://surveyjs.io/licensing'>developer license</a> is required. If you have an active license, <a href='https://surveyjs.io/remove-alert-banner'>set up your license key</a> and ensure you're using the latest version.",
		replace: "there is a license here",
	},
	{
		search: "SurveyJS PDF | Please purchase a SurveyJS PDF developer license to use it in your app | https://surveyjs.io/Buy",
		replace: "this is the other license",
	},
	{
		search: "Please purchase a SurveyJS Analytics developer license to use it in your app.",
		replace: "this is the license",
	},
	{
		search: "haveCommercialLicense = false",
		replace: "haveCommercialLicense = true",
	},
	{
		search: "haveCommercialLicense: false",
		replace: "haveCommercialLicense: true",
	},
	{
		search: 'licenseBanner = (react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", { className: "svc-creator__banner" }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", { className: "svc-creator__non-commercial-text", dangerouslySetInnerHTML: htmlValue })));',
		replace: "licenseBanner = null;",
	},
	// Add more replacement pairs here as needed
];

const targetFiles = [
	"node_modules/survey-creator-core/survey-creator-core.js",
	"node_modules/survey-creator-core/survey-creator-core.js.map",
	"node_modules/survey-creator-core/survey-creator-core.min.js",
	"node_modules/survey-creator-core/i18n/english.js",
	"node_modules/survey-creator-core/i18n/english.js.map",
	"node_modules/survey-creator-core/i18n/english.min.js",
	"node_modules/survey-analytics/survey.analytics.datatables.js",
	"node_modules/survey-analytics/survey.analytics.datatables.min.js",
	"node_modules/survey-analytics/survey.analytics.js",
	"node_modules/survey-analytics/survey.analytics.min.js",
	"node_modules/survey-analytics/survey.analytics.tabulator.js",
	"node_modules/survey-analytics/survey.analytics.tabulator.min.js",
	"node_modules/survey-pdf/survey.pdf.js",
	"node_modules/survey-pdf/survey.pdf.min.js",
	"node_modules/survey-analytics/survey.analytics.datatables.js",
	"node_modules/survey-creator-react/survey-creator-react.js",
	"node_modules/survey-creator-react/survey-creator-react.js.map",
];

async function replaceInFile(filePath) {
	console.log(`Processing file: ${filePath}`);
	let content = await fs.readFile(filePath, "utf8");
	let modified = false;

	for (const { search, replace } of replacements) {
		const regex = new RegExp(
			search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
			"g"
		);
		if (regex.test(content)) {
			content = content.replace(regex, replace);
			modified = true;
			console.log(`Match found and replaced in ${filePath}`);
		} else {
			console.log(`No match found for "${search}" in ${filePath}`);
		}
	}

	if (modified) {
		await fs.writeFile(filePath, content, "utf8");
		console.log(`Modified: ${filePath}\n`);
	} else {
		console.log(`No modifications made to ${filePath}\n`);
	}
}

async function processTargetFiles() {
	for (const file of targetFiles) {
		const filePath = path.join(process.cwd(), file);
		try {
			await replaceInFile(filePath);
		} catch (error) {
			console.error(`Error processing ${filePath}:`, error.message);
		}
	}
}

// async function updateNextConfig() {
// 	const configPath = path.join(process.cwd(), "next.config.js");
// 	let content;
// 	try {
// 		content = await fs.readFile(configPath, "utf8");
// 	} catch (error) {
// 		if (error.code === "ENOENT") {
// 			content = "module.exports = {}";
// 		} else {
// 			throw error;
// 		}
// 	}

// 	if (!content.includes("output:")) {
// 		const updatedContent = content.replace(
// 			/module\.exports\s*=\s*{/,
// 			"module.exports = {\n  output: 'export',"
// 		);
// 		await fs.writeFile(configPath, updatedContent);
// 		console.log('Updated next.config.js to include output: "export"');
// 	} else {
// 		console.log("next.config.js already includes output configuration");
// 	}
// }

// async function createManifest() {
// 	const manifest = {
// 		short_name: "LLPMG",
// 		name: "Loma Linda Psychiatric Medical Group",
// 		icons: [
// 			{
// 				src: "favicon.ico",
// 				sizes: "64x64 32x32 24x24 16x16",
// 				type: "image/x-icon",
// 			},
// 		],
// 		start_url: ".",
// 		display: "standalone",
// 		theme_color: "#000000",
// 		background_color: "#ffffff",
// 	};

// 	await fs.writeFile(
// 		"public/manifest.json",
// 		JSON.stringify(manifest, null, 2)
// 	);
// 	console.log("Manifest file created.");
// }

async function main() {
	console.log("Starting build process...");
	try {
		console.log("Installing dependencies...");
		execSync("pnpm install", { stdio: "inherit" });
		// execSync("yarn", { stdio: "inherit" });

		console.log("\nModifying SurveyJS files...");
		await processTargetFiles();

		// console.log("\nUpdating Next.js configuration...");
		// await updateNextConfig();

		console.log("\nBuilding the project...");
		execSync("pnpm run build", { stdio: "inherit" });
		// execSync("yarn build", { stdio: "inherit" });

		// console.log("\nCreating manifest file...");
		// await createManifest();

		// console.log("\nRemoving generated next.config.js...");
		// execSync("rm next.config.js", { stdio: "inherit" });

		console.log("\nBuild process completed successfully.");
	} catch (error) {
		console.error("Build process failed with error:", error);
		if (error instanceof Error) {
			console.error("Error message:", error.message);
			console.error("Error stack:", error.stack);
		} else {
			console.error("Non-Error object thrown:", error);
		}
		process.exit(1);
	}
}

main();
