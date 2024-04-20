import styled from "@emotion/styled";

import * as consts from "consts";

export const PageContent = styled.div({});

export const ContentLayout = styled.div({
  background:
    "linear-gradient(122deg, rgba(73, 174, 221, 1) 0%, rgba(130, 105, 212, 1) 52%, rgba(181, 33, 201, 1) 100%)",

  backgroundAttachment: "fixed",
  minHeight: "100vh",
});

export const InnerContent = styled.div({
  marginTop: "20px",
  color: "rgba(255,255,255,.85",
  // minHeight: "calc(100vh + 1px)",
  overflowX: "hidden",
});
