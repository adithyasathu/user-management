import * as path from "path";
import * as yaml from "yamljs";

export default yaml.load(path.join(__dirname, "contract.yaml"));
