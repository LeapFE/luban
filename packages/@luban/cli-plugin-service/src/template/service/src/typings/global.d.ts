interface Window {
  __USE_SSR__?: boolean;
  __INITIAL_DATA__?: any;
  __INITIAL_STATE__?: any;
  __SHARED_DATA__: any,
}

declare const __IS_BROWSER__: boolean | undefined;

interface NodeRequire extends NodeJS.Require {
  resolveWeak: (path: string) => any;
}

declare var require: NodeRequire;
