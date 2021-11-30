import { Typography, TypographyProps } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  {
    link: {
      textDecoration: "none"
    }
  },
  { name: "ExternalLink" }
);

interface ExternalLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  href: string;
  className?: string;
  typographyProps?: TypographyProps;
}

const ExternalLink: React.FC<ExternalLinkProps> = props => {
  const { className, children, href, typographyProps, ...rest } = props;

  const classes = useStyles(props);

  return (
    // @ts-ignore
    <a href={href} className={classes.link} {...rest}>
      <Typography className={className} color="primary" {...typographyProps}>
        {children}
      </Typography>
    </a>
  );
};
ExternalLink.displayName = "ExternalLink";
export default ExternalLink;
