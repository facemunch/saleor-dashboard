import { Typography } from "@mui/material";
import React from "react";

import { useStyles } from "./styles";
interface VersionInfoProps {
  dashboardVersion: string;
  coreVersion: string;
}

const VersionInfo: React.FC<VersionInfoProps> = ({
  dashboardVersion,
  coreVersion
}) => {
  const classes = useStyles({});

  if (!dashboardVersion || !coreVersion) {
    return null;
  }

  return (
    <Typography variant="caption" className={classes.container}>
      <div
        className={classes.versionItem}
      >{`dashboard v${dashboardVersion}`}</div>
      <div className={classes.versionItem}>{`core v${coreVersion}`}</div>
    </Typography>
  );
};

VersionInfo.displayName = "VersionInfo";
export default VersionInfo;
