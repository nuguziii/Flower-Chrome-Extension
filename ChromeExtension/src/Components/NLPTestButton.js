import React from "react";
import Button from "@material-ui/core/Button";
import FlowerAPI from "../apis/FlowerAPI";

export default function NLPTestButton() {
    return (
      <Button variant="outlined" onClick={FlowerAPI.getTags}>
        NLPTest
      </Button>
    );
  }
