import React from "react";

import Skeleton from "../Skeleton";


interface PageHeaderProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
  underline?: boolean;
  limitText?: string;
  title?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = props => {
  const { children, title } = props;


  return (
    <>
      <span className={"modalPageHeader"}>
        {title !== undefined ? title : <Skeleton style={{ width: "10em" }} />}
      </span>

      {children}
    </>
  );
};

PageHeader.displayName = "PageHeader";
export default PageHeader;
