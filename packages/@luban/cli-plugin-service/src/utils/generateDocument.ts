import ReactDOMServer from "react-dom/server";
import Helmet from "react-helmet";
import ejs from "ejs";
import serialize from "serialize-javascript";

import { Context } from "../definitions";

export interface GenerateDocument {
  (
    template: string,
    context: Context,
    App: JSX.Element | null,
    injectedScripts: string[],
    injectedStyles: string[],
  ): string;
}

/**
 * generate html document
 * @param template
 * @param context
 * @param App
 * @param injectedScripts
 * @param injectedStyles
 */
export const generateDocument: GenerateDocument = (
  template,
  context,
  App,
  injectedScripts,
  injectedStyles,
) => {
  let document = "";

  if (App) {
    const content = ReactDOMServer.renderToString(App);

    const helmet = Helmet.renderStatic();

    document = ejs.render(template, {
      CONTENT: content,
      __INITIAL_DATA__: serialize(context.initProps),
      __USE_SSR__: true,
      __INITIAL_STATE__: serialize(context.initState),
      INJECTED_STYLES: injectedStyles,
      INJECTED_SCRIPTS: injectedScripts,
      link: helmet.link.toString(),
      meta: helmet.meta.toString(),
      script: helmet.script.toString(),
      style: helmet.style.toString(),
      title: helmet.title.toString(),
    });
  }

  return document;
};
