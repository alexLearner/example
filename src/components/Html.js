import React, { PureComponent } from 'react';
import serialize from 'serialize-javascript';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

export default class Html extends PureComponent {
  renderReduxState() {
    let { state } = this.props;

    const innerHTML = { __html: `window.APP_STATE=${serialize(state, { isJSON: true })};` };
    return <script dangerouslySetInnerHTML={innerHTML} />;
  }

  render() {
    const 
      { style, scripts, chunk, children, head } = this.props,
      seo = this.props.state.layout.seo || {};

    return (
	    <html className="no-js">
        <head>
          {
	          seo.robots && seo.robots.length
              ? <meta name="ROBOTS" content={seo.robots} />
              : null
          }

          <meta name="google-site-verification" content="IvDkMCxwD7HBcyJuSJWHDscFyzfgkUtVWN0Bn0h7tM0" />
          <meta name='yandex-verification' content='4521f8dfcff8271b' />
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1" />
          <link rel="apple-touch-icon" sizes="180x180" href="/assets-front/apple-touch-icon.png" />
          <link rel="icon" type="image/png" href="/assets-front/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="/assets-front/favicon-16x16.png" sizes="16x16" />
          <link rel="manifest" href="/assets-front/manifest.json" />
          <link rel="mask-icon" href="/assets-front/safari-pinned-tab.svg" color="#aed435" />
          <link rel="alternate" hrefLang="en" href="ru.bookimed.com/" />
          <meta name="msapplication-TileColor" content="#aed435" />
          <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
          <title>{seo.title}</title>
	        <meta name="description" content={seo.description} />
          <meta name="theme-color" content="#fffdfd" />
          <link rel="apple-touch-icon" href="apple-touch-icon.png" />
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&amp;subset=cyrillic" rel="stylesheet" />
          { style ? <style id="css" dangerouslySetInnerHTML={{ __html: style }} /> : null }
          <script dangerouslySetInnerHTML={{__html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5XBZQR');
          `}} />

          <script dangerouslySetInnerHTML={{__html: `
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
              ga('create', 'UA-52761017-1', 'bookimed.com', {allowLinker: true});
              ga('require', 'linker');
              ga('linker:autoLink', ['ru.bookimed.com', 'bookimed.com', 'bookimed.dev']);
              ga('require', 'displayfeatures');
              ga('require', 'GTM-MRJD66M');
              ga('require', 'ec');
              ga('send', 'pageview');
          `}} />

          <link rel="stylesheet" href="/assets-front/style.css" />
        </head>

        <body>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-5XBZQR"
              height="0"
              width="0"
              hidden="hidden"
              style={{display:"none", visibility:"hidden"}}/>
            </noscript>

          {/*<div id="app" dangerouslySetInnerHTML={{ __html: children }} />*/}
          <div id="app">
	          {children}
          </div>

          <script defer dangerouslySetInnerHTML={{
	          __html: `if (!window.Intl) document.write('<script defer src="/assets-front/js/Intl.min.js"></scr'+'ipt>')`
          }} />
          { this.renderReduxState() }
          {scripts && scripts.map(script => <script defer key={script} src={script} />)}

          <script async type="text/javascript" dangerouslySetInnerHTML={{__html: `
              !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src="https://cdn.dataroot.co/"+t+"/analytics.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
                analytics.load("t40Gf0B29NVVgxeBBB14fO2eBMWA8K95");
              }}();
              window.onload = function() {analytics.page();}
            `}} />

            <a
              hidden="hidden"
              href="https://metrika.yandex.ua/stat/?id=25987165&amp;from=informer"
              target="_blank" rel="nofollow">
              <img
                src="https://informer.yandex.ru/informer/25987165/3_1_FFFFFFFF_EFEFEFFF_0_pageviews"
                style={{width:"88px", height:"31px", border:0}}
                alt="Яндекс.Метрика"
                title="Яндекс.Метрика: данные за сегодня (просмотры, визиты и уникальные посетители)"
                className="ym-advanced-informer"
                data-cid="25987165"
                data-lang="ru"
              />
            </a>

          <script async dangerouslySetInnerHTML={{__html: `
            (function (d, w, c) {
                (w[c] = w[c] || []).push(function() {
                    try {
                        w.yaCounter25987165 = new Ya.Metrika({
                            id:25987165,
                            clickmap:true,
                            trackLinks:true,
                            accurateTrackBounce:true,
                            webvisor:true
                        });
                    } catch(e) { }
                });

                var n = d.getElementsByTagName("script")[0],
                    s = d.createElement("script"),
                    f = function () { n.parentNode.insertBefore(s, n); };
                s.type = "text/javascript";
                s.async = true;
                s.src = "https://mc.yandex.ru/metrika/watch.js";

                if (w.opera == "[object Opera]") {
                    d.addEventListener("DOMContentLoaded", f, false);
                } else { f(); }
            })(document, window, "yandex_metrika_callbacks");
         `}} />

          <noscript dangerouslySetInnerHTML={{__html: `
            <div>
              <img src="https://mc.yandex.ru/watch/25987165" style={{position:"absolute", left: "-9999px"}} alt="" />
            </div>
           `}}>
          </noscript>

          {
            //  <script type='text/javascript' dangerouslySetInnerHTML={{__html: `
                //(function(){ var widget_id = '07ndbci06U';var d=document;var w=window;function l(){
                //var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = '//code.jivosite.com/script/widget/'+widget_id; var ss = document.getElementsByTagName('script')[0]; ss.parentNode.insertBefore(s, ss);}if(d.readyState=='complete'){l();}else{if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
            //`}} />
          }

        </body>

      </html>
    );
  }
}
