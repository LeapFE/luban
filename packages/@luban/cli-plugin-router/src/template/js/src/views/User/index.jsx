import React from "react";
import PropTypes from "prop-types";

import { Welcome } from "@/components/Welcome";

const User = ({ meta }) => <Welcome pageName={meta.name} />;

User.propTypes = {
  meta: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export { User };
