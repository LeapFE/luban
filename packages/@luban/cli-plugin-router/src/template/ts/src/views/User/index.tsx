import React, { FunctionComponent } from "react";
import { EnhancedRouteComponentProps } from "luban-router/es/definitions";

import { Welcome } from "@/components/Welcome";

const User: FunctionComponent<EnhancedRouteComponentProps<{ name: string }>> = ({ meta }) => {
  return <Welcome pageName={meta?.name || ""} />;
};

export { User };
