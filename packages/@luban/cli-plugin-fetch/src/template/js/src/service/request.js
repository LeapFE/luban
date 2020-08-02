import axios from "axios";

import { APP_SERVER } from "@/environments/env";

const request = axios.create({ baseURL: APP_SERVER });

export { request };
