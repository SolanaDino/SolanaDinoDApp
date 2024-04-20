import React, { FC } from "react";

import { HeaderBarComp } from "components/header";

import * as styled from "./layout.styles";

export interface ILayoutComp {
  children?: React.ReactNode;
}

export const AppLayout: FC<ILayoutComp> = ({ children }) => {
  return (
    <styled.ContentLayout>
      <HeaderBarComp />
      <styled.PageContent>
        <styled.InnerContent>{children}</styled.InnerContent>
      </styled.PageContent>
      {/* <FooterComp /> */}
    </styled.ContentLayout>
  );
};
