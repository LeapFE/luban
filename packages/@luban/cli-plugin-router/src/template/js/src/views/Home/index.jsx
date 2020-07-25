import React from "react";
import PropTypes from "prop-types";

import { Welcome } from "@/components/Welcome";

const Home = ({ meta }) => <Welcome pageName={meta.name} />;

Home.propTypes = {
  meta: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export { Home };
