import axios from "axios";

import { APP_SERVER } from "@/env";

const request = axios.create({ baseURL: APP_SERVER });

export { request };
