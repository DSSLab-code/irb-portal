import React from "react";
import PageHeader from "../PageHeader/PageHeader";
import PageFooter from "../PageFooter/PageFooter";

function PageLayout({ header = true, footer = true, ...props }) {
  return (
    <div className="page-layout">
      {header && <PageHeader />}

      <main className="container">{props.children}</main>

      {footer && <PageFooter />}
    </div>
  );
}

export default PageLayout;