!function(){var t={271:function(t,i,e){"use strict";var n=e(777),r=e(734),s=e(693),o=e(985).orient2d;function a(t,i,e){i=Math.max(0,void 0===i?2:i),e=e||0;var r=function(t){for(var i=t[0],e=t[0],n=t[0],r=t[0],o=0;o<t.length;o++){var a=t[o];a[0]<i[0]&&(i=a),a[0]>n[0]&&(n=a),a[1]<e[1]&&(e=a),a[1]>r[1]&&(r=a)}var h=[i,e,n,r],u=h.slice();for(o=0;o<t.length;o++)s(t[o],h)||u.push(t[o]);return function(t){t.sort(y);for(var i=[],e=0;e<t.length;e++){for(;i.length>=2&&f(i[i.length-2],i[i.length-1],t[e])<=0;)i.pop();i.push(t[e])}for(var n=[],r=t.length-1;r>=0;r--){for(;n.length>=2&&f(n[n.length-2],n[n.length-1],t[r])<=0;)n.pop();n.push(t[r])}return n.pop(),i.pop(),i.concat(n)}(u)}(t),o=new n(16);o.toBBox=function(t){return{minX:t[0],minY:t[1],maxX:t[0],maxY:t[1]}},o.compareMinX=function(t,i){return t[0]-i[0]},o.compareMinY=function(t,i){return t[1]-i[1]},o.load(t);for(var a,u=[],c=0;c<r.length;c++){var l=r[c];o.remove(l),a=m(l,a),u.push(a)}var p=new n(16);for(c=0;c<u.length;c++)p.insert(d(u[c]));for(var g=i*i,_=e*e;u.length;){var x=u.shift(),M=x.p,w=x.next.p,P=v(M,w);if(!(P<_)){var b=P/g;(l=h(o,x.prev.p,M,w,x.next.next.p,b,p))&&Math.min(v(l,M),v(l,w))<=b&&(u.push(x),u.push(m(l,x)),o.remove(l),p.remove(x),p.insert(d(x)),p.insert(d(x.next)))}}x=a;var X=[];do{X.push(x.p),x=x.next}while(x!==a);return X.push(x.p),X}function h(t,i,e,n,s,o,a){for(var h=new r([],u),l=t.data;l;){for(var f=0;f<l.children.length;f++){var d=l.children[f],m=l.leaf?g(d,e,n):c(e,n,d);m>o||h.push({node:d,dist:m})}for(;h.length&&!h.peek().node.children;){var v=h.pop(),_=v.node,y=g(_,i,e),x=g(_,n,s);if(v.dist<y&&v.dist<x&&p(e,_,a)&&p(n,_,a))return _}(l=h.pop())&&(l=l.node)}return null}function u(t,i){return t.dist-i.dist}function c(t,i,e){if(l(t,e)||l(i,e))return 0;var n=_(t[0],t[1],i[0],i[1],e.minX,e.minY,e.maxX,e.minY);if(0===n)return 0;var r=_(t[0],t[1],i[0],i[1],e.minX,e.minY,e.minX,e.maxY);if(0===r)return 0;var s=_(t[0],t[1],i[0],i[1],e.maxX,e.minY,e.maxX,e.maxY);if(0===s)return 0;var o=_(t[0],t[1],i[0],i[1],e.minX,e.maxY,e.maxX,e.maxY);return 0===o?0:Math.min(n,r,s,o)}function l(t,i){return t[0]>=i.minX&&t[0]<=i.maxX&&t[1]>=i.minY&&t[1]<=i.maxY}function p(t,i,e){for(var n,r,s,o,a=Math.min(t[0],i[0]),h=Math.min(t[1],i[1]),u=Math.max(t[0],i[0]),c=Math.max(t[1],i[1]),l=e.search({minX:a,minY:h,maxX:u,maxY:c}),p=0;p<l.length;p++)if(n=l[p].p,r=l[p].next.p,s=t,n!==(o=i)&&r!==s&&f(n,r,s)>0!=f(n,r,o)>0&&f(s,o,n)>0!=f(s,o,r)>0)return!1;return!0}function f(t,i,e){return o(t[0],t[1],i[0],i[1],e[0],e[1])}function d(t){var i=t.p,e=t.next.p;return t.minX=Math.min(i[0],e[0]),t.minY=Math.min(i[1],e[1]),t.maxX=Math.max(i[0],e[0]),t.maxY=Math.max(i[1],e[1]),t}function m(t,i){var e={p:t,prev:null,next:null,minX:0,minY:0,maxX:0,maxY:0};return i?(e.next=i.next,e.prev=i,i.next.prev=e,i.next=e):(e.prev=e,e.next=e),e}function v(t,i){var e=t[0]-i[0],n=t[1]-i[1];return e*e+n*n}function g(t,i,e){var n=i[0],r=i[1],s=e[0]-n,o=e[1]-r;if(0!==s||0!==o){var a=((t[0]-n)*s+(t[1]-r)*o)/(s*s+o*o);a>1?(n=e[0],r=e[1]):a>0&&(n+=s*a,r+=o*a)}return(s=t[0]-n)*s+(o=t[1]-r)*o}function _(t,i,e,n,r,s,o,a){var h,u,c,l,p=e-t,f=n-i,d=o-r,m=a-s,v=t-r,g=i-s,_=p*p+f*f,y=p*d+f*m,x=d*d+m*m,M=p*v+f*g,w=d*v+m*g,P=_*x-y*y,b=P,X=P;0===P?(u=0,b=1,l=w,X=x):(l=_*w-y*M,(u=y*w-x*M)<0?(u=0,l=w,X=x):u>b&&(u=b,l=w+y,X=x)),l<0?(l=0,-M<0?u=0:-M>_?u=b:(u=-M,b=_)):l>X&&(l=X,-M+y<0?u=0:-M+y>_?u=b:(u=-M+y,b=_));var Y=(1-(c=0===l?0:l/X))*r+c*o-((1-(h=0===u?0:u/b))*t+h*e),A=(1-c)*s+c*a-((1-h)*i+h*n);return Y*Y+A*A}function y(t,i){return t[0]===i[0]?t[1]-i[1]:t[0]-i[0]}r.default&&(r=r.default),t.exports=a,t.exports.default=a},144:function(t){function i(t,i,e,n){this.dataset=[],this.epsilon=1,this.minPts=2,this.distance=this._euclideanDistance,this.clusters=[],this.noise=[],this._visited=[],this._assigned=[],this._datasetLength=0,this._init(t,i,e,n)}i.prototype.run=function(t,i,e,n){this._init(t,i,e,n);for(var r=0;r<this._datasetLength;r++)if(1!==this._visited[r]){this._visited[r]=1;var s=this._regionQuery(r);if(s.length<this.minPts)this.noise.push(r);else{var o=this.clusters.length;this.clusters.push([]),this._addToCluster(r,o),this._expandCluster(o,s)}}return this.clusters},i.prototype._init=function(t,i,e,n){if(t){if(!(t instanceof Array))throw Error("Dataset must be of type array, "+typeof t+" given");this.dataset=t,this.clusters=[],this.noise=[],this._datasetLength=t.length,this._visited=new Array(this._datasetLength),this._assigned=new Array(this._datasetLength)}i&&(this.epsilon=i),e&&(this.minPts=e),n&&(this.distance=n)},i.prototype._expandCluster=function(t,i){for(var e=0;e<i.length;e++){var n=i[e];if(1!==this._visited[n]){this._visited[n]=1;var r=this._regionQuery(n);r.length>=this.minPts&&(i=this._mergeArrays(i,r))}1!==this._assigned[n]&&this._addToCluster(n,t)}},i.prototype._addToCluster=function(t,i){this.clusters[i].push(t),this._assigned[t]=1},i.prototype._regionQuery=function(t){for(var i=[],e=0;e<this._datasetLength;e++){this.distance(this.dataset[t],this.dataset[e])<this.epsilon&&i.push(e)}return i},i.prototype._mergeArrays=function(t,i){for(var e=i.length,n=0;n<e;n++){var r=i[n];t.indexOf(r)<0&&t.push(r)}return t},i.prototype._euclideanDistance=function(t,i){for(var e=0,n=Math.min(t.length,i.length);n--;)e+=(t[n]-i[n])*(t[n]-i[n]);return Math.sqrt(e)},t.exports&&(t.exports=i)},278:function(t){function i(t,i,e){this.k=3,this.dataset=[],this.assignments=[],this.centroids=[],this.init(t,i,e)}i.prototype.init=function(t,i,e){this.assignments=[],this.centroids=[],void 0!==t&&(this.dataset=t),void 0!==i&&(this.k=i),void 0!==e&&(this.distance=e)},i.prototype.run=function(t,i){this.init(t,i);for(var e=this.dataset.length,n=0;n<this.k;n++)this.centroids[n]=this.randomCentroid();for(var r=!0;r;){r=this.assign();for(var s=0;s<this.k;s++){for(var o=new Array(c),a=0,h=0;h<c;h++)o[h]=0;for(var u=0;u<e;u++){var c=this.dataset[u].length;if(s===this.assignments[u]){for(h=0;h<c;h++)o[h]+=this.dataset[u][h];a++}}if(a>0){for(h=0;h<c;h++)o[h]/=a;this.centroids[s]=o}else this.centroids[s]=this.randomCentroid(),r=!0}}return this.getClusters()},i.prototype.randomCentroid=function(){var t,i,e=this.dataset.length-1;do{i=Math.round(Math.random()*e),t=this.dataset[i]}while(this.centroids.indexOf(t)>=0);return t},i.prototype.assign=function(){for(var t,i=!1,e=this.dataset.length,n=0;n<e;n++)(t=this.argmin(this.dataset[n],this.centroids,this.distance))!=this.assignments[n]&&(this.assignments[n]=t,i=!0);return i},i.prototype.getClusters=function(){for(var t,i=new Array(this.k),e=0;e<this.assignments.length;e++)void 0===i[t=this.assignments[e]]&&(i[t]=[]),i[t].push(e);return i},i.prototype.argmin=function(t,i,e){for(var n,r=Number.MAX_VALUE,s=0,o=i.length,a=0;a<o;a++)(n=e(t,i[a]))<r&&(r=n,s=a);return s},i.prototype.distance=function(t,i){for(var e=0,n=Math.min(t.length,i.length);n--;){var r=t[n]-i[n];e+=r*r}return Math.sqrt(e)},t.exports&&(t.exports=i)},613:function(t,i,e){if(t.exports)var n=e(352);function r(t,i,e,n){this.epsilon=1,this.minPts=1,this.distance=this._euclideanDistance,this._reachability=[],this._processed=[],this._coreDistance=0,this._orderedList=[],this._init(t,i,e,n)}r.prototype.run=function(t,i,e,r){this._init(t,i,e,r);for(var s=0,o=this.dataset.length;s<o;s++)if(1!==this._processed[s]){this._processed[s]=1,this.clusters.push([s]);var a=this.clusters.length-1;this._orderedList.push(s);var h=new n(null,null,"asc"),u=this._regionQuery(s);void 0!==this._distanceToCore(s)&&(this._updateQueue(s,u,h),this._expandCluster(a,h))}return this.clusters},r.prototype.getReachabilityPlot=function(){for(var t=[],i=0,e=this._orderedList.length;i<e;i++){var n=this._orderedList[i],r=this._reachability[n];t.push([n,r])}return t},r.prototype._init=function(t,i,e,n){if(t){if(!(t instanceof Array))throw Error("Dataset must be of type array, "+typeof t+" given");this.dataset=t,this.clusters=[],this._reachability=new Array(this.dataset.length),this._processed=new Array(this.dataset.length),this._coreDistance=0,this._orderedList=[]}i&&(this.epsilon=i),e&&(this.minPts=e),n&&(this.distance=n)},r.prototype._updateQueue=function(t,i,e){var n=this;this._coreDistance=this._distanceToCore(t),i.forEach((function(i){if(void 0===n._processed[i]){var r=n.distance(n.dataset[t],n.dataset[i]),s=Math.max(n._coreDistance,r);void 0===n._reachability[i]?(n._reachability[i]=s,e.insert(i,s)):s<n._reachability[i]&&(n._reachability[i]=s,e.remove(i),e.insert(i,s))}}))},r.prototype._expandCluster=function(t,i){for(var e=i.getElements(),n=0,r=e.length;n<r;n++){var s=e[n];if(void 0===this._processed[s]){var o=this._regionQuery(s);this._processed[s]=1,this.clusters[t].push(s),this._orderedList.push(s),void 0!==this._distanceToCore(s)&&(this._updateQueue(s,o,i),this._expandCluster(t,i))}}},r.prototype._distanceToCore=function(t){for(var i=this.epsilon,e=0;e<i;e++){if(this._regionQuery(t,e).length>=this.minPts)return e}},r.prototype._regionQuery=function(t,i){i=i||this.epsilon;for(var e=[],n=0,r=this.dataset.length;n<r;n++)this.distance(this.dataset[t],this.dataset[n])<i&&e.push(n);return e},r.prototype._euclideanDistance=function(t,i){for(var e=0,n=Math.min(t.length,i.length);n--;)e+=(t[n]-i[n])*(t[n]-i[n]);return Math.sqrt(e)},t.exports&&(t.exports=r)},352:function(t){function i(t,i,e){this._queue=[],this._priorities=[],this._sorting="desc",this._init(t,i,e)}i.prototype.insert=function(t,i){for(var e=this._queue.length,n=e;n--;){var r=this._priorities[n];"desc"===this._sorting?i>r&&(e=n):i<r&&(e=n)}this._insertAt(t,i,e)},i.prototype.remove=function(t){for(var i=this._queue.length;i--;){if(t===this._queue[i]){this._queue.splice(i,1),this._priorities.splice(i,1);break}}},i.prototype.forEach=function(t){this._queue.forEach(t)},i.prototype.getElements=function(){return this._queue},i.prototype.getElementPriority=function(t){return this._priorities[t]},i.prototype.getPriorities=function(){return this._priorities},i.prototype.getElementsWithPriorities=function(){for(var t=[],i=0,e=this._queue.length;i<e;i++)t.push([this._queue[i],this._priorities[i]]);return t},i.prototype._init=function(t,i,e){if(t&&i){if(this._queue=[],this._priorities=[],t.length!==i.length)throw new Error("Arrays must have the same length");for(var n=0;n<t.length;n++)this.insert(t[n],i[n])}e&&(this._sorting=e)},i.prototype._insertAt=function(t,i,e){this._queue.length===e?(this._queue.push(t),this._priorities.push(i)):(this._queue.splice(e,0,t),this._priorities.splice(e,0,i))},t.exports&&(t.exports=i)},847:function(t,i,e){t.exports&&(t.exports={DBSCAN:e(144),KMEANS:e(278),OPTICS:e(613),PriorityQueue:e(352)})},205:function(t,i){var e,n,r,s;s=function(){function t(t){for(var i=t,e=[];i.parent;)e.unshift(i),i=i.parent;return e}var i={search:function(e,n,s,o){e.cleanDirty();var a=(o=o||{}).heuristic||i.heuristics.manhattan,h=o.closest||!1,u=new r((function(t){return t.f})),c=n;for(n.h=a(n,s),u.push(n);u.size()>0;){var l=u.pop();if(l===s)return t(l);l.closed=!0;for(var p=e.neighbors(l),f=0,d=p.length;f<d;++f){var m=p[f];if(!m.closed&&!m.isWall()){var v=l.g+m.getCost(l),g=m.visited;(!g||v<m.g)&&(m.visited=!0,m.parent=l,m.h=m.h||a(m,s),m.g=v,m.f=m.g+m.h,e.markDirty(m),h&&(m.h<c.h||m.h===c.h&&m.g<c.g)&&(c=m),g?u.rescoreElement(m):u.push(m))}}}return h?t(c):[]},heuristics:{manhattan:function(t,i){return Math.abs(i.x-t.x)+Math.abs(i.y-t.y)},diagonal:function(t,i){var e=Math.sqrt(2),n=Math.abs(i.x-t.x),r=Math.abs(i.y-t.y);return 1*(n+r)+(e-2)*Math.min(n,r)}},cleanNode:function(t){t.f=0,t.g=0,t.h=0,t.visited=!1,t.closed=!1,t.parent=null}};function e(t,i){i=i||{},this.nodes=[],this.diagonal=!!i.diagonal,this.grid=[];for(var e=0;e<t.length;e++){this.grid[e]=[];for(var r=0,s=t[e];r<s.length;r++){var o=new n(e,r,s[r]);this.grid[e][r]=o,this.nodes.push(o)}}this.init()}function n(t,i,e){this.x=t,this.y=i,this.weight=e}function r(t){this.content=[],this.scoreFunction=t}return e.prototype.init=function(){this.dirtyNodes=[];for(var t=0;t<this.nodes.length;t++)i.cleanNode(this.nodes[t])},e.prototype.cleanDirty=function(){for(var t=0;t<this.dirtyNodes.length;t++)i.cleanNode(this.dirtyNodes[t]);this.dirtyNodes=[]},e.prototype.markDirty=function(t){this.dirtyNodes.push(t)},e.prototype.neighbors=function(t){var i=[],e=t.x,n=t.y,r=this.grid;return r[e-1]&&r[e-1][n]&&i.push(r[e-1][n]),r[e+1]&&r[e+1][n]&&i.push(r[e+1][n]),r[e]&&r[e][n-1]&&i.push(r[e][n-1]),r[e]&&r[e][n+1]&&i.push(r[e][n+1]),this.diagonal&&(r[e-1]&&r[e-1][n-1]&&i.push(r[e-1][n-1]),r[e+1]&&r[e+1][n-1]&&i.push(r[e+1][n-1]),r[e-1]&&r[e-1][n+1]&&i.push(r[e-1][n+1]),r[e+1]&&r[e+1][n+1]&&i.push(r[e+1][n+1])),i},e.prototype.toString=function(){for(var t,i,e,n,r=[],s=this.grid,o=0,a=s.length;o<a;o++){for(t=[],e=0,n=(i=s[o]).length;e<n;e++)t.push(i[e].weight);r.push(t.join(" "))}return r.join("\n")},n.prototype.toString=function(){return"["+this.x+" "+this.y+"]"},n.prototype.getCost=function(t){return t&&t.x!=this.x&&t.y!=this.y?1.41421*this.weight:this.weight},n.prototype.isWall=function(){return 0===this.weight},r.prototype={push:function(t){this.content.push(t),this.sinkDown(this.content.length-1)},pop:function(){var t=this.content[0],i=this.content.pop();return this.content.length>0&&(this.content[0]=i,this.bubbleUp(0)),t},remove:function(t){var i=this.content.indexOf(t),e=this.content.pop();i!==this.content.length-1&&(this.content[i]=e,this.scoreFunction(e)<this.scoreFunction(t)?this.sinkDown(i):this.bubbleUp(i))},size:function(){return this.content.length},rescoreElement:function(t){this.sinkDown(this.content.indexOf(t))},sinkDown:function(t){for(var i=this.content[t];t>0;){var e=(t+1>>1)-1,n=this.content[e];if(!(this.scoreFunction(i)<this.scoreFunction(n)))break;this.content[e]=i,this.content[t]=n,t=e}},bubbleUp:function(t){for(var i=this.content.length,e=this.content[t],n=this.scoreFunction(e);;){var r,s=t+1<<1,o=s-1,a=null;if(o<i){var h=this.content[o];(r=this.scoreFunction(h))<n&&(a=o)}if(s<i){var u=this.content[s];this.scoreFunction(u)<(null===a?n:r)&&(a=s)}if(null===a)break;this.content[t]=this.content[a],this.content[a]=e,t=a}}},{astar:i,Graph:e}},"object"==typeof t.exports?t.exports=s():(n=[],void 0===(r="function"==typeof(e=s)?e.apply(void 0,n):e)||(t.exports=r))},130:function(t){t.exports=function(t,i,e,n){var r=t[0],s=t[1],o=!1;void 0===e&&(e=0),void 0===n&&(n=i.length);for(var a=(n-e)/2,h=0,u=a-1;h<a;u=h++){var c=i[e+2*h+0],l=i[e+2*h+1],p=i[e+2*u+0],f=i[e+2*u+1];l>s!=f>s&&r<(p-c)*(s-l)/(f-l)+c&&(o=!o)}return o}},693:function(t,i,e){var n=e(130),r=e(906);t.exports=function(t,i,e,s){return i.length>0&&Array.isArray(i[0])?r(t,i,e,s):n(t,i,e,s)},t.exports.nested=r,t.exports.flat=n},906:function(t){t.exports=function(t,i,e,n){var r=t[0],s=t[1],o=!1;void 0===e&&(e=0),void 0===n&&(n=i.length);for(var a=n-e,h=0,u=a-1;h<a;u=h++){var c=i[h+e][0],l=i[h+e][1],p=i[u+e][0],f=i[u+e][1];l>s!=f>s&&r<(p-c)*(s-l)/(f-l)+c&&(o=!o)}return o}},777:function(t){t.exports=function(){"use strict";function t(t,n,r,s,o){!function t(e,n,r,s,o){for(;s>r;){if(s-r>600){var a=s-r+1,h=n-r+1,u=Math.log(a),c=.5*Math.exp(2*u/3),l=.5*Math.sqrt(u*c*(a-c)/a)*(h-a/2<0?-1:1);t(e,n,Math.max(r,Math.floor(n-h*c/a+l)),Math.min(s,Math.floor(n+(a-h)*c/a+l)),o)}var p=e[n],f=r,d=s;for(i(e,r,n),o(e[s],p)>0&&i(e,r,s);f<d;){for(i(e,f,d),f++,d--;o(e[f],p)<0;)f++;for(;o(e[d],p)>0;)d--}0===o(e[r],p)?i(e,r,d):i(e,++d,s),d<=n&&(r=d+1),n<=d&&(s=d-1)}}(t,n,r||0,s||t.length-1,o||e)}function i(t,i,e){var n=t[i];t[i]=t[e],t[e]=n}function e(t,i){return t<i?-1:t>i?1:0}var n=function(t){void 0===t&&(t=9),this._maxEntries=Math.max(4,t),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),this.clear()};function r(t,i,e){if(!e)return i.indexOf(t);for(var n=0;n<i.length;n++)if(e(t,i[n]))return n;return-1}function s(t,i){o(t,0,t.children.length,i,t)}function o(t,i,e,n,r){r||(r=d(null)),r.minX=1/0,r.minY=1/0,r.maxX=-1/0,r.maxY=-1/0;for(var s=i;s<e;s++){var o=t.children[s];a(r,t.leaf?n(o):o)}return r}function a(t,i){return t.minX=Math.min(t.minX,i.minX),t.minY=Math.min(t.minY,i.minY),t.maxX=Math.max(t.maxX,i.maxX),t.maxY=Math.max(t.maxY,i.maxY),t}function h(t,i){return t.minX-i.minX}function u(t,i){return t.minY-i.minY}function c(t){return(t.maxX-t.minX)*(t.maxY-t.minY)}function l(t){return t.maxX-t.minX+(t.maxY-t.minY)}function p(t,i){return t.minX<=i.minX&&t.minY<=i.minY&&i.maxX<=t.maxX&&i.maxY<=t.maxY}function f(t,i){return i.minX<=t.maxX&&i.minY<=t.maxY&&i.maxX>=t.minX&&i.maxY>=t.minY}function d(t){return{children:t,height:1,leaf:!0,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}}function m(i,e,n,r,s){for(var o=[e,n];o.length;)if(!((n=o.pop())-(e=o.pop())<=r)){var a=e+Math.ceil((n-e)/r/2)*r;t(i,a,e,n,s),o.push(e,a,a,n)}}return n.prototype.all=function(){return this._all(this.data,[])},n.prototype.search=function(t){var i=this.data,e=[];if(!f(t,i))return e;for(var n=this.toBBox,r=[];i;){for(var s=0;s<i.children.length;s++){var o=i.children[s],a=i.leaf?n(o):o;f(t,a)&&(i.leaf?e.push(o):p(t,a)?this._all(o,e):r.push(o))}i=r.pop()}return e},n.prototype.collides=function(t){var i=this.data;if(!f(t,i))return!1;for(var e=[];i;){for(var n=0;n<i.children.length;n++){var r=i.children[n],s=i.leaf?this.toBBox(r):r;if(f(t,s)){if(i.leaf||p(t,s))return!0;e.push(r)}}i=e.pop()}return!1},n.prototype.load=function(t){if(!t||!t.length)return this;if(t.length<this._minEntries){for(var i=0;i<t.length;i++)this.insert(t[i]);return this}var e=this._build(t.slice(),0,t.length-1,0);if(this.data.children.length)if(this.data.height===e.height)this._splitRoot(this.data,e);else{if(this.data.height<e.height){var n=this.data;this.data=e,e=n}this._insert(e,this.data.height-e.height-1,!0)}else this.data=e;return this},n.prototype.insert=function(t){return t&&this._insert(t,this.data.height-1),this},n.prototype.clear=function(){return this.data=d([]),this},n.prototype.remove=function(t,i){if(!t)return this;for(var e,n,s,o=this.data,a=this.toBBox(t),h=[],u=[];o||h.length;){if(o||(o=h.pop(),n=h[h.length-1],e=u.pop(),s=!0),o.leaf){var c=r(t,o.children,i);if(-1!==c)return o.children.splice(c,1),h.push(o),this._condense(h),this}s||o.leaf||!p(o,a)?n?(e++,o=n.children[e],s=!1):o=null:(h.push(o),u.push(e),e=0,n=o,o=o.children[0])}return this},n.prototype.toBBox=function(t){return t},n.prototype.compareMinX=function(t,i){return t.minX-i.minX},n.prototype.compareMinY=function(t,i){return t.minY-i.minY},n.prototype.toJSON=function(){return this.data},n.prototype.fromJSON=function(t){return this.data=t,this},n.prototype._all=function(t,i){for(var e=[];t;)t.leaf?i.push.apply(i,t.children):e.push.apply(e,t.children),t=e.pop();return i},n.prototype._build=function(t,i,e,n){var r,o=e-i+1,a=this._maxEntries;if(o<=a)return s(r=d(t.slice(i,e+1)),this.toBBox),r;n||(n=Math.ceil(Math.log(o)/Math.log(a)),a=Math.ceil(o/Math.pow(a,n-1))),(r=d([])).leaf=!1,r.height=n;var h=Math.ceil(o/a),u=h*Math.ceil(Math.sqrt(a));m(t,i,e,u,this.compareMinX);for(var c=i;c<=e;c+=u){var l=Math.min(c+u-1,e);m(t,c,l,h,this.compareMinY);for(var p=c;p<=l;p+=h){var f=Math.min(p+h-1,l);r.children.push(this._build(t,p,f,n-1))}}return s(r,this.toBBox),r},n.prototype._chooseSubtree=function(t,i,e,n){for(;n.push(i),!i.leaf&&n.length-1!==e;){for(var r=1/0,s=1/0,o=void 0,a=0;a<i.children.length;a++){var h=i.children[a],u=c(h),l=(p=t,f=h,(Math.max(f.maxX,p.maxX)-Math.min(f.minX,p.minX))*(Math.max(f.maxY,p.maxY)-Math.min(f.minY,p.minY))-u);l<s?(s=l,r=u<r?u:r,o=h):l===s&&u<r&&(r=u,o=h)}i=o||i.children[0]}var p,f;return i},n.prototype._insert=function(t,i,e){var n=e?t:this.toBBox(t),r=[],s=this._chooseSubtree(n,this.data,i,r);for(s.children.push(t),a(s,n);i>=0&&r[i].children.length>this._maxEntries;)this._split(r,i),i--;this._adjustParentBBoxes(n,r,i)},n.prototype._split=function(t,i){var e=t[i],n=e.children.length,r=this._minEntries;this._chooseSplitAxis(e,r,n);var o=this._chooseSplitIndex(e,r,n),a=d(e.children.splice(o,e.children.length-o));a.height=e.height,a.leaf=e.leaf,s(e,this.toBBox),s(a,this.toBBox),i?t[i-1].children.push(a):this._splitRoot(e,a)},n.prototype._splitRoot=function(t,i){this.data=d([t,i]),this.data.height=t.height+1,this.data.leaf=!1,s(this.data,this.toBBox)},n.prototype._chooseSplitIndex=function(t,i,e){for(var n,r,s,a,h,u,l,p=1/0,f=1/0,d=i;d<=e-i;d++){var m=o(t,0,d,this.toBBox),v=o(t,d,e,this.toBBox),g=(r=m,s=v,a=void 0,h=void 0,u=void 0,l=void 0,a=Math.max(r.minX,s.minX),h=Math.max(r.minY,s.minY),u=Math.min(r.maxX,s.maxX),l=Math.min(r.maxY,s.maxY),Math.max(0,u-a)*Math.max(0,l-h)),_=c(m)+c(v);g<p?(p=g,n=d,f=_<f?_:f):g===p&&_<f&&(f=_,n=d)}return n||e-i},n.prototype._chooseSplitAxis=function(t,i,e){var n=t.leaf?this.compareMinX:h,r=t.leaf?this.compareMinY:u;this._allDistMargin(t,i,e,n)<this._allDistMargin(t,i,e,r)&&t.children.sort(n)},n.prototype._allDistMargin=function(t,i,e,n){t.children.sort(n);for(var r=this.toBBox,s=o(t,0,i,r),h=o(t,e-i,e,r),u=l(s)+l(h),c=i;c<e-i;c++){var p=t.children[c];a(s,t.leaf?r(p):p),u+=l(s)}for(var f=e-i-1;f>=i;f--){var d=t.children[f];a(h,t.leaf?r(d):d),u+=l(h)}return u},n.prototype._adjustParentBBoxes=function(t,i,e){for(var n=e;n>=0;n--)a(i[n],t)},n.prototype._condense=function(t){for(var i=t.length-1,e=void 0;i>=0;i--)0===t[i].children.length?i>0?(e=t[i-1].children).splice(e.indexOf(t[i]),1):this.clear():s(t[i],this.toBBox)},n}()},985:function(t,i){!function(t){"use strict";const i=134217729,e=33306690738754706e-32;function n(t,i,e,n,r){let s,o,a,h,u=i[0],c=n[0],l=0,p=0;c>u==c>-u?(s=u,u=i[++l]):(s=c,c=n[++p]);let f=0;if(l<t&&p<e)for(c>u==c>-u?(a=s-((o=u+s)-u),u=i[++l]):(a=s-((o=c+s)-c),c=n[++p]),s=o,0!==a&&(r[f++]=a);l<t&&p<e;)c>u==c>-u?(a=s-((o=s+u)-(h=o-s))+(u-h),u=i[++l]):(a=s-((o=s+c)-(h=o-s))+(c-h),c=n[++p]),s=o,0!==a&&(r[f++]=a);for(;l<t;)a=s-((o=s+u)-(h=o-s))+(u-h),u=i[++l],s=o,0!==a&&(r[f++]=a);for(;p<e;)a=s-((o=s+c)-(h=o-s))+(c-h),c=n[++p],s=o,0!==a&&(r[f++]=a);return 0===s&&0!==f||(r[f++]=s),f}function r(t){return new Float64Array(t)}const s=33306690738754716e-32,o=22204460492503146e-32,a=11093356479670487e-47,h=r(4),u=r(8),c=r(12),l=r(16),p=r(4);t.orient2d=function(t,r,f,d,m,v){const g=(r-v)*(f-m),_=(t-m)*(d-v),y=g-_;if(0===g||0===_||g>0!=_>0)return y;const x=Math.abs(g+_);return Math.abs(y)>=s*x?y:-function(t,r,s,f,d,m,v){let g,_,y,x,M,w,P,b,X,Y,A,E,N,S,B,I,T,O;const C=t-d,k=s-d,D=r-m,G=f-m;M=(B=(b=C-(P=(w=i*C)-(w-C)))*(Y=G-(X=(w=i*G)-(w-G)))-((S=C*G)-P*X-b*X-P*Y))-(A=B-(T=(b=D-(P=(w=i*D)-(w-D)))*(Y=k-(X=(w=i*k)-(w-k)))-((I=D*k)-P*X-b*X-P*Y))),h[0]=B-(A+M)+(M-T),M=(N=S-((E=S+A)-(M=E-S))+(A-M))-(A=N-I),h[1]=N-(A+M)+(M-I),M=(O=E+A)-E,h[2]=E-(O-M)+(A-M),h[3]=O;let L=function(t,i){let e=i[0];for(let n=1;n<t;n++)e+=i[n];return e}(4,h),R=o*v;if(L>=R||-L>=R)return L;if(g=t-(C+(M=t-C))+(M-d),y=s-(k+(M=s-k))+(M-d),_=r-(D+(M=r-D))+(M-m),x=f-(G+(M=f-G))+(M-m),0===g&&0===_&&0===y&&0===x)return L;if(R=a*v+e*Math.abs(L),(L+=C*x+G*g-(D*y+k*_))>=R||-L>=R)return L;M=(B=(b=g-(P=(w=i*g)-(w-g)))*(Y=G-(X=(w=i*G)-(w-G)))-((S=g*G)-P*X-b*X-P*Y))-(A=B-(T=(b=_-(P=(w=i*_)-(w-_)))*(Y=k-(X=(w=i*k)-(w-k)))-((I=_*k)-P*X-b*X-P*Y))),p[0]=B-(A+M)+(M-T),M=(N=S-((E=S+A)-(M=E-S))+(A-M))-(A=N-I),p[1]=N-(A+M)+(M-I),M=(O=E+A)-E,p[2]=E-(O-M)+(A-M),p[3]=O;const q=n(4,h,4,p,u);M=(B=(b=C-(P=(w=i*C)-(w-C)))*(Y=x-(X=(w=i*x)-(w-x)))-((S=C*x)-P*X-b*X-P*Y))-(A=B-(T=(b=D-(P=(w=i*D)-(w-D)))*(Y=y-(X=(w=i*y)-(w-y)))-((I=D*y)-P*X-b*X-P*Y))),p[0]=B-(A+M)+(M-T),M=(N=S-((E=S+A)-(M=E-S))+(A-M))-(A=N-I),p[1]=N-(A+M)+(M-I),M=(O=E+A)-E,p[2]=E-(O-M)+(A-M),p[3]=O;const F=n(q,u,4,p,c);M=(B=(b=g-(P=(w=i*g)-(w-g)))*(Y=x-(X=(w=i*x)-(w-x)))-((S=g*x)-P*X-b*X-P*Y))-(A=B-(T=(b=_-(P=(w=i*_)-(w-_)))*(Y=y-(X=(w=i*y)-(w-y)))-((I=_*y)-P*X-b*X-P*Y))),p[0]=B-(A+M)+(M-T),M=(N=S-((E=S+A)-(M=E-S))+(A-M))-(A=N-I),p[1]=N-(A+M)+(M-I),M=(O=E+A)-E,p[2]=E-(O-M)+(A-M),p[3]=O;const j=n(F,c,4,p,l);return l[j-1]}(t,r,f,d,m,v,x)},t.orient2dfast=function(t,i,e,n,r,s){return(i-s)*(e-r)-(t-r)*(n-s)},Object.defineProperty(t,"__esModule",{value:!0})}(i)},734:function(t,i,e){"use strict";e.r(i),e.d(i,{default:function(){return n}});class n{constructor(t=[],i=r){if(this.data=t,this.length=this.data.length,this.compare=i,this.length>0)for(let t=(this.length>>1)-1;t>=0;t--)this._down(t)}push(t){this.data.push(t),this.length++,this._up(this.length-1)}pop(){if(0===this.length)return;const t=this.data[0],i=this.data.pop();return this.length--,this.length>0&&(this.data[0]=i,this._down(0)),t}peek(){return this.data[0]}_up(t){const{data:i,compare:e}=this,n=i[t];for(;t>0;){const r=t-1>>1,s=i[r];if(e(n,s)>=0)break;i[t]=s,t=r}i[t]=n}_down(t){const{data:i,compare:e}=this,n=this.length>>1,r=i[t];for(;t<n;){let n=1+(t<<1),s=i[n];const o=n+1;if(o<this.length&&e(i[o],s)<0&&(n=o,s=i[o]),e(s,r)>=0)break;i[t]=s,t=n}i[t]=r}}function r(t,i){return t<i?-1:t>i?1:0}}},i={};function e(n){var r=i[n];if(void 0!==r)return r.exports;var s=i[n]={exports:{}};return t[n].call(s.exports,s,s.exports,e),s.exports}e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,{a:i}),i},e.d=function(t,i){for(var n in i)e.o(i,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:i[n]})},e.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},function(){"use strict";var t=e(271),i=e.n(t);let n,r,s;class o{#t;#i;#e;#n;#r;constructor(t,i,e){this.#t=t,this.#i=i,this.#e=e}async#s(){if(void 0===n){const t="localhost"!==location.hostname,i=await import(`./shared${t?".min":""}.js`);n=i.StatusEnum,r=i.sortPointsClockwise,s=i.IsPointOutsideAllPaths,this.#n=n.POINT_STARTING,this.#r=n.POINT_IN_PATH}}async BuildGraph({freePointStatus:t=n.POINT_FREE_BLUE}={}){await this.#s();const i=new Map,e=new Map,r=function(t,i){const e=i.GetStatus();return!!t.includes(e)},s=[t],o=async(t,n,o,a,h)=>{if(n>=0&&n<this.#t&&o>=0&&o<this.#i){const u=await this.#e.get(o*this.#t+n);if(u&&!0===r(s,u)){const r=`${a},${h}`,s=`${n},${o}`;if(!1===e.has(`${r}_${s}`)&&!1===e.has(`${s}_${r}`)){if(e.set(`${r}_${s}`,{from:t,to:u}),i.has(r)){i.get(r).adjacents.push(u)}else t.adjacents=[u],i.set(r,t);if(i.has(s)){i.get(s).adjacents.push(t)}else u.adjacents=[t],i.set(s,u)}}}},a=await this.#e.values(),h=[t,this.#n,this.#r];for(const t of a)if(t&&!0===r(h,t)){const{x:i,y:e}=t.GetPosition();await o(t,i+1,e,i,e),await o(t,i-1,e,i,e),await o(t,i,e-1,i,e),await o(t,i,e+1,i,e),await o(t,i-1,e-1,i,e),await o(t,i+1,e-1,i,e),await o(t,i-1,e+1,i,e),await o(t,i+1,e+1,i,e)}return{vertices:Array.from(i.values()),edges:Array.from(e.values())}}async MarkAllCycles(t,i,e){await this.#s();const o=t.vertices,a=o.length;let h=new Array(a);const u=new Array(a),c=new Array(a),l=new Array(a);for(let t=0;t<a;t++)u[t]=[],h[t]=[];const p=async function(t,i){if(2===c[t])return;if(1===c[t]){f++;let e=i;for(u[e].push(f);e!==t;)e=l[e],u[e].push(f);return}l[t]=i,c[t]=1;const e=o[t];if(e)for(const i of e.adjacents){const e=o.indexOf(i);e!==l[t]&&await p(e,t)}c[t]=2};let f=0,d=a;for(let t=0;t<a;t++)await p(t+1,t);return await(async(t,a)=>{for(let i=0;i<t;i++){const t=a[i];if(void 0!==t&&t.length>0)for(let e=0;e<t.length;e++){const n=h[t[e]];void 0!==n&&n.push(i)}}h=h.filter((t=>t.length>=4)).sort(((t,i)=>i.length-t.length));const u=[];for(const t of await this.#e.values())if(void 0!==t&&t.GetFillColor()===i&&n.POINT_FREE_RED===t.GetStatus()){const{x:i,y:n}=t.GetPosition();if(!1===await s(i,n,e))continue;u.push({x:i,y:n})}for(let t=0;t<=f;t++){const i=h[t];if(i&&i.length>0){const e=i.map((t=>o[t].GetPosition())),n=r(e);h[t]={cycl:i,cw_sorted_verts:n}}}return{cycles:h,free_human_player_points:u,cyclenumber:f}})(d,u)}}var a=e(205),h=e(847);let u,c,l,p,f,d,m;addEventListener("message",(async function(t){if(void 0===u){const t="localhost"!==location.hostname,i=await import(`./shared${t?".min":""}.js`);u=i.SvgVml,c=i.StatusEnum,l=i.LocalLog,p=i.LocalError,f=i.sortPointsClockwise,d=i.pnpoly,m=i.IsPointOutsideAllPaths}const e=t.data;switch(e.operation){case"BUILD_GRAPH":{const t=new u;t.Init(null,null,null,e.boardSize);const i=e.paths.map((i=>t.DeserializePolyline(i))),n=new Map;e.points.forEach((i=>{n.set(i.key,t.DeserializeOval(i.value))})),l(`lines.count = ${i.length}, points.count = ${n.size}`);const r=new o(e.state.iGridWidth,e.state.iGridHeight,n),s=await r.BuildGraph({freePointStatus:c.POINT_FREE_BLUE,visuals:!1});postMessage({operation:e.operation,params:s})}break;case"CONCAVEMAN":{const t=new u;t.Init(null,null,null,e.boardSize);const n=new Map;e.points.forEach((i=>{n.set(i.key,t.DeserializeOval(i.value))}));const r=new o(e.state.iGridWidth,e.state.iGridHeight,n),s=e.clickedPointStatus,a=(await r.BuildGraph({freePointStatus:s,visuals:!1})).vertices.map((function(t){const{x:i,y:e}=t.GetPosition();return[i,e]}));let h,c,l=null;a.length>0&&(l=i()(a,e.concavity??2,e.lengthThreshold??0),h=l.map((([t,i])=>({x:t,y:i}))),c=f(h)),postMessage({operation:e.operation,convex_hull:l,cw_sorted_verts:c})}break;case"MARK_ALL_CYCLES":{const t=new u;t.Init(null,null,null,e.boardSize);const i=e.paths.map((i=>t.DeserializePolyline(i))),n=new Map;e.points.forEach((i=>{n.set(i.key,t.DeserializeOval(i.value))}));const r=new o(e.state.iGridWidth,e.state.iGridHeight,n),s=await r.BuildGraph({freePointStatus:c.POINT_FREE_BLUE,visuals:!1}),a=await r.MarkAllCycles(s,e.colorRed,i);postMessage({operation:e.operation,cycles:a.cycles,free_human_player_points:a.free_human_player_points,cyclenumber:a.cyclenumber})}break;case"FIND_SURROUNDABLE_POINTS":{const t=new u;t.Init(null,null,null,e.boardSize);const i=e.allLines.map((i=>t.DeserializePolyline(i))),n=e.allPoints.map((i=>t.DeserializeOval(i))),r=e.workingPoints.map((i=>t.DeserializeOval(i))),s=e.sHumanColor,o=e.sCPUColor,a=[c.POINT_FREE_RED,c.POINT_IN_PATH],h=[c.POINT_FREE_BLUE,c.POINT_IN_PATH],p=[];for(const e of r)if(void 0!==e&&e.GetFillColor()===s&&a.includes(e.GetStatus())){const{x:r,y:s}=e.GetPosition();if(!1===await m(r,s,i)){l("!!!Point inside path!!!");continue}for(let e=1;e<=4;e++){const a=[];for(const u of n)if(void 0!==u&&u.GetFillColor()===o&&h.includes(u.GetStatus())){const{x:n,y:o}=u.GetPosition();if(!1===await m(n,o,i))continue;0<=t.IsPointInCircle({x:n,y:o},{x:r,y:s},e)&&(u.x=n,u.y=o,a.push(u))}if(a.length>2){let t=f(a);for(let i=t.length-2,e=t.at(-1);i>0;i--){const n=t[i];if(!(Math.abs(e.x-n.x)<=1&&Math.abs(e.y-n.y)<=1)){t=null;break}e=n}if(null===t||!(Math.abs(t.at(-1).x-t[0].x)<=1&&Math.abs(t.at(-1).y-t[0].y)<=1)||!1===d(t,r,s))continue;p.push({cw_sorted_verts:t,radius:e,x:r,y:s}),l(`circle sorted possible path points for ${e} radius: `),l(t)}}}postMessage({operation:e.operation,results:p})}break;case"ASTAR":{const{arr:t,start:i,end:n}=e,r=new a.Graph(t,{diagonal:!0}),s=r.grid[i.y][i.x],o=r.grid[n.y][n.x],h=a.astar.search(r,s,o,{heuristic:a.astar.heuristics.diagonal});l(h),postMessage({operation:e.operation,resultWithDiagonals:h})}break;case"CLUSTERING":{const{dataset:t,method:i,numberOfClusters:n,neighborhoodRadius:r,minPointsPerCluster:s}=e;switch(i){case"KMEANS":{const r=(new h.KMEANS).run(t,n);postMessage({operation:e.operation,method:i,clusters:r})}break;case"OPTICS":{const n=new h.OPTICS,o=n.run(t,r,s),a=n.getReachabilityPlot();postMessage({operation:e.operation,method:i,clusters:o,plot:a})}break;case"DBSCAN":{const n=new h.DBSCAN,o=n.run(t,r,s),a=n.noise;postMessage({operation:e.operation,method:i,clusters:o,noise:a})}break;default:throw new Error("bad or no clustering method")}}break;default:p(`unknown params.operation = ${e.operation}`)}}))}()}();
//# sourceMappingURL=AIWorker.Bundle.js.map