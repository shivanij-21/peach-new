// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let apisUrl = "https://streamingtv.fun:3440/api/all_apis";
let siteName = "cricbuzzer";
let isIcasino = false;
let ICasinoPad = "https://icasino365.xyz/pad=85";
let baseUrl = "https://icasino365.xyz/pad=85";

export const environment = {
  production: false,
  origin:'cricbuzzer.io',
  apisUrl: apisUrl,
  baseUrl: baseUrl,

  siteName: siteName,
  isIcasino: isIcasino,
  ICasinoPad: ICasinoPad,
  domain:"cricbuzzer.com",

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
