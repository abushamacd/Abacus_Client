/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Helmet } from "react-helmet";

export const CustomHead = ({ title }: { title: string }) => {
  return (
    // @ts-ignore
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title} || Abacus</title>
    </Helmet>
  );
};
