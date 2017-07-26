import React, { PureComponent } from 'react';
import serialize from 'serialize-javascript';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

const html = `
      <div id="app" >
         <div class="wrapper" data-reactroot=""  data-react-checksum="-498912170">
            <header id="header" class="header_500" >
               <div class="block" >
                  <div id="logo" >
                     <a class="icon" href="/" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="110" height="21" viewBox="0 0 110 21">
                           <title>Bookimed</title>
                           <path d="M74.07 20.14h-3.62v-7.62c0-.94-.16-1.64-.48-2.11-.32-.47-.82-.71-1.51-.71-.92 0-1.59.34-2.01 1.01-.42.66-.63 1.76-.63 3.29v6.14H62.2V7.1h2.76l.49 1.67h.2c.36-.6.87-1.06 1.54-1.4.68-.34 1.45-.51 2.32-.51 1.98 0 3.32.64 4.03 1.91h.32c.35-.6.88-1.07 1.57-1.41.69-.33 1.47-.5 2.34-.5 1.5 0 2.64.38 3.41 1.14.77.75 1.16 1.97 1.16 3.64v8.5h-3.63v-7.62c0-.94-.16-1.64-.48-2.11-.32-.47-.83-.71-1.51-.71-.89 0-1.55.31-1.99.94-.44.62-.66 1.6-.66 2.96zm-28.11-7.09l1.57-1.98 3.72-3.97h4.07l-5.26 5.66 5.59 7.38h-4.18l-3.82-5.28-1.55 1.22v4.06h-3.62V2h3.62v8.09l-.19 2.96zm52.41 5.54c-.88-1.19-1.33-2.84-1.33-4.95 0-2.13.45-3.8 1.36-4.99.9-1.19 2.15-1.79 3.74-1.79 1.67 0 2.94.64 3.82 1.91h.12c-.19-.97-.28-1.84-.28-2.6V2h3.63v18.14h-2.77l-.7-1.69h-.16c-.82 1.28-2.07 1.92-3.76 1.92-1.55 0-2.78-.6-3.67-1.78zM0 3.1h5.4c2.45 0 4.24.34 5.35 1.03 1.11.68 1.67 1.78 1.67 3.28 0 1.02-.25 1.85-.73 2.5-.49.66-1.14 1.05-1.94 1.18v.12c1.1.24 1.89.69 2.38 1.35.48.66.72 1.54.72 2.63 0 1.56-.57 2.77-1.71 3.64-1.14.87-2.69 1.31-4.65 1.31H0zm25.3 15.47c-1.14 1.2-2.72 1.8-4.75 1.8-1.28 0-2.4-.28-3.37-.82-.98-.55-1.72-1.34-2.24-2.36-.53-1.03-.79-2.23-.79-3.59 0-2.13.57-3.79 1.7-4.97 1.13-1.18 2.72-1.77 4.77-1.77 1.27 0 2.39.27 3.36.82.98.54 1.72 1.32 2.25 2.34.52 1.02.78 2.21.78 3.58 0 2.12-.57 3.78-1.71 4.97zm14.37 0c-1.14 1.2-2.72 1.8-4.76 1.8-1.27 0-2.39-.28-3.36-.82-.98-.55-1.72-1.34-2.25-2.36-.52-1.03-.78-2.23-.78-3.59 0-2.13.57-3.79 1.7-4.97 1.13-1.18 2.72-1.77 4.76-1.77 1.28 0 2.4.27 3.37.82.97.54 1.72 1.32 2.24 2.34.53 1.02.79 2.21.79 3.58 0 2.12-.57 3.78-1.71 4.97zm45.9.06c-1.2-1.16-1.81-2.8-1.81-4.92 0-2.18.56-3.87 1.67-5.06 1.11-1.19 2.65-1.79 4.61-1.79 1.87 0 3.33.52 4.37 1.57 1.05 1.05 1.57 2.5 1.57 4.35v1.73h-8.55c.04 1.01.34 1.79.91 2.36.57.57 1.37.85 2.4.85.8 0 1.55-.08 2.26-.24.71-.17 1.46-.43 2.23-.78v2.75c-.63.31-1.31.54-2.03.69-.72.15-1.59.23-2.63.23-2.13 0-3.8-.58-5-1.74zm-25.48 1.51h-3.62V7.1h3.62zm-27.23-3.62c.43.66 1.13.99 2.1.99.97 0 1.66-.33 2.08-.98.42-.66.64-1.64.64-2.93 0-1.29-.22-2.26-.64-2.91-.43-.64-1.13-.96-2.1-.96-.97 0-1.66.32-2.09.96-.43.64-.64 1.61-.64 2.91 0 1.29.22 2.26.65 2.92zm-14.37 0c.43.66 1.13.99 2.1.99.97 0 1.66-.33 2.08-.98.43-.66.64-1.64.64-2.93 0-1.29-.22-2.26-.64-2.91-.43-.64-1.13-.96-2.1-.96-.97 0-1.66.32-2.09.96-.43.64-.64 1.61-.64 2.91 0 1.29.22 2.26.65 2.92zM3.68 12.71v4.44h2.39c1.01 0 1.76-.19 2.24-.57.48-.38.73-.96.73-1.75 0-1.41-1.03-2.12-3.09-2.12zm0-2.87h2.13c1 0 1.72-.15 2.16-.45.45-.3.67-.8.67-1.5 0-.66-.24-1.13-.72-1.41-.49-.28-1.26-.42-2.31-.42H3.68zm84.58.27c-.44.47-.68 1.15-.75 2.03h5.08c-.02-.88-.25-1.56-.7-2.03-.45-.48-1.06-.72-1.83-.72s-1.37.24-1.8.72zm17.09 6.63c.43-.52.66-1.42.7-2.69v-.38c0-1.4-.22-2.4-.66-3.01-.43-.61-1.15-.91-2.14-.91-.8 0-1.43.34-1.88 1.01-.44.67-.67 1.65-.67 2.93 0 1.28.23 2.24.68 2.88.45.65 1.1.97 1.93.97.93 0 1.61-.27 2.04-.8zM59.02.43l-.35.38-.35-.38c-.52-.57-1.36-.57-1.88 0-.59.64-.59 1.68 0 2.32l2.23 2.45 2.23-2.45c.59-.64.59-1.68 0-2.32-.52-.57-1.36-.57-1.88 0z" fill="#fff"></path>
                        </svg>
                     </a>
                  </div>
                  <nav class="nav" >
                     <div class="nav_title_wrap" ><span class="nav_title" ></span></div>
                     <div class="nav_container" >
                        <div class="nav_logo" >
                           <a class="icon" href="/" >
                              <svg xmlns="http://www.w3.org/2000/svg" width="110" height="21" viewBox="0 0 110 21">
                                 <title>Bookimed</title>
                                 <path d="M74.07 20.14h-3.62v-7.62c0-.94-.16-1.64-.48-2.11-.32-.47-.82-.71-1.51-.71-.92 0-1.59.34-2.01 1.01-.42.66-.63 1.76-.63 3.29v6.14H62.2V7.1h2.76l.49 1.67h.2c.36-.6.87-1.06 1.54-1.4.68-.34 1.45-.51 2.32-.51 1.98 0 3.32.64 4.03 1.91h.32c.35-.6.88-1.07 1.57-1.41.69-.33 1.47-.5 2.34-.5 1.5 0 2.64.38 3.41 1.14.77.75 1.16 1.97 1.16 3.64v8.5h-3.63v-7.62c0-.94-.16-1.64-.48-2.11-.32-.47-.83-.71-1.51-.71-.89 0-1.55.31-1.99.94-.44.62-.66 1.6-.66 2.96zm-28.11-7.09l1.57-1.98 3.72-3.97h4.07l-5.26 5.66 5.59 7.38h-4.18l-3.82-5.28-1.55 1.22v4.06h-3.62V2h3.62v8.09l-.19 2.96zm52.41 5.54c-.88-1.19-1.33-2.84-1.33-4.95 0-2.13.45-3.8 1.36-4.99.9-1.19 2.15-1.79 3.74-1.79 1.67 0 2.94.64 3.82 1.91h.12c-.19-.97-.28-1.84-.28-2.6V2h3.63v18.14h-2.77l-.7-1.69h-.16c-.82 1.28-2.07 1.92-3.76 1.92-1.55 0-2.78-.6-3.67-1.78zM0 3.1h5.4c2.45 0 4.24.34 5.35 1.03 1.11.68 1.67 1.78 1.67 3.28 0 1.02-.25 1.85-.73 2.5-.49.66-1.14 1.05-1.94 1.18v.12c1.1.24 1.89.69 2.38 1.35.48.66.72 1.54.72 2.63 0 1.56-.57 2.77-1.71 3.64-1.14.87-2.69 1.31-4.65 1.31H0zm25.3 15.47c-1.14 1.2-2.72 1.8-4.75 1.8-1.28 0-2.4-.28-3.37-.82-.98-.55-1.72-1.34-2.24-2.36-.53-1.03-.79-2.23-.79-3.59 0-2.13.57-3.79 1.7-4.97 1.13-1.18 2.72-1.77 4.77-1.77 1.27 0 2.39.27 3.36.82.98.54 1.72 1.32 2.25 2.34.52 1.02.78 2.21.78 3.58 0 2.12-.57 3.78-1.71 4.97zm14.37 0c-1.14 1.2-2.72 1.8-4.76 1.8-1.27 0-2.39-.28-3.36-.82-.98-.55-1.72-1.34-2.25-2.36-.52-1.03-.78-2.23-.78-3.59 0-2.13.57-3.79 1.7-4.97 1.13-1.18 2.72-1.77 4.76-1.77 1.28 0 2.4.27 3.37.82.97.54 1.72 1.32 2.24 2.34.53 1.02.79 2.21.79 3.58 0 2.12-.57 3.78-1.71 4.97zm45.9.06c-1.2-1.16-1.81-2.8-1.81-4.92 0-2.18.56-3.87 1.67-5.06 1.11-1.19 2.65-1.79 4.61-1.79 1.87 0 3.33.52 4.37 1.57 1.05 1.05 1.57 2.5 1.57 4.35v1.73h-8.55c.04 1.01.34 1.79.91 2.36.57.57 1.37.85 2.4.85.8 0 1.55-.08 2.26-.24.71-.17 1.46-.43 2.23-.78v2.75c-.63.31-1.31.54-2.03.69-.72.15-1.59.23-2.63.23-2.13 0-3.8-.58-5-1.74zm-25.48 1.51h-3.62V7.1h3.62zm-27.23-3.62c.43.66 1.13.99 2.1.99.97 0 1.66-.33 2.08-.98.42-.66.64-1.64.64-2.93 0-1.29-.22-2.26-.64-2.91-.43-.64-1.13-.96-2.1-.96-.97 0-1.66.32-2.09.96-.43.64-.64 1.61-.64 2.91 0 1.29.22 2.26.65 2.92zm-14.37 0c.43.66 1.13.99 2.1.99.97 0 1.66-.33 2.08-.98.43-.66.64-1.64.64-2.93 0-1.29-.22-2.26-.64-2.91-.43-.64-1.13-.96-2.1-.96-.97 0-1.66.32-2.09.96-.43.64-.64 1.61-.64 2.91 0 1.29.22 2.26.65 2.92zM3.68 12.71v4.44h2.39c1.01 0 1.76-.19 2.24-.57.48-.38.73-.96.73-1.75 0-1.41-1.03-2.12-3.09-2.12zm0-2.87h2.13c1 0 1.72-.15 2.16-.45.45-.3.67-.8.67-1.5 0-.66-.24-1.13-.72-1.41-.49-.28-1.26-.42-2.31-.42H3.68zm84.58.27c-.44.47-.68 1.15-.75 2.03h5.08c-.02-.88-.25-1.56-.7-2.03-.45-.48-1.06-.72-1.83-.72s-1.37.24-1.8.72zm17.09 6.63c.43-.52.66-1.42.7-2.69v-.38c0-1.4-.22-2.4-.66-3.01-.43-.61-1.15-.91-2.14-.91-.8 0-1.43.34-1.88 1.01-.44.67-.67 1.65-.67 2.93 0 1.28.23 2.24.68 2.88.45.65 1.1.97 1.93.97.93 0 1.61-.27 2.04-.8zM59.02.43l-.35.38-.35-.38c-.52-.57-1.36-.57-1.88 0-.59.64-.59 1.68 0 2.32l2.23 2.45 2.23-2.45c.59-.64.59-1.68 0-2.32-.52-.57-1.36-.57-1.88 0z" fill="#fff"></path>
                              </svg>
                           </a>
                        </div>
                     </div>
                  </nav>
                  <div id="header_control" >
                     <div class="header_control_phone" >
                        <a href="tel:+380673529182" >+380 (67) 352-91-82</a>
                     </div>
                  </div>
               </div>
            </header>
            <!-- react-empty: 83 -->
            <div class="layout" >
               <div id="p_404" style="margin-top: 70px">
                  <h1 id="p_404_number">500</h1>
                  <h2 id="p_404_title">Произошла ошибка сервера! Наши программисты уже получили уведомление</h2>
                  <h3 id="p_404_subtitle">
                     Перезагрузите страницу или перейдите на 
                     <a href="/"  class="link">Главную</a>
                  </h3>
               </div>
            </div>

            <footer id="footer" >
               <div class="footer_top" >
                  <div class="block" >
                     <ul class="nav_dropdown_list footer_list" >
                        <li class="nav_dropdown_title footer_list_title" >
                           <a href="http://ru.bookimed.com/doc/about" >
                              <i class="triangle mobile" ></i><!-- react-text: 252 -->О нас<!-- /react-text -->
                           </a>
                        </li>
                        <li class="nav_dropdown_item" ><a href="https://ru.bookimed.com/doc/o-proekte" >Кто такие Bookimed</a></li>
                        <li class="nav_dropdown_item" ><a href="https://ru.bookimed.com/doc/contacts" >Контакты</a></li>
                        <li class="nav_dropdown_all" ><a href="http://ru.bookimed.com/LK/registration/" >Добавить свою клинику</a></li>
                     </ul>
                     <ul class="nav_dropdown_list footer_list" >
                        <li class="nav_dropdown_title footer_list_title" >
                           <i class="triangle mobile" ></i><!-- react-text: 262 -->Специализации<!-- /react-text -->
                        </li>
                        <li class="nav_dropdown_item" ><a href="/clinics/direction=onkologiya/" >Онкология (Лечение рака)</a></li>
                        <li class="nav_dropdown_item" ><a href="/clinics/direction=ortopediya-i-travmatologiya/" >Ортопедия и травматология</a></li>
                        <li class="nav_dropdown_item" ><a href="/clinics/direction=nejrohirurgiya/" >Нейрохирургия</a></li>
                        <li class="nav_dropdown_item" ><a href="/clinics/direction=plasticheskaya-hirurgiya/" >Пластическая хирургия</a></li>
                        <li class="nav_dropdown_item" ><a href="/clinics/direction=gastroenterologiya/" >Гастроэнтерология</a></li>
                        <li class="nav_dropdown_all" ><a href="https://ru.bookimed.com/directions/" >Cмотреть все специализации</a></li>
                     </ul>
                     <ul class="nav_dropdown_list footer_list" >
                        <li class="nav_dropdown_title footer_list_title" >
                           <i class="triangle mobile" ></i><!-- react-text: 278 -->Страны<!-- /react-text -->
                        </li>
                        <li class="nav_dropdown_item" ><a href="/clinics/country=germany/" >Германия</a></li>
                        <li class="nav_dropdown_item" ><a href="/clinics/country=israel/" >Израиль</a></li>
                        <li class="nav_dropdown_item" ><a href="/clinics/country=spain/" >Испания</a></li>
                        <li class="nav_dropdown_item" ><a href="/clinics/country=turkey/" >Турция</a></li>
                        <li class="nav_dropdown_item" ><a href="/clinics/country=czech-republic/" >Чехия</a></li>
                        <li class="nav_dropdown_all" ><a href="https://ru.bookimed.com/countries/" >Смотреть все страны</a></li>
                     </ul>
                     <ul class="nav_dropdown_list footer_list" >
                        <li class="nav_dropdown_title footer_list_title" >
                           <i class="triangle mobile" ></i><!-- react-text: 294 -->Полезное<!-- /react-text -->
                        </li>
                        <li class="nav_dropdown_item" ><a href="https://ru.bookimed.com/doc/voprosy-otvety" >Часто задаваемые вопросы</a></li>
                        <li class="nav_dropdown_item" ><a href="https://ru.bookimed.com/article/top-most-advanced-hospitals-in-the-world/" >Рейтинг инновационных клиник мира</a></li>
                        <li class="nav_dropdown_item" ><a href="https://ru.bookimed.com/article/10-sposobov-sobrat-dengi-na-lechenie-za-granicej/" >10 способов собрать деньги на лечение</a></li>
                        <li class="nav_dropdown_all" ><a href="https://ru.bookimed.com/articles" >Смотреть все материалы</a></li>
                     </ul>
                  </div>
               </div>
               <div class="footer_body" >
                  <div class="block" >
                     <div class="footer_left" >
                        <p class="footer_help" >Если у вас возникли вопросы, позвоните или напишите нам:</p>
                        <a href="/cdn-cgi/l/email-protection#0d64636b624d6f62626664606869236e6260" class="link link_mail" >
                           <span class="__cf_email__" data-cfemail="dfb6b1b9b09fbdb0b0b4b6b2babbf1bcb0b2">[email&#160;protected]</span><script data-cfhash='f9e31' type="text/javascript">/* <![CDATA[ */!function(t,e,r,n,c,a,p){try{t=document.currentScript||function(){for(t=document.getElementsByTagName('script'),e=t.length;e--;)if(t[e].getAttribute('data-cfhash'))return t[e]}();if(t&&(c=t.previousSibling)){p=t.parentNode;if(a=c.getAttribute('data-cfemail')){for(e='',r='0x'+a.substr(0,2)|0,n=2;a.length-n;n+=2)e+='%'+('0'+('0x'+a.substr(n,2)^r).toString(16)).slice(-2);p.replaceChild(document.createTextNode(decodeURIComponent(e)),c)}p.removeChild(t)}}catch(u){}}()/* ]]> */</script>
                        </a>
                     </div>
                     <div class="footer_right" >
                        <p data->Горячая линия поддержки</p>
                        <a href="tel:+380673529182" class="link_tel" >+380 (67) 352-91-82</a>
                        <div class="btn btn_red" >
                           <i class="icon icon_phone" >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16">
                                 <title>Shape</title>
                                 <path d="M2.677 2.707l-.9-2.225-1.483.599L5.87 14.877c.232.575.883.852 1.458.62l5.34-2.158c.575-.233.851-.884.619-1.458L9.031 1.348a1.118 1.118 0 0 0-1.458-.62zm.6 1.483l4.45-1.798 1.798 4.45-4.45 1.799zm2.511 6.751c-.165-.408.118-.91.628-1.116.51-.206 1.062-.041 1.226.367.165.408-.117.91-.627 1.116-.51.206-1.062.04-1.227-.367zm2.967-1.199c-.165-.408.118-.91.628-1.116.51-.206 1.062-.041 1.226.367.165.408-.117.91-.627 1.116-.51.206-1.062.041-1.227-.367zm-.841 3.791c-.51.206-1.062.041-1.227-.367-.165-.408.118-.91.628-1.116.51-.206 1.062-.041 1.226.367.165.408-.117.91-.627 1.116zm2.967-1.198c-.51.206-1.062.04-1.227-.368-.165-.407.118-.91.628-1.116.51-.206 1.062-.04 1.226.367.165.408-.117.91-.627 1.117z" fill="#fff"></path>
                              </svg>
                           </i>
                           <!-- react-text: 313 -->Перезвоните мне<!-- /react-text -->
                        </div>
                     </div>
                  </div>
               </div>
            </footer>
            <!-- react-empty: 314 -->
         </div>
      </div>
`

export default class HtmlError extends PureComponent {
	static defaultProps = {
		head: '',
	};

	render() {
		// const {style} = this.props;

		return (
			<html className="no-js">
			<head>
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
				<link rel="alternate" hrefLang="en" href="/assets-front//bookimed.com/" />
				<meta name="msapplication-TileColor" content="#aed435" />
				<meta name="msapplication-TileImage" content="/mstile-144x144.png" />
				<title>Bookimed Error Page</title>
				<link rel="stylesheet" href="/assets-front/style.css" />
				<meta name="theme-color" content="#fffdfd" />
				<link rel="apple-touch-icon" href="apple-touch-icon.png" />
				<script dangerouslySetInnerHTML={{__html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5XBZQR');
          `}} />

				
			</head>


			<body>
			<noscript>
				<iframe
					src="https://www.googletagmanager.com/ns.html?id=GTM-5XBZQR"
					height="0"
					width="0"
					hidden
					style={{display:"none", visibility:"hidden"}}/>
			</noscript>

			<div dangerouslySetInnerHTML={{__html: html}} />
			<a
				hidden
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



			<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&amp;subset=cyrillic" rel="stylesheet" />
			</body>
			</html>
		);
	}
}
