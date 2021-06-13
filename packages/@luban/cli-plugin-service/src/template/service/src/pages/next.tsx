import React from "react";
import { EnhancedRouteComponentProps } from "luban";

import { Welcome } from "@/components/Welcome";

class Next extends React.Component<EnhancedRouteComponentProps, unknown> {
  constructor(props: EnhancedRouteComponentProps) {
    super(props);
  }

  render(): JSX.Element {
    return <Welcome pageName={this.props.name || "Next"} />;
  }
}

export default Next;
