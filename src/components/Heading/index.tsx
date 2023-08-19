import { StyledHeader } from "@/components/Heading/style";
import moment from "moment";
import React from "react";

const Heading = () => {
  const currentDate = moment().format("dddd, MMMM D");
  return (
    <StyledHeader>
      <div className="container">
        <h2>My Tasks</h2>
        <p>{currentDate}</p>
      </div>
      <div>Icon pack</div>
    </StyledHeader>
  );
};

export default Heading;