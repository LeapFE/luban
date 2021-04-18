import React from "react";
import { EnhancedRouteComponentProps } from "@/.luban";
import { Page } from "@/.luban";

import { Welcome } from "@/components/Welcome";

const Prev: Page<EnhancedRouteComponentProps> = ({ name }) => {
  return (
    <div>
      <Welcome pageName={name || "Prev"} />
    </div>
  );
};

export default Prev;
