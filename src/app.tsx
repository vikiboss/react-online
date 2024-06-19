import { useState } from "react";
import { HeaderBar } from "./components/header-bar";
import { MonacoEditor } from "./components/monaco-editor";
import { useIframeUrl } from "./hooks/use-iframe-url";
import appCode from "./templates/app?raw";
import { defaultImportMap } from "./utils/constants";
import { getImportMap } from "./utils/get-import-map";
import { mergeImportMap } from "./utils/merge-importmap";

export function App() {
	const [file, setFile] = useState("app.tsx");
	const [loading, setLoading] = useState(true);
	const [code, setCode] = useState(appCode);
	const [importMap, setImportMap] = useState(
		JSON.stringify(defaultImportMap, null, 2),
	);

	const url = useIframeUrl(code, importMap);

	const files = ["app.tsx", "Import Map"];
	const isImportMap = file === "Import Map";

	return (
		<div className="size-screen flex flex-col font-sans">
			<HeaderBar
				files={files}
				onSelect={setFile}
				selected={file}
				loading={loading}
			/>
			<div className="flex h-full border-0 border-r border-solid border-gray/32">
				<div className="flex flex-1">
					<div className="w-64vw h-full">
						<MonacoEditor
							langs={["typescript", "json"]}
							path={file}
							onAtaStatusChange={setLoading}
							value={isImportMap ? importMap : code}
							defaultLanguage={isImportMap ? "json" : "typescript"}
							onChange={(e) => {
								// TODO: throttle the code change
								if (isImportMap) {
									setImportMap(e ?? "");
								} else {
									setCode(e ?? "");
									const res = mergeImportMap(
										defaultImportMap,
										getImportMap(code),
									);
									setImportMap(JSON.stringify(res, null, 2));
								}
							}}
						/>
					</div>
				</div>
				<iframe title="view" className="flex-1 border-0 p-2" src={url} />
			</div>
		</div>
	);
}
