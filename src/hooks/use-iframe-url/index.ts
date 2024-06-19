import iframe from "@/templates/iframe.html?raw";
import { useMemo } from "react";
import { transform } from "sucrase";

export function useIframeUrl(code = "", importMap = "") {
	return useMemo(() => {
		let html = "";

		try {
			const output = transform(code, {
				transforms: ["typescript", "jsx"],
				jsxRuntime: "automatic",
				production: true,
			});

			html = getIframeContent(output.code, importMap);
		} catch (e) {
			html = `<h3>Error ocurred! Check your code</h3><pre>${e}</pre>`;
		}

		return URL.createObjectURL(new Blob([html], { type: "text/html" }));
	}, [code, importMap]);
}

export function getIframeContent(script: string, importMap: string) {
	return iframe
		.replace("<!-- IMPORT_MAP -->", importMap)
		.replace("/** SCRIPT */", script);
}
