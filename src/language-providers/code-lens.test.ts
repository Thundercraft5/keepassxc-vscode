import { createDocument } from "../../test/utils";
import { config } from "../configuration";
import DotEnvParser, * as dotEnvParser from "../secret-detection/parsers/dotenv";
import GenericParser, * as genericParser from "../secret-detection/parsers/generic";
import JsonParser, * as jsonParser from "../secret-detection/parsers/json";
import YamlParser, * as yamlParser from "../secret-detection/parsers/yaml";
import { provideCodeLenses } from "./code-lens";

describe("provideCodeLenses", () => {
	it("returns an empty array if the config is disabled", () => {
		jest.spyOn(config, "get").mockReturnValue(false);
		const codeLenses = provideCodeLenses(createDocument([]));
		expect(codeLenses).toBeUndefined();
	});

	it("uses the generic parser for an unmatched language", () => {
		const genericParserSpy = jest
			.spyOn(genericParser, "default")
			.mockReturnValue({
				getMatches: jest.fn(() => []),
			} as unknown as GenericParser);
		jest.spyOn(config, "get").mockReturnValue(true);
		provideCodeLenses(createDocument([], "plaintext"));
		expect(genericParserSpy).toHaveBeenCalled();
	});

	it("uses the dotenv parser for dotenv language", () => {
		const dotEnvParserSpy = jest
			.spyOn(dotEnvParser, "default")
			.mockReturnValue({
				getMatches: jest.fn(() => []),
			} as unknown as DotEnvParser);
		jest.spyOn(config, "get").mockReturnValue(true);
		provideCodeLenses(createDocument([], "dotenv"));
		expect(dotEnvParserSpy).toHaveBeenCalled();
	});

	it("uses the dotenv parser for json and jsonc file types", () => {
		const jsonParserSpy = jest.spyOn(jsonParser, "default").mockReturnValue({
			getMatches: jest.fn(() => []),
		} as unknown as JsonParser);
		jest.spyOn(config, "get").mockReturnValue(true);
		provideCodeLenses(createDocument([], "json"));
		provideCodeLenses(createDocument([], "jsonc"));
		expect(jsonParserSpy).toHaveBeenCalledTimes(2);
	});

	it("uses the dotenv parser for yaml file type", () => {
		const yamlParserSpy = jest.spyOn(yamlParser, "default").mockReturnValue({
			getMatches: jest.fn(() => []),
		} as unknown as YamlParser);
		jest.spyOn(config, "get").mockReturnValue(true);
		provideCodeLenses(createDocument([], "yaml"));
		expect(yamlParserSpy).toHaveBeenCalled();
	});
});
