!function(){var t={273:function(t,e,n){"use strict";var i=n(582),r=n(842),o=n(960),s=n(639).orient2d;function a(t,e,n){e=Math.max(0,void 0===e?2:e),n=n||0;var r=function(t){for(var e=t[0],n=t[0],i=t[0],r=t[0],s=0;s<t.length;s++){var a=t[s];a[0]<e[0]&&(e=a),a[0]>i[0]&&(i=a),a[1]<n[1]&&(n=a),a[1]>r[1]&&(r=a)}var u=[e,n,i,r],l=u.slice();for(s=0;s<t.length;s++)o(t[s],u)||l.push(t[s]);return function(t){t.sort(x);for(var e=[],n=0;n<t.length;n++){for(;e.length>=2&&p(e[e.length-2],e[e.length-1],t[n])<=0;)e.pop();e.push(t[n])}for(var i=[],r=t.length-1;r>=0;r--){for(;i.length>=2&&p(i[i.length-2],i[i.length-1],t[r])<=0;)i.pop();i.push(t[r])}return i.pop(),e.pop(),e.concat(i)}(l)}(t),s=new i(16);s.toBBox=function(t){return{minX:t[0],minY:t[1],maxX:t[0],maxY:t[1]}},s.compareMinX=function(t,e){return t[0]-e[0]},s.compareMinY=function(t,e){return t[1]-e[1]},s.load(t);for(var a,l=[],h=0;h<r.length;h++){var c=r[h];s.remove(c),a=m(c,a),l.push(a)}var f=new i(16);for(h=0;h<l.length;h++)f.insert(d(l[h]));for(var g=e*e,y=n*n;l.length;){var _=l.shift(),b=_.p,P=_.next.p,S=v(b,P);if(!(S<y)){var E=S/g;(c=u(s,_.prev.p,b,P,_.next.next.p,E,f))&&Math.min(v(c,b),v(c,P))<=E&&(l.push(_),l.push(m(c,_)),s.remove(c),f.remove(_),f.insert(d(_)),f.insert(d(_.next)))}}_=a;var A=[];do{A.push(_.p),_=_.next}while(_!==a);return A.push(_.p),A}function u(t,e,n,i,o,s,a){for(var u=new r([],l),c=t.data;c;){for(var p=0;p<c.children.length;p++){var d=c.children[p],m=c.leaf?g(d,n,i):h(n,i,d);m>s||u.push({node:d,dist:m})}for(;u.length&&!u.peek().node.children;){var v=u.pop(),y=v.node,x=g(y,e,n),_=g(y,i,o);if(v.dist<x&&v.dist<_&&f(n,y,a)&&f(i,y,a))return y}(c=u.pop())&&(c=c.node)}return null}function l(t,e){return t.dist-e.dist}function h(t,e,n){if(c(t,n)||c(e,n))return 0;var i=y(t[0],t[1],e[0],e[1],n.minX,n.minY,n.maxX,n.minY);if(0===i)return 0;var r=y(t[0],t[1],e[0],e[1],n.minX,n.minY,n.minX,n.maxY);if(0===r)return 0;var o=y(t[0],t[1],e[0],e[1],n.maxX,n.minY,n.maxX,n.maxY);if(0===o)return 0;var s=y(t[0],t[1],e[0],e[1],n.minX,n.maxY,n.maxX,n.maxY);return 0===s?0:Math.min(i,r,o,s)}function c(t,e){return t[0]>=e.minX&&t[0]<=e.maxX&&t[1]>=e.minY&&t[1]<=e.maxY}function f(t,e,n){for(var i,r,o,s,a=Math.min(t[0],e[0]),u=Math.min(t[1],e[1]),l=Math.max(t[0],e[0]),h=Math.max(t[1],e[1]),c=n.search({minX:a,minY:u,maxX:l,maxY:h}),f=0;f<c.length;f++)if(i=c[f].p,r=c[f].next.p,o=t,i!==(s=e)&&r!==o&&p(i,r,o)>0!=p(i,r,s)>0&&p(o,s,i)>0!=p(o,s,r)>0)return!1;return!0}function p(t,e,n){return s(t[0],t[1],e[0],e[1],n[0],n[1])}function d(t){var e=t.p,n=t.next.p;return t.minX=Math.min(e[0],n[0]),t.minY=Math.min(e[1],n[1]),t.maxX=Math.max(e[0],n[0]),t.maxY=Math.max(e[1],n[1]),t}function m(t,e){var n={p:t,prev:null,next:null,minX:0,minY:0,maxX:0,maxY:0};return e?(n.next=e.next,n.prev=e,e.next.prev=n,e.next=n):(n.prev=n,n.next=n),n}function v(t,e){var n=t[0]-e[0],i=t[1]-e[1];return n*n+i*i}function g(t,e,n){var i=e[0],r=e[1],o=n[0]-i,s=n[1]-r;if(0!==o||0!==s){var a=((t[0]-i)*o+(t[1]-r)*s)/(o*o+s*s);a>1?(i=n[0],r=n[1]):a>0&&(i+=o*a,r+=s*a)}return(o=t[0]-i)*o+(s=t[1]-r)*s}function y(t,e,n,i,r,o,s,a){var u,l,h,c,f=n-t,p=i-e,d=s-r,m=a-o,v=t-r,g=e-o,y=f*f+p*p,x=f*d+p*m,_=d*d+m*m,b=f*v+p*g,P=d*v+m*g,S=y*_-x*x,E=S,A=S;0===S?(l=0,E=1,c=P,A=_):(c=y*P-x*b,(l=x*P-_*b)<0?(l=0,c=P,A=_):l>E&&(l=E,c=P+x,A=_)),c<0?(c=0,-b<0?l=0:-b>y?l=E:(l=-b,E=y)):c>A&&(c=A,-b+x<0?l=0:-b+x>y?l=E:(l=-b+x,E=y));var G=(1-(h=0===c?0:c/A))*r+h*s-((1-(u=0===l?0:l/E))*t+u*n),M=(1-h)*o+h*a-((1-u)*e+u*i);return G*G+M*M}function x(t,e){return t[0]===e[0]?t[1]-e[1]:t[0]-e[0]}r.default&&(r=r.default),t.exports=a,t.exports.default=a},895:function(t){t.exports=function(t,e,n,i){var r=t[0],o=t[1],s=!1;void 0===n&&(n=0),void 0===i&&(i=e.length);for(var a=(i-n)/2,u=0,l=a-1;u<a;l=u++){var h=e[n+2*u+0],c=e[n+2*u+1],f=e[n+2*l+0],p=e[n+2*l+1];c>o!=p>o&&r<(f-h)*(o-c)/(p-c)+h&&(s=!s)}return s}},960:function(t,e,n){var i=n(895),r=n(139);t.exports=function(t,e,n,o){return e.length>0&&Array.isArray(e[0])?r(t,e,n,o):i(t,e,n,o)},t.exports.nested=r,t.exports.flat=i},139:function(t){t.exports=function(t,e,n,i){var r=t[0],o=t[1],s=!1;void 0===n&&(n=0),void 0===i&&(i=e.length);for(var a=i-n,u=0,l=a-1;u<a;l=u++){var h=e[u+n][0],c=e[u+n][1],f=e[l+n][0],p=e[l+n][1];c>o!=p>o&&r<(f-h)*(o-c)/(p-c)+h&&(s=!s)}return s}},513:function(t){function e(t,e,n){n=n||0;var i,r,o,s,a,u,l,h=[0,0];return i=t[1][1]-t[0][1],r=t[0][0]-t[1][0],o=i*t[0][0]+r*t[0][1],s=e[1][1]-e[0][1],a=e[0][0]-e[1][0],u=s*e[0][0]+a*e[0][1],S(l=i*a-s*r,0,n)||(h[0]=(a*o-r*u)/l,h[1]=(i*u-s*o)/l),h}function n(t,e,n,i){var r=e[0]-t[0],o=e[1]-t[1],s=i[0]-n[0],a=i[1]-n[1];if(s*o-a*r==0)return!1;var u=(r*(n[1]-t[1])+o*(t[0]-n[0]))/(s*o-a*r),l=(s*(t[1]-n[1])+a*(n[0]-t[0]))/(a*r-s*o);return u>=0&&u<=1&&l>=0&&l<=1}function i(t,e,n){return(e[0]-t[0])*(n[1]-t[1])-(n[0]-t[0])*(e[1]-t[1])}function r(t,e,n){return i(t,e,n)>0}function o(t,e,n){return i(t,e,n)>=0}function s(t,e,n){return i(t,e,n)<0}function a(t,e,n){return i(t,e,n)<=0}t.exports={decomp:function(t){var e=_(t);return e.length>0?b(t,e):[t]},quickDecomp:function t(e,n,i,u,l,h,m){h=h||100,m=m||0,l=l||25,n=void 0!==n?n:[],i=i||[],u=u||[];var v=[0,0],g=[0,0],x=[0,0],_=0,b=0,S=0,E=0,A=0,G=0,M=0,w=[],O=[],I=e,C=e;if(C.length<3)return n;if(++m>h)return console.warn("quickDecomp: max level ("+h+") reached."),n;for(var N=0;N<e.length;++N)if(d(I,N)){i.push(I[N]),_=b=Number.MAX_VALUE;for(var Y=0;Y<e.length;++Y)r(f(I,N-1),f(I,N),f(I,Y))&&a(f(I,N-1),f(I,N),f(I,Y-1))&&(x=P(f(I,N-1),f(I,N),f(I,Y),f(I,Y-1)),s(f(I,N+1),f(I,N),x)&&(S=c(I[N],x))<b&&(b=S,g=x,G=Y)),r(f(I,N+1),f(I,N),f(I,Y+1))&&a(f(I,N+1),f(I,N),f(I,Y))&&(x=P(f(I,N+1),f(I,N),f(I,Y),f(I,Y+1)),r(f(I,N-1),f(I,N),x)&&(S=c(I[N],x))<_&&(_=S,v=x,A=Y));if(G===(A+1)%e.length)x[0]=(g[0]+v[0])/2,x[1]=(g[1]+v[1])/2,u.push(x),N<A?(p(w,I,N,A+1),w.push(x),O.push(x),0!==G&&p(O,I,G,I.length),p(O,I,0,N+1)):(0!==N&&p(w,I,N,I.length),p(w,I,0,A+1),w.push(x),O.push(x),p(O,I,G,N+1));else{if(G>A&&(A+=e.length),E=Number.MAX_VALUE,A<G)return n;for(Y=G;Y<=A;++Y)o(f(I,N-1),f(I,N),f(I,Y))&&a(f(I,N+1),f(I,N),f(I,Y))&&(S=c(f(I,N),f(I,Y)))<E&&y(I,N,Y)&&(E=S,M=Y%e.length);N<M?(p(w,I,N,M+1),0!==M&&p(O,I,M,C.length),p(O,I,0,N+1)):(0!==N&&p(w,I,N,C.length),p(w,I,0,M+1),p(O,I,M,N+1))}return w.length<O.length?(t(w,n,i,u,l,h,m),t(O,n,i,u,l,h,m)):(t(O,n,i,u,l,h,m),t(w,n,i,u,l,h,m)),n}return n.push(e),n},isSimple:function(t){var e,i=t;for(e=0;e<i.length-1;e++)for(var r=0;r<e-1;r++)if(n(i[e],i[e+1],i[r],i[r+1]))return!1;for(e=1;e<i.length-2;e++)if(n(i[0],i[i.length-1],i[e],i[e+1]))return!1;return!0},removeCollinearPoints:function(t,e){for(var n=0,i=t.length-1;t.length>3&&i>=0;--i)h(f(t,i-1),f(t,i),f(t,i+1),e)&&(t.splice(i%t.length,1),n++);return n},removeDuplicatePoints:function(t,e){for(var n=t.length-1;n>=1;--n)for(var i=t[n],r=n-1;r>=0;--r)E(i,t[r],e)&&t.splice(n,1)},makeCCW:function(t){for(var e=0,n=t,i=1;i<t.length;++i)(n[i][1]<n[e][1]||n[i][1]===n[e][1]&&n[i][0]>n[e][0])&&(e=i);return!r(f(t,e-1),f(t,e),f(t,e+1))&&(function(t){for(var e=[],n=t.length,i=0;i!==n;i++)e.push(t.pop());for(i=0;i!==n;i++)t[i]=e[i]}(t),!0)}};var u=[],l=[];function h(t,e,n,r){if(r){var o=u,s=l;o[0]=e[0]-t[0],o[1]=e[1]-t[1],s[0]=n[0]-e[0],s[1]=n[1]-e[1];var a=o[0]*s[0]+o[1]*s[1],h=Math.sqrt(o[0]*o[0]+o[1]*o[1]),c=Math.sqrt(s[0]*s[0]+s[1]*s[1]);return Math.acos(a/(h*c))<r}return 0===i(t,e,n)}function c(t,e){var n=e[0]-t[0],i=e[1]-t[1];return n*n+i*i}function f(t,e){var n=t.length;return t[e<0?e%n+n:e%n]}function p(t,e,n,i){for(var r=n;r<i;r++)t.push(e[r])}function d(t,e){return s(f(t,e-1),f(t,e),f(t,e+1))}var m=[],v=[];function g(t,n,i){var r,s,u=m,l=v;if(o(f(t,n+1),f(t,n),f(t,i))&&a(f(t,n-1),f(t,n),f(t,i)))return!1;s=c(f(t,n),f(t,i));for(var h=0;h!==t.length;++h)if((h+1)%t.length!==n&&h!==n&&o(f(t,n),f(t,i),f(t,h+1))&&a(f(t,n),f(t,i),f(t,h))&&(u[0]=f(t,n),u[1]=f(t,i),l[0]=f(t,h),l[1]=f(t,h+1),r=e(u,l),c(f(t,n),r)<s))return!1;return!0}function y(t,e,i){for(var r=0;r!==t.length;++r)if(r!==e&&r!==i&&(r+1)%t.length!==e&&(r+1)%t.length!==i&&n(f(t,e),f(t,i),f(t,r),f(t,r+1)))return!1;return!0}function x(t,e,n,i){var r=i||[];if(function(t){t.length=0}(r),e<n)for(var o=e;o<=n;o++)r.push(t[o]);else{for(o=0;o<=n;o++)r.push(t[o]);for(o=e;o<t.length;o++)r.push(t[o])}return r}function _(t){for(var e=[],n=[],i=[],r=[],o=Number.MAX_VALUE,s=0;s<t.length;++s)if(d(t,s))for(var a=0;a<t.length;++a)if(g(t,s,a)){n=_(x(t,s,a,r)),i=_(x(t,a,s,r));for(var u=0;u<i.length;u++)n.push(i[u]);n.length<o&&(e=n,o=n.length,e.push([f(t,s),f(t,a)]))}return e}function b(t,e){if(0===e.length)return[t];if(e instanceof Array&&e.length&&e[0]instanceof Array&&2===e[0].length&&e[0][0]instanceof Array){for(var n=[t],i=0;i<e.length;i++)for(var r=e[i],o=0;o<n.length;o++){var s=b(n[o],r);if(s){n.splice(o,1),n.push(s[0],s[1]);break}}return n}r=e,i=t.indexOf(r[0]),o=t.indexOf(r[1]);return-1!==i&&-1!==o&&[x(t,i,o),x(t,o,i)]}function P(t,e,n,i,r){r=r||0;var o=e[1]-t[1],s=t[0]-e[0],a=o*t[0]+s*t[1],u=i[1]-n[1],l=n[0]-i[0],h=u*n[0]+l*n[1],c=o*l-u*s;return S(c,0,r)?[0,0]:[(l*a-s*h)/c,(o*h-u*a)/c]}function S(t,e,n){return n=n||0,Math.abs(t-e)<=n}function E(t,e,n){return S(t[0],e[0],n)&&S(t[1],e[1],n)}},582:function(t){t.exports=function(){"use strict";function t(t,i,r,o,s){!function t(n,i,r,o,s){for(;o>r;){if(o-r>600){var a=o-r+1,u=i-r+1,l=Math.log(a),h=.5*Math.exp(2*l/3),c=.5*Math.sqrt(l*h*(a-h)/a)*(u-a/2<0?-1:1);t(n,i,Math.max(r,Math.floor(i-u*h/a+c)),Math.min(o,Math.floor(i+(a-u)*h/a+c)),s)}var f=n[i],p=r,d=o;for(e(n,r,i),s(n[o],f)>0&&e(n,r,o);p<d;){for(e(n,p,d),p++,d--;s(n[p],f)<0;)p++;for(;s(n[d],f)>0;)d--}0===s(n[r],f)?e(n,r,d):e(n,++d,o),d<=i&&(r=d+1),i<=d&&(o=d-1)}}(t,i,r||0,o||t.length-1,s||n)}function e(t,e,n){var i=t[e];t[e]=t[n],t[n]=i}function n(t,e){return t<e?-1:t>e?1:0}var i=function(t){void 0===t&&(t=9),this._maxEntries=Math.max(4,t),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),this.clear()};function r(t,e,n){if(!n)return e.indexOf(t);for(var i=0;i<e.length;i++)if(n(t,e[i]))return i;return-1}function o(t,e){s(t,0,t.children.length,e,t)}function s(t,e,n,i,r){r||(r=d(null)),r.minX=1/0,r.minY=1/0,r.maxX=-1/0,r.maxY=-1/0;for(var o=e;o<n;o++){var s=t.children[o];a(r,t.leaf?i(s):s)}return r}function a(t,e){return t.minX=Math.min(t.minX,e.minX),t.minY=Math.min(t.minY,e.minY),t.maxX=Math.max(t.maxX,e.maxX),t.maxY=Math.max(t.maxY,e.maxY),t}function u(t,e){return t.minX-e.minX}function l(t,e){return t.minY-e.minY}function h(t){return(t.maxX-t.minX)*(t.maxY-t.minY)}function c(t){return t.maxX-t.minX+(t.maxY-t.minY)}function f(t,e){return t.minX<=e.minX&&t.minY<=e.minY&&e.maxX<=t.maxX&&e.maxY<=t.maxY}function p(t,e){return e.minX<=t.maxX&&e.minY<=t.maxY&&e.maxX>=t.minX&&e.maxY>=t.minY}function d(t){return{children:t,height:1,leaf:!0,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}}function m(e,n,i,r,o){for(var s=[n,i];s.length;)if(!((i=s.pop())-(n=s.pop())<=r)){var a=n+Math.ceil((i-n)/r/2)*r;t(e,a,n,i,o),s.push(n,a,a,i)}}return i.prototype.all=function(){return this._all(this.data,[])},i.prototype.search=function(t){var e=this.data,n=[];if(!p(t,e))return n;for(var i=this.toBBox,r=[];e;){for(var o=0;o<e.children.length;o++){var s=e.children[o],a=e.leaf?i(s):s;p(t,a)&&(e.leaf?n.push(s):f(t,a)?this._all(s,n):r.push(s))}e=r.pop()}return n},i.prototype.collides=function(t){var e=this.data;if(!p(t,e))return!1;for(var n=[];e;){for(var i=0;i<e.children.length;i++){var r=e.children[i],o=e.leaf?this.toBBox(r):r;if(p(t,o)){if(e.leaf||f(t,o))return!0;n.push(r)}}e=n.pop()}return!1},i.prototype.load=function(t){if(!t||!t.length)return this;if(t.length<this._minEntries){for(var e=0;e<t.length;e++)this.insert(t[e]);return this}var n=this._build(t.slice(),0,t.length-1,0);if(this.data.children.length)if(this.data.height===n.height)this._splitRoot(this.data,n);else{if(this.data.height<n.height){var i=this.data;this.data=n,n=i}this._insert(n,this.data.height-n.height-1,!0)}else this.data=n;return this},i.prototype.insert=function(t){return t&&this._insert(t,this.data.height-1),this},i.prototype.clear=function(){return this.data=d([]),this},i.prototype.remove=function(t,e){if(!t)return this;for(var n,i,o,s=this.data,a=this.toBBox(t),u=[],l=[];s||u.length;){if(s||(s=u.pop(),i=u[u.length-1],n=l.pop(),o=!0),s.leaf){var h=r(t,s.children,e);if(-1!==h)return s.children.splice(h,1),u.push(s),this._condense(u),this}o||s.leaf||!f(s,a)?i?(n++,s=i.children[n],o=!1):s=null:(u.push(s),l.push(n),n=0,i=s,s=s.children[0])}return this},i.prototype.toBBox=function(t){return t},i.prototype.compareMinX=function(t,e){return t.minX-e.minX},i.prototype.compareMinY=function(t,e){return t.minY-e.minY},i.prototype.toJSON=function(){return this.data},i.prototype.fromJSON=function(t){return this.data=t,this},i.prototype._all=function(t,e){for(var n=[];t;)t.leaf?e.push.apply(e,t.children):n.push.apply(n,t.children),t=n.pop();return e},i.prototype._build=function(t,e,n,i){var r,s=n-e+1,a=this._maxEntries;if(s<=a)return o(r=d(t.slice(e,n+1)),this.toBBox),r;i||(i=Math.ceil(Math.log(s)/Math.log(a)),a=Math.ceil(s/Math.pow(a,i-1))),(r=d([])).leaf=!1,r.height=i;var u=Math.ceil(s/a),l=u*Math.ceil(Math.sqrt(a));m(t,e,n,l,this.compareMinX);for(var h=e;h<=n;h+=l){var c=Math.min(h+l-1,n);m(t,h,c,u,this.compareMinY);for(var f=h;f<=c;f+=u){var p=Math.min(f+u-1,c);r.children.push(this._build(t,f,p,i-1))}}return o(r,this.toBBox),r},i.prototype._chooseSubtree=function(t,e,n,i){for(;i.push(e),!e.leaf&&i.length-1!==n;){for(var r=1/0,o=1/0,s=void 0,a=0;a<e.children.length;a++){var u=e.children[a],l=h(u),c=(f=t,p=u,(Math.max(p.maxX,f.maxX)-Math.min(p.minX,f.minX))*(Math.max(p.maxY,f.maxY)-Math.min(p.minY,f.minY))-l);c<o?(o=c,r=l<r?l:r,s=u):c===o&&l<r&&(r=l,s=u)}e=s||e.children[0]}var f,p;return e},i.prototype._insert=function(t,e,n){var i=n?t:this.toBBox(t),r=[],o=this._chooseSubtree(i,this.data,e,r);for(o.children.push(t),a(o,i);e>=0&&r[e].children.length>this._maxEntries;)this._split(r,e),e--;this._adjustParentBBoxes(i,r,e)},i.prototype._split=function(t,e){var n=t[e],i=n.children.length,r=this._minEntries;this._chooseSplitAxis(n,r,i);var s=this._chooseSplitIndex(n,r,i),a=d(n.children.splice(s,n.children.length-s));a.height=n.height,a.leaf=n.leaf,o(n,this.toBBox),o(a,this.toBBox),e?t[e-1].children.push(a):this._splitRoot(n,a)},i.prototype._splitRoot=function(t,e){this.data=d([t,e]),this.data.height=t.height+1,this.data.leaf=!1,o(this.data,this.toBBox)},i.prototype._chooseSplitIndex=function(t,e,n){for(var i,r,o,a,u,l,c,f=1/0,p=1/0,d=e;d<=n-e;d++){var m=s(t,0,d,this.toBBox),v=s(t,d,n,this.toBBox),g=(r=m,o=v,a=void 0,u=void 0,l=void 0,c=void 0,a=Math.max(r.minX,o.minX),u=Math.max(r.minY,o.minY),l=Math.min(r.maxX,o.maxX),c=Math.min(r.maxY,o.maxY),Math.max(0,l-a)*Math.max(0,c-u)),y=h(m)+h(v);g<f?(f=g,i=d,p=y<p?y:p):g===f&&y<p&&(p=y,i=d)}return i||n-e},i.prototype._chooseSplitAxis=function(t,e,n){var i=t.leaf?this.compareMinX:u,r=t.leaf?this.compareMinY:l;this._allDistMargin(t,e,n,i)<this._allDistMargin(t,e,n,r)&&t.children.sort(i)},i.prototype._allDistMargin=function(t,e,n,i){t.children.sort(i);for(var r=this.toBBox,o=s(t,0,e,r),u=s(t,n-e,n,r),l=c(o)+c(u),h=e;h<n-e;h++){var f=t.children[h];a(o,t.leaf?r(f):f),l+=c(o)}for(var p=n-e-1;p>=e;p--){var d=t.children[p];a(u,t.leaf?r(d):d),l+=c(u)}return l},i.prototype._adjustParentBBoxes=function(t,e,n){for(var i=n;i>=0;i--)a(e[i],t)},i.prototype._condense=function(t){for(var e=t.length-1,n=void 0;e>=0;e--)0===t[e].children.length?e>0?(n=t[e-1].children).splice(n.indexOf(t[e]),1):this.clear():o(t[e],this.toBBox)},i}()},639:function(t,e){!function(t){"use strict";const e=134217729,n=33306690738754706e-32;function i(t,e,n,i,r){let o,s,a,u,l=e[0],h=i[0],c=0,f=0;h>l==h>-l?(o=l,l=e[++c]):(o=h,h=i[++f]);let p=0;if(c<t&&f<n)for(h>l==h>-l?(a=o-((s=l+o)-l),l=e[++c]):(a=o-((s=h+o)-h),h=i[++f]),o=s,0!==a&&(r[p++]=a);c<t&&f<n;)h>l==h>-l?(a=o-((s=o+l)-(u=s-o))+(l-u),l=e[++c]):(a=o-((s=o+h)-(u=s-o))+(h-u),h=i[++f]),o=s,0!==a&&(r[p++]=a);for(;c<t;)a=o-((s=o+l)-(u=s-o))+(l-u),l=e[++c],o=s,0!==a&&(r[p++]=a);for(;f<n;)a=o-((s=o+h)-(u=s-o))+(h-u),h=i[++f],o=s,0!==a&&(r[p++]=a);return 0===o&&0!==p||(r[p++]=o),p}function r(t){return new Float64Array(t)}const o=33306690738754716e-32,s=22204460492503146e-32,a=11093356479670487e-47,u=r(4),l=r(8),h=r(12),c=r(16),f=r(4);t.orient2d=function(t,r,p,d,m,v){const g=(r-v)*(p-m),y=(t-m)*(d-v),x=g-y;if(0===g||0===y||g>0!=y>0)return x;const _=Math.abs(g+y);return Math.abs(x)>=o*_?x:-function(t,r,o,p,d,m,v){let g,y,x,_,b,P,S,E,A,G,M,w,O,I,C,N,Y,T;const X=t-d,B=o-d,V=r-m,k=p-m;b=(C=(E=X-(S=(P=e*X)-(P-X)))*(G=k-(A=(P=e*k)-(P-k)))-((I=X*k)-S*A-E*A-S*G))-(M=C-(Y=(E=V-(S=(P=e*V)-(P-V)))*(G=B-(A=(P=e*B)-(P-B)))-((N=V*B)-S*A-E*A-S*G))),u[0]=C-(M+b)+(b-Y),b=(O=I-((w=I+M)-(b=w-I))+(M-b))-(M=O-N),u[1]=O-(M+b)+(b-N),b=(T=w+M)-w,u[2]=w-(T-b)+(M-b),u[3]=T;let R=function(t,e){let n=e[0];for(let i=1;i<t;i++)n+=e[i];return n}(4,u),D=s*v;if(R>=D||-R>=D)return R;if(g=t-(X+(b=t-X))+(b-d),x=o-(B+(b=o-B))+(b-d),y=r-(V+(b=r-V))+(b-m),_=p-(k+(b=p-k))+(b-m),0===g&&0===y&&0===x&&0===_)return R;if(D=a*v+n*Math.abs(R),(R+=X*_+k*g-(V*x+B*y))>=D||-R>=D)return R;b=(C=(E=g-(S=(P=e*g)-(P-g)))*(G=k-(A=(P=e*k)-(P-k)))-((I=g*k)-S*A-E*A-S*G))-(M=C-(Y=(E=y-(S=(P=e*y)-(P-y)))*(G=B-(A=(P=e*B)-(P-B)))-((N=y*B)-S*A-E*A-S*G))),f[0]=C-(M+b)+(b-Y),b=(O=I-((w=I+M)-(b=w-I))+(M-b))-(M=O-N),f[1]=O-(M+b)+(b-N),b=(T=w+M)-w,f[2]=w-(T-b)+(M-b),f[3]=T;const F=i(4,u,4,f,l);b=(C=(E=X-(S=(P=e*X)-(P-X)))*(G=_-(A=(P=e*_)-(P-_)))-((I=X*_)-S*A-E*A-S*G))-(M=C-(Y=(E=V-(S=(P=e*V)-(P-V)))*(G=x-(A=(P=e*x)-(P-x)))-((N=V*x)-S*A-E*A-S*G))),f[0]=C-(M+b)+(b-Y),b=(O=I-((w=I+M)-(b=w-I))+(M-b))-(M=O-N),f[1]=O-(M+b)+(b-N),b=(T=w+M)-w,f[2]=w-(T-b)+(M-b),f[3]=T;const j=i(F,l,4,f,h);b=(C=(E=g-(S=(P=e*g)-(P-g)))*(G=_-(A=(P=e*_)-(P-_)))-((I=g*_)-S*A-E*A-S*G))-(M=C-(Y=(E=y-(S=(P=e*y)-(P-y)))*(G=x-(A=(P=e*x)-(P-x)))-((N=y*x)-S*A-E*A-S*G))),f[0]=C-(M+b)+(b-Y),b=(O=I-((w=I+M)-(b=w-I))+(M-b))-(M=O-N),f[1]=O-(M+b)+(b-N),b=(T=w+M)-w,f[2]=w-(T-b)+(M-b),f[3]=T;const $=i(j,h,4,f,c);return c[$-1]}(t,r,p,d,m,v,_)},t.orient2dfast=function(t,e,n,i,r,o){return(e-o)*(n-r)-(t-r)*(i-o)},Object.defineProperty(t,"__esModule",{value:!0})}(e)},842:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return i}});class i{constructor(t=[],e=r){if(this.data=t,this.length=this.data.length,this.compare=e,this.length>0)for(let t=(this.length>>1)-1;t>=0;t--)this._down(t)}push(t){this.data.push(t),this.length++,this._up(this.length-1)}pop(){if(0===this.length)return;const t=this.data[0],e=this.data.pop();return this.length--,this.length>0&&(this.data[0]=e,this._down(0)),t}peek(){return this.data[0]}_up(t){const{data:e,compare:n}=this,i=e[t];for(;t>0;){const r=t-1>>1,o=e[r];if(n(i,o)>=0)break;e[t]=o,t=r}e[t]=i}_down(t){const{data:e,compare:n}=this,i=this.length>>1,r=e[t];for(;t<i;){let i=1+(t<<1),o=e[i];const s=i+1;if(s<this.length&&n(e[s],o)<0&&(i=s,o=e[s]),n(o,r)>=0)break;e[t]=o,t=i}e[t]=r}}function r(t,e){return t<e?-1:t>e?1:0}}},e={};function n(i){var r=e[i];if(void 0!==r)return r.exports;var o=e[i]={exports:{}};return t[i].call(o.exports,o,o.exports,n),o.exports}n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,{a:e}),e},n.d=function(t,e){for(var i in e)n.o(e,i)&&!n.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},function(){"use strict";var t=n(273),e=n.n(t);n(513);const i=Object.freeze({POINT_FREE_RED:-3,POINT_FREE_BLUE:-2,POINT_FREE:-1,POINT_STARTING:0,POINT_IN_PATH:1,POINT_OWNED_BY_RED:2,POINT_OWNED_BY_BLUE:3});function r(t){console.log(t)}function o(...t){let e="";for(let n=0;n<t.length;n++){const i=t[n];i&&(e+=i)}console.error(e)}"undefined"!=typeof myAlert&&myAlert;function s(t,e,n){const i=t.length;let r,o,s=!1;for(r=0,o=i-1;r<i;o=r++){const i=t[r],a=t[o];(i.y<=n&&n<a.y||a.y<=n&&n<i.y)&&e<(a.x-i.x)*(n-i.y)/(a.y-i.y)+i.x&&(s=!s)}return s}function a(t){const e=t.reduce(((t,{x:e,y:n})=>(t.x+=e,t.y+=n,t)),{x:0,y:0});e.x/=t.length,e.y/=t.length;return t.map((t=>(t.angle=Math.atan2(t.y-e.y,t.x-e.x),t))).sort(((t,e)=>t.angle-e.angle))}class u{#t;#e;constructor(){const t="http://www.w3.org/2000/svg";let e,n,r,o=!1;if(this.#e=null,this.#t=null,self&&self.document&&self.document.createElementNS){const e=document.createElementNS(t,"svg");o=null!==e.x}o?(n=function(t){return t}.bind(this),r=function(e){switch(e){case"circle":case"line":case"polyline":return document.createElementNS(t,e);default:throw new Error(`unknown type ${e}`)}}):(n=function(){return{attributes:new Map,children:[],setAttributeNS:function(t,e,n){this.attributes.set(e,n)},appendChild:function(t){this.children.push(t)},removeChild:function(t){const e=this.children.indexOf(t);-1!==e&&this.children.splice(e,1)}}},self.SVGCircleElement=function(){this.attributes=new Map},SVGCircleElement.prototype.setAttribute=function(t,e){this.attributes.set(t,e)},SVGCircleElement.prototype.getAttribute=function(t){return this.attributes.get(t)},SVGCircleElement.prototype.removeAttribute=function(t){this.attributes.delete(t)},self.SVGPolylineElement=function(){this.attributes=new Map},SVGPolylineElement.prototype.setAttribute=function(t,e){this.attributes.set(t,e)},SVGPolylineElement.prototype.getAttribute=function(t){return this.attributes.get(t)},SVGPolylineElement.prototype.removeAttribute=function(t){this.attributes.delete(t)},r=function(t){switch(t){case"circle":return new SVGCircleElement;case"polyline":return new SVGPolylineElement;default:throw new Error(`unknown type ${t}`)}}),SVGCircleElement.prototype.move=function(t,e){this.setAttribute("cx",t),this.setAttribute("cy",e)},SVGCircleElement.prototype.GetStrokeColor=function(){return this.getAttribute("stroke")},SVGCircleElement.prototype.SetStrokeColor=function(t){this.setAttribute("stroke",t)},SVGCircleElement.prototype.GetPosition=function(){return void 0===this.cachedPosition&&(this.cachedPosition={x:parseInt(this.getAttribute("cx")),y:parseInt(this.getAttribute("cy"))}),this.cachedPosition},SVGCircleElement.prototype.GetFillColor=function(){return void 0===this.cachedFillColor&&(this.cachedFillColor=this.getAttribute("fill")),this.cachedFillColor},SVGCircleElement.prototype.SetFillColor=function(t){this.cachedFillColor=t,this.setAttribute("fill",t)},SVGCircleElement.prototype.GetStatus=function(){return void 0===this.cachedStatus&&(this.cachedStatus=a(this.getAttribute("data-status"))),this.cachedStatus},SVGCircleElement.prototype.SetStatus=function(t,e=!1){if(e){const e=a(this.getAttribute("data-status"));this.cachedStatus=t,this.setAttribute("data-status",s(this.cachedStatus)),e!==i.POINT_FREE&&e!==t&&this.setAttribute("data-old-status",s(e))}else this.cachedStatus=t,this.setAttribute("data-status",s(t))},SVGCircleElement.prototype.RevertOldStatus=function(){const t=this.getAttribute("data-old-status");return t?(this.removeAttribute("data-old-status"),this.setAttribute("data-status",t),this.cachedStatus=a(t),this.cachedStatus):-1},SVGCircleElement.prototype.GetZIndex=function(){return this.getAttribute("z-index")},SVGCircleElement.prototype.SetZIndex=function(t){this.setAttribute("z-index",t)},SVGCircleElement.prototype.Hide=function(){this.setAttribute("visibility","hidden")},SVGCircleElement.prototype.Show=function(){this.setAttribute("visibility","visible")},SVGCircleElement.prototype.StrokeWeight=function(t){this.setAttribute("stroke-width",t)},SVGCircleElement.prototype.Serialize=function(){const{x:t,y:e}=this.GetPosition();return{x:t,y:e,Status:this.GetStatus(),Color:this.GetFillColor()}},SVGPolylineElement.prototype.AppendPoints=function(t,e,n=1){const i=this.getAttribute("points"),r=i.split(" ");if(r.length<=1||!0==(o=r,new Set(o).size!==o.length))return!1;var o;const s=r.at(-1).split(",");if(2!==s.length)return!1;const a=parseInt(s[0]),u=parseInt(s[1]);return t=parseInt(t),e=parseInt(e),Math.abs(a-t)<=n&&Math.abs(u-e)<=n&&(this.setAttribute("points",i+` ${t},${e}`),!0)},SVGPolylineElement.prototype.RemoveLastPoint=function(){const t=this.getAttribute("points").replace(/(\s\d+,\d+)$/,"");return this.setAttribute("points",t),t},SVGPolylineElement.prototype.ContainsPoint=function(t,e){const n=new RegExp(`${t},${e}`,"g");return(this.getAttribute("points").match(n)||[]).length},SVGPolylineElement.prototype.GetPointsString=function(){return this.getAttribute("points")},SVGPolylineElement.prototype.GetPointsArray=function(){return void 0===this.cachedPoints&&(this.cachedPoints=this.getAttribute("points").split(" ").map((function(t){const[e,n]=t.split(",");return{x:parseInt(e),y:parseInt(n)}}))),this.cachedPoints},SVGPolylineElement.prototype.SetPoints=function(t){this.setAttribute("points",t)},SVGPolylineElement.prototype.GetIsClosed=function(){const t=this.getAttribute("points").split(" ");return t[0]===t.at(-1)},SVGPolylineElement.prototype.GetLength=function(){return this.getAttribute("points").split(" ").length},SVGPolylineElement.prototype.SetWidthAndColor=function(t,e){this.setAttribute("stroke",e),this.setAttribute("fill",e),this.setAttribute("stroke-width",t)},SVGPolylineElement.prototype.GetID=function(){return parseInt(this.getAttribute("data-id"))},SVGPolylineElement.prototype.SetID=function(t){this.setAttribute("data-id",t)},SVGPolylineElement.prototype.GetFillColor=function(){return this.getAttribute("fill")},SVGPolylineElement.prototype.Serialize=function(){return{iId:this.GetID(),Color:this.GetFillColor(),PointsAsString:this.GetPointsString()}},this.CreateSVGVML=function(t,i,r,{iGridWidth:s,iGridHeight:a},u){return this.#e=n(t),i&&this.#e.setAttributeNS(null,"width",i),r&&this.#e.setAttributeNS(null,"height",r),t&&(void 0!==s&&void 0!==a&&this.#e.setAttribute("viewBox",`0 0 ${s} ${a}`),this.#t=this.#e.createSVGPoint()),e=u,o?this.#e:null},this.CreatePolyline=function(t,n,i){const o=r("polyline");return void 0!==e&&o.setAttribute("shape-rendering",!0===e?"auto":"optimizeSpeed"),void 0!==i&&o.setAttribute("stroke-width",i),n&&(o.setAttribute("stroke",n),o.setAttribute("fill",n)),t&&o.setAttribute("points",t),o.setAttribute("data-id",0),this.#e.appendChild(o),o},this.CreateOval=function(t){const n=r("circle");return void 0!==e&&n.setAttribute("shape-rendering",!0===e?"auto":"optimizeSpeed"),void 0!==t&&n.setAttribute("r",t),n.setAttribute("data-status",s(i.POINT_FREE)),this.#e.appendChild(n),n};const s=function(t){switch(t){case i.POINT_FREE_RED:return Object.keys(i)[0];case i.POINT_FREE_BLUE:return Object.keys(i)[1];case i.POINT_FREE:return Object.keys(i)[2];case i.POINT_STARTING:return Object.keys(i)[3];case i.POINT_IN_PATH:return Object.keys(i)[4];case i.POINT_OWNED_BY_RED:return Object.keys(i)[5];case i.POINT_OWNED_BY_BLUE:return Object.keys(i)[6];default:throw new Error("bad status enum value")}},a=function(t){switch(t.toUpperCase()){case Object.keys(i)[0]:return i.POINT_FREE_RED;case Object.keys(i)[1]:return i.POINT_FREE_BLUE;case Object.keys(i)[2]:return i.POINT_FREE;case Object.keys(i)[3]:return i.POINT_STARTING;case Object.keys(i)[4]:return i.POINT_IN_PATH;case Object.keys(i)[5]:return i.POINT_OWNED_BY_RED;case Object.keys(i)[6]:return i.POINT_OWNED_BY_BLUE;default:throw new Error("bad status enum string")}}}RemoveOval(t){this.#e.removeChild(t)}RemovePolyline(t){this.#e.removeChild(t)}DeserializeOval(t,e){let{x:n,y:i,Status:r,Color:o}=t;n=parseInt(n),i=parseInt(i);const s=this.CreateOval(e);return s.move(n,i),s.SetFillColor(o),s.SetStatus(r),s}DeserializePolyline(t,e){const{iId:n,Color:i,PointsAsString:r}=t,o=this.CreatePolyline(r,i,e);return o.SetID(n),o}ToCursorPoint(t,e){this.#t.x=t,this.#t.y=e;return this.#t.matrixTransform(this.#e.getScreenCTM().inverse())}IsPointInCircle(t,e,n,i=4){const r=Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2),o=Math.pow(n,2);return Math.abs(r-o)<i?1:r===o?0:-1}}class l{#n;#i;#r;#o;#s;constructor(t,e,n){this.#n=t,this.#i=e,this.#r=n,this.#o=i.POINT_STARTING,this.#s=i.POINT_IN_PATH}async BuildGraph({freePointStatus:t=i.POINT_FREE_BLUE,cpufillCol:e="var(--bluish)"}={}){const n=[],r=new Map,o=function(t,n){const i=n.GetStatus();return!(!t.includes(i)||n.GetFillColor()!==e)},s=async function(e,i,s,a,u){if(i>=0&&i<this.#n&&s>=0&&s<this.#i){const l=await this.#r.get(s*this.#n+i);if(l&&!0===o([t],l)&&!1===r.has(`${a},${u}_${i},${s}`)&&!1===r.has(`${i},${s}_${a},${u}`)){const t={from:e,to:l};if(r.set(`${a},${u}_${i},${s}`,t),!1===n.includes(e))e.adjacents=[l],n.push(e);else{const t=n.find((t=>t===e));t.adjacents.push(l)}if(!1===n.includes(l))l.adjacents=[e],n.push(l);else{const t=n.find((t=>t===l));t.adjacents.push(e)}}}}.bind(this);for(const e of await this.#r.values())if(e&&!0===o([t,this.#o,this.#s],e)){const{x:t,y:n}=e.GetPosition();await s(e,t+1,n,t,n),await s(e,t-1,n,t,n),await s(e,t,n-1,t,n),await s(e,t,n+1,t,n),await s(e,t-1,n-1,t,n),await s(e,t+1,n-1,t,n),await s(e,t-1,n+1,t,n),await s(e,t+1,n+1,t,n)}return{vertices:n,edges:Array.from(r.values())}}async#a(t,e,n){for(const i of n){if(!1!==s(i.GetPointsArray(),t,e))return!1}return!0}async MarkAllCycles(t,e,n,r){const o=t.vertices,s=o.length;let u=new Array(s);const l=new Array(s),h=new Array(s),c=new Array(s);for(let t=0;t<s;t++)l[t]=[],u[t]=[];const f=async function(t,e){if(2===h[t])return;if(1===h[t]){d++;let n=e;for(l[n].push(d);n!==t;)n=c[n],l[n].push(d);return}c[t]=e,h[t]=1;const n=o[t];if(n)for(const e of n.adjacents){const n=o.indexOf(e);n!==c[t]&&await f(n,t)}h[t]=2},p=async function(t,e){for(let n=0;n<t;n++){const t=e[n];if(void 0!==t&&t.length>0)for(let e=0;e<t.length;e++){const i=u[t[e]];void 0!==i&&i.push(n)}}u=u.filter((t=>t.length>=4)).sort(((t,e)=>e.length-t.length));const s=[];for(const t of await this.#r.values())if(void 0!==t&&t.GetFillColor()===n&&i.POINT_FREE_RED===t.GetStatus()){const{x:e,y:n}=t.GetPosition();if(!1===await this.#a(e,n,r))continue;s.push({x:e,y:n})}for(let t=0;t<=d;t++){const e=u[t];if(e&&e.length>0){const n=a(e.map(function(t){return o[t].GetPosition()}.bind(this)));u[t]={cycl:e,cw_sorted_verts:n}}}return{cycles:u,free_human_player_points:s,cyclenumber:d}}.bind(this);let d=0,m=s;for(let t=0;t<s;t++)await f(t+1,t);return await p(m,l)}}addEventListener("message",(async function(t){const n=t.data,s=new u;switch(s.CreateSVGVML(null,null,null,n.boardSize),n.operation){case"BUILD_GRAPH":{const t=n.paths.map((t=>s.DeserializePolyline(t))),e=new Map;n.points.forEach((t=>{e.set(t.key,s.DeserializeOval(t.value))})),r(`lines.count = ${await t.length}, points.count = ${await e.size}`);const o=new l(n.state.iGridWidth,n.state.iGridHeight,e),a=await o.BuildGraph({freePointStatus:i.POINT_FREE_BLUE,cpufillCol:"var(--bluish)",visuals:!1});postMessage({operation:n.operation,params:a})}break;case"CONCAVEMAN":{const t=new Map;n.points.forEach((e=>{t.set(e.key,s.DeserializeOval(e.value))}));const r=new l(n.state.iGridWidth,n.state.iGridHeight,t),o=(await r.BuildGraph({freePointStatus:i.POINT_FREE_BLUE,cpufillCol:"var(--bluish)",visuals:!1})).vertices.map((function(t){const{x:e,y:n}=t.GetPosition();return[e,n]})),u=e()(o,2,0),h=a(u.map((([t,e])=>({x:t,y:e}))));postMessage({operation:n.operation,convex_hull:u,cw_sorted_verts:h})}break;case"MARK_ALL_CYCLES":{const t=n.paths.map((t=>s.DeserializePolyline(t))),e=new Map;n.points.forEach((t=>{e.set(t.key,s.DeserializeOval(t.value))}));const r=new l(n.state.iGridWidth,n.state.iGridHeight,e),o=await r.BuildGraph({freePointStatus:i.POINT_FREE_BLUE,cpufillCol:n.colorBlue,visuals:!1}),a=await r.MarkAllCycles(o,n.colorBlue,n.colorRed,t);postMessage({operation:n.operation,cycles:a.cycles,free_human_player_points:a.free_human_player_points,cyclenumber:a.cyclenumber})}break;default:o(`unknown params.operation = ${n.operation}`)}})),r("Worker loaded")}()}();
//# sourceMappingURL=AIWorker.Bundle.js.map