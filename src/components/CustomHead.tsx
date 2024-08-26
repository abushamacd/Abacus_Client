import { Helmet } from "react-helmet";

export const CustomHead = ({ title }: { title: string }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title} || Allardan</title>
    </Helmet>
  );
};
