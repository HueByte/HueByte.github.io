"use strict";(self.webpackChunkhuebyte=self.webpackChunkhuebyte||[]).push([[591],{591:function(e,s,a){a.r(s),a.d(s,{default:function(){return m}});var n=a(214),i=a(861),r=a(152),t=a(313),c=a(992),l=a(56),d=a(972),u=a(672);var o=a.p+"static/media/sprinkle.ca197739aa00743309105f173d5868c1.svg",h=a(417),m=function(){var e=(0,t.useState)(!0),s=(0,r.Z)(e,2),a=s[0],m=s[1],v=(0,t.useState)([]),f=(0,r.Z)(v,2),j=f[0],x=f[1],p=(0,t.useState)(null),N=(0,r.Z)(p,2),g=N[0],b=N[1],y={"c#":"#af36ff",scss:"#ff36c6",html:"#ff5917",javascript:"#ffdf6b",typescript:"#0096ed",css:"#00fbff",null:"#ff00a2"};(0,t.useEffect)((function(){(0,i.Z)((0,n.Z)().mark((function e(){var s,a;return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.github.com/users/huebyte/repos").then((function(e){return e.json()}));case 2:return s=e.sent,e.next=5,fetch("https://api.github.com/users/huebyte").then((function(e){return e.json()}));case 5:a=e.sent,x(s.filter((function(e){return 0==e.fork})).sort((function(e,s){return s.stargazers_count-e.stargazers_count}))),b(a),m(!1);case 9:case"end":return e.stop()}}),e)})))()}),[]);var k=function(e){var s,a,n;return e=null!==(s=e)&&void 0!==s?s:"null",null!==(a=y[null===(n=e)||void 0===n?void 0:n.toLowerCase()])&&void 0!==a?a:"#FFF"};return(0,h.jsxs)("div",{className:"repositories-container",style:{backgroundImage:"url(".concat(o)},children:[(0,h.jsx)("main",{children:a?(0,h.jsx)(l.Z,{local:!0}):(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("div",{className:"user",children:g?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("div",{className:"avatar",children:(0,h.jsx)("img",{src:"https://github.com/huebyte.png",alt:"huebyte"})}),(0,h.jsxs)("div",{className:"user-info",children:[(0,h.jsxs)("div",{className:"name",children:["\ud83c\udf67 ",g.login," \ud83c\udf67"]}),(0,h.jsx)("div",{className:"bio",children:g.bio}),(0,h.jsxs)("div",{className:"field",children:[(0,h.jsxs)("div",{className:"key",children:[(0,h.jsx)(d.kr8,{}),"Repositories:~ $"," "]}),(0,h.jsx)("div",{className:"value",children:g.public_repos})]}),(0,h.jsxs)("div",{className:"field",children:[(0,h.jsxs)("div",{className:"key",children:[(0,h.jsx)(d.hwR,{}),"Followers:~ $"," "]}),(0,h.jsx)("div",{className:"value",children:g.followers})]})]})]}):(0,h.jsx)(h.Fragment,{})}),(0,h.jsxs)("div",{className:"repositories",children:[(0,h.jsx)("div",{className:"title",children:"HueByte@Repositories:~ $"}),j.length>0?null===j||void 0===j?void 0:j.map((function(e){var s;return(0,h.jsxs)("a",{href:e.html_url,target:"_blank",className:"repository-container",children:[(0,h.jsxs)("div",{className:"name",children:[(0,h.jsx)(d.$W,{})," ",e.name]}),(0,h.jsx)("div",{className:"description",children:e.description}),(0,h.jsxs)("div",{className:"info-container",children:[(0,h.jsxs)("div",{className:"item",children:[(0,h.jsx)("div",{className:"key",children:"Main Language"}),(0,h.jsx)("div",{className:"value",style:{color:k(e.language),fontSize:"1.1em"},children:null!==(s=e.language)&&void 0!==s?s:"null"})]}),(0,h.jsxs)("div",{className:"item",children:[(0,h.jsx)("div",{className:"key",children:"Created Date"}),(0,h.jsx)("div",{className:"value",children:new Date(e.created_at).toLocaleDateString()})]}),(0,h.jsxs)("div",{className:"item",children:[(0,h.jsx)("div",{className:"key",children:(0,h.jsx)(u.QJe,{})}),(0,h.jsx)("div",{className:"value",children:e.stargazers_count})]})]})]})})):(0,h.jsx)(h.Fragment,{})]})]})}),(0,h.jsx)(c.Z,{})]})}}}]);