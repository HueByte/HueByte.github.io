"use strict";(self.webpackChunkhuebyte=self.webpackChunkhuebyte||[]).push([[651],{651:function(e,s,a){a.r(s),a.d(s,{default:function(){return f}});var i=a(861),n=a(152),r=a(757),c=a.n(r),t=a(313),l=a(992),d=a(56);var o=a.p+"static/media/topography.903fedcef6d3c1cac9229f6caaddc77e.svg",u=a(972),h=a(672),v=a(417),f=function(){var e=(0,t.useState)([{}]),s=(0,n.Z)(e,2),a=s[0],r=s[1],f=(0,t.useState)({}),m=(0,n.Z)(f,2),j=m[0],x=m[1],p={"c#":"#af36ff",scss:"#ff36c6",html:"#ff5917",javascript:"#ffdf6b",css:"#00fbff",null:"#ff00a2"};(0,t.useEffect)((0,i.Z)(c().mark((function e(){var s,a;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.github.com/users/huebyte/repos").then((function(e){return e.json()}));case 2:return s=e.sent,e.next=5,fetch("https://api.github.com/users/huebyte").then((function(e){return e.json()}));case 5:a=e.sent,r(s.filter((function(e){return 0==e.fork})).sort((function(e,s){return s.stargazers_count-e.stargazers_count}))),console.log(s),x(a);case 9:case"end":return e.stop()}}),e)}))),[]);var N=function(e){var s,a,i;return e=null!==(s=e)&&void 0!==s?s:"null",null!==(a=p[null===(i=e)||void 0===i?void 0:i.toLowerCase()])&&void 0!==a?a:"#FFF"};return(0,v.jsxs)("div",{className:"repositories-container",children:[(0,v.jsxs)("main",{children:[(0,v.jsxs)("div",{className:"user",children:[(0,v.jsx)("div",{className:"avatar",children:(0,v.jsx)("img",{src:"https://github.com/huebyte.png",alt:"huebyte"})}),j?(0,v.jsxs)("div",{className:"user-info",children:[(0,v.jsxs)("div",{className:"name",children:["\ud83c\udf67 ",j.login," \ud83c\udf67"]}),(0,v.jsx)("div",{className:"bio",children:j.bio}),(0,v.jsxs)("div",{className:"field",children:[(0,v.jsxs)("div",{className:"key",children:[(0,v.jsx)(u.kr8,{}),"Repositories:~ $"," "]}),(0,v.jsx)("div",{className:"value",children:j.public_repos})]}),(0,v.jsxs)("div",{className:"field",children:[(0,v.jsxs)("div",{className:"key",children:[(0,v.jsx)(u.hwR,{}),"Followers:~ $"," "]}),(0,v.jsx)("div",{className:"value",children:j.followers})]})]}):(0,v.jsx)(v.Fragment,{})]}),(0,v.jsxs)("div",{className:"repositories",children:[(0,v.jsx)("div",{className:"title",children:"HueByte@Repositories:~ $"}),a.length>0?null===a||void 0===a?void 0:a.map((function(e){var s;return(0,v.jsxs)("a",{href:e.html_url,target:"_blank",className:"repository-container",style:{backgroundImage:"url(".concat(o,")")},children:[(0,v.jsxs)("div",{className:"name",children:[(0,v.jsx)(u.$W,{})," ",e.name]}),(0,v.jsx)("div",{className:"description",children:e.description}),(0,v.jsxs)("div",{className:"info-container",children:[(0,v.jsxs)("div",{className:"item",children:[(0,v.jsx)("div",{className:"key",children:"Main Language"}),(0,v.jsx)("div",{className:"value",style:{color:N(e.language),fontSize:"1.1em"},children:null!==(s=e.language)&&void 0!==s?s:"null"})]}),(0,v.jsxs)("div",{className:"item",children:[(0,v.jsx)("div",{className:"key",children:"Created Date"}),(0,v.jsx)("div",{className:"value",children:new Date(e.created_at).toLocaleDateString()})]}),(0,v.jsxs)("div",{className:"item",children:[(0,v.jsx)("div",{className:"key",children:(0,v.jsx)(h.QJe,{})}),(0,v.jsx)("div",{className:"value",children:e.stargazers_count})]})]})]})})):(0,v.jsx)(d.Z,{})]})]}),(0,v.jsx)(l.Z,{})]})}}}]);