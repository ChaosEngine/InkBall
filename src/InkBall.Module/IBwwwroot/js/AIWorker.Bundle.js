!function(){var t={271:function(t,e,i){"use strict";var n=i(777),r=i(734),s=i(693),o=i(985).orient2d;function a(t,e,i){e=Math.max(0,void 0===e?2:e),i=i||0;var r=function(t){for(var e=t[0],i=t[0],n=t[0],r=t[0],o=0;o<t.length;o++){var a=t[o];a[0]<e[0]&&(e=a),a[0]>n[0]&&(n=a),a[1]<i[1]&&(i=a),a[1]>r[1]&&(r=a)}var h=[e,i,n,r],u=h.slice();for(o=0;o<t.length;o++)s(t[o],h)||u.push(t[o]);return function(t){t.sort(_);for(var e=[],i=0;i<t.length;i++){for(;e.length>=2&&f(e[e.length-2],e[e.length-1],t[i])<=0;)e.pop();e.push(t[i])}for(var n=[],r=t.length-1;r>=0;r--){for(;n.length>=2&&f(n[n.length-2],n[n.length-1],t[r])<=0;)n.pop();n.push(t[r])}return n.pop(),e.pop(),e.concat(n)}(u)}(t),o=new n(16);o.toBBox=function(t){return{minX:t[0],minY:t[1],maxX:t[0],maxY:t[1]}},o.compareMinX=function(t,e){return t[0]-e[0]},o.compareMinY=function(t,e){return t[1]-e[1]},o.load(t);for(var a,u=[],c=0;c<r.length;c++){var l=r[c];o.remove(l),a=m(l,a),u.push(a)}var p=new n(16);for(c=0;c<u.length;c++)p.insert(d(u[c]));for(var g=e*e,v=i*i;u.length;){var x=u.shift(),b=x.p,P=x.next.p,S=y(b,P);if(!(S<v)){var E=S/g;(l=h(o,x.prev.p,b,P,x.next.next.p,E,p))&&Math.min(y(l,b),y(l,P))<=E&&(u.push(x),u.push(m(l,x)),o.remove(l),p.remove(x),p.insert(d(x)),p.insert(d(x.next)))}}x=a;var A=[];do{A.push(x.p),x=x.next}while(x!==a);return A.push(x.p),A}function h(t,e,i,n,s,o,a){for(var h=new r([],u),l=t.data;l;){for(var f=0;f<l.children.length;f++){var d=l.children[f],m=l.leaf?g(d,i,n):c(i,n,d);m>o||h.push({node:d,dist:m})}for(;h.length&&!h.peek().node.children;){var y=h.pop(),v=y.node,_=g(v,e,i),x=g(v,n,s);if(y.dist<_&&y.dist<x&&p(i,v,a)&&p(n,v,a))return v}(l=h.pop())&&(l=l.node)}return null}function u(t,e){return t.dist-e.dist}function c(t,e,i){if(l(t,i)||l(e,i))return 0;var n=v(t[0],t[1],e[0],e[1],i.minX,i.minY,i.maxX,i.minY);if(0===n)return 0;var r=v(t[0],t[1],e[0],e[1],i.minX,i.minY,i.minX,i.maxY);if(0===r)return 0;var s=v(t[0],t[1],e[0],e[1],i.maxX,i.minY,i.maxX,i.maxY);if(0===s)return 0;var o=v(t[0],t[1],e[0],e[1],i.minX,i.maxY,i.maxX,i.maxY);return 0===o?0:Math.min(n,r,s,o)}function l(t,e){return t[0]>=e.minX&&t[0]<=e.maxX&&t[1]>=e.minY&&t[1]<=e.maxY}function p(t,e,i){for(var n,r,s,o,a=Math.min(t[0],e[0]),h=Math.min(t[1],e[1]),u=Math.max(t[0],e[0]),c=Math.max(t[1],e[1]),l=i.search({minX:a,minY:h,maxX:u,maxY:c}),p=0;p<l.length;p++)if(n=l[p].p,r=l[p].next.p,s=t,n!==(o=e)&&r!==s&&f(n,r,s)>0!=f(n,r,o)>0&&f(s,o,n)>0!=f(s,o,r)>0)return!1;return!0}function f(t,e,i){return o(t[0],t[1],e[0],e[1],i[0],i[1])}function d(t){var e=t.p,i=t.next.p;return t.minX=Math.min(e[0],i[0]),t.minY=Math.min(e[1],i[1]),t.maxX=Math.max(e[0],i[0]),t.maxY=Math.max(e[1],i[1]),t}function m(t,e){var i={p:t,prev:null,next:null,minX:0,minY:0,maxX:0,maxY:0};return e?(i.next=e.next,i.prev=e,e.next.prev=i,e.next=i):(i.prev=i,i.next=i),i}function y(t,e){var i=t[0]-e[0],n=t[1]-e[1];return i*i+n*n}function g(t,e,i){var n=e[0],r=e[1],s=i[0]-n,o=i[1]-r;if(0!==s||0!==o){var a=((t[0]-n)*s+(t[1]-r)*o)/(s*s+o*o);a>1?(n=i[0],r=i[1]):a>0&&(n+=s*a,r+=o*a)}return(s=t[0]-n)*s+(o=t[1]-r)*o}function v(t,e,i,n,r,s,o,a){var h,u,c,l,p=i-t,f=n-e,d=o-r,m=a-s,y=t-r,g=e-s,v=p*p+f*f,_=p*d+f*m,x=d*d+m*m,b=p*y+f*g,P=d*y+m*g,S=v*x-_*_,E=S,A=S;0===S?(u=0,E=1,l=P,A=x):(l=v*P-_*b,(u=_*P-x*b)<0?(u=0,l=P,A=x):u>E&&(u=E,l=P+_,A=x)),l<0?(l=0,-b<0?u=0:-b>v?u=E:(u=-b,E=v)):l>A&&(l=A,-b+_<0?u=0:-b+_>v?u=E:(u=-b+_,E=v));var M=(1-(c=0===l?0:l/A))*r+c*o-((1-(h=0===u?0:u/E))*t+h*i),w=(1-c)*s+c*a-((1-h)*e+h*n);return M*M+w*w}function _(t,e){return t[0]===e[0]?t[1]-e[1]:t[0]-e[0]}r.default&&(r=r.default),t.exports=a,t.exports.default=a},144:function(t){function e(t,e,i,n){this.dataset=[],this.epsilon=1,this.minPts=2,this.distance=this._euclideanDistance,this.clusters=[],this.noise=[],this._visited=[],this._assigned=[],this._datasetLength=0,this._init(t,e,i,n)}e.prototype.run=function(t,e,i,n){this._init(t,e,i,n);for(var r=0;r<this._datasetLength;r++)if(1!==this._visited[r]){this._visited[r]=1;var s=this._regionQuery(r);if(s.length<this.minPts)this.noise.push(r);else{var o=this.clusters.length;this.clusters.push([]),this._addToCluster(r,o),this._expandCluster(o,s)}}return this.clusters},e.prototype._init=function(t,e,i,n){if(t){if(!(t instanceof Array))throw Error("Dataset must be of type array, "+typeof t+" given");this.dataset=t,this.clusters=[],this.noise=[],this._datasetLength=t.length,this._visited=new Array(this._datasetLength),this._assigned=new Array(this._datasetLength)}e&&(this.epsilon=e),i&&(this.minPts=i),n&&(this.distance=n)},e.prototype._expandCluster=function(t,e){for(var i=0;i<e.length;i++){var n=e[i];if(1!==this._visited[n]){this._visited[n]=1;var r=this._regionQuery(n);r.length>=this.minPts&&(e=this._mergeArrays(e,r))}1!==this._assigned[n]&&this._addToCluster(n,t)}},e.prototype._addToCluster=function(t,e){this.clusters[e].push(t),this._assigned[t]=1},e.prototype._regionQuery=function(t){for(var e=[],i=0;i<this._datasetLength;i++){this.distance(this.dataset[t],this.dataset[i])<this.epsilon&&e.push(i)}return e},e.prototype._mergeArrays=function(t,e){for(var i=e.length,n=0;n<i;n++){var r=e[n];t.indexOf(r)<0&&t.push(r)}return t},e.prototype._euclideanDistance=function(t,e){for(var i=0,n=Math.min(t.length,e.length);n--;)i+=(t[n]-e[n])*(t[n]-e[n]);return Math.sqrt(i)},t.exports&&(t.exports=e)},278:function(t){function e(t,e,i){this.k=3,this.dataset=[],this.assignments=[],this.centroids=[],this.init(t,e,i)}e.prototype.init=function(t,e,i){this.assignments=[],this.centroids=[],void 0!==t&&(this.dataset=t),void 0!==e&&(this.k=e),void 0!==i&&(this.distance=i)},e.prototype.run=function(t,e){this.init(t,e);for(var i=this.dataset.length,n=0;n<this.k;n++)this.centroids[n]=this.randomCentroid();for(var r=!0;r;){r=this.assign();for(var s=0;s<this.k;s++){for(var o=new Array(c),a=0,h=0;h<c;h++)o[h]=0;for(var u=0;u<i;u++){var c=this.dataset[u].length;if(s===this.assignments[u]){for(h=0;h<c;h++)o[h]+=this.dataset[u][h];a++}}if(a>0){for(h=0;h<c;h++)o[h]/=a;this.centroids[s]=o}else this.centroids[s]=this.randomCentroid(),r=!0}}return this.getClusters()},e.prototype.randomCentroid=function(){var t,e,i=this.dataset.length-1;do{e=Math.round(Math.random()*i),t=this.dataset[e]}while(this.centroids.indexOf(t)>=0);return t},e.prototype.assign=function(){for(var t,e=!1,i=this.dataset.length,n=0;n<i;n++)(t=this.argmin(this.dataset[n],this.centroids,this.distance))!=this.assignments[n]&&(this.assignments[n]=t,e=!0);return e},e.prototype.getClusters=function(){for(var t,e=new Array(this.k),i=0;i<this.assignments.length;i++)void 0===e[t=this.assignments[i]]&&(e[t]=[]),e[t].push(i);return e},e.prototype.argmin=function(t,e,i){for(var n,r=Number.MAX_VALUE,s=0,o=e.length,a=0;a<o;a++)(n=i(t,e[a]))<r&&(r=n,s=a);return s},e.prototype.distance=function(t,e){for(var i=0,n=Math.min(t.length,e.length);n--;){var r=t[n]-e[n];i+=r*r}return Math.sqrt(i)},t.exports&&(t.exports=e)},613:function(t,e,i){if(t.exports)var n=i(352);function r(t,e,i,n){this.epsilon=1,this.minPts=1,this.distance=this._euclideanDistance,this._reachability=[],this._processed=[],this._coreDistance=0,this._orderedList=[],this._init(t,e,i,n)}r.prototype.run=function(t,e,i,r){this._init(t,e,i,r);for(var s=0,o=this.dataset.length;s<o;s++)if(1!==this._processed[s]){this._processed[s]=1,this.clusters.push([s]);var a=this.clusters.length-1;this._orderedList.push(s);var h=new n(null,null,"asc"),u=this._regionQuery(s);void 0!==this._distanceToCore(s)&&(this._updateQueue(s,u,h),this._expandCluster(a,h))}return this.clusters},r.prototype.getReachabilityPlot=function(){for(var t=[],e=0,i=this._orderedList.length;e<i;e++){var n=this._orderedList[e],r=this._reachability[n];t.push([n,r])}return t},r.prototype._init=function(t,e,i,n){if(t){if(!(t instanceof Array))throw Error("Dataset must be of type array, "+typeof t+" given");this.dataset=t,this.clusters=[],this._reachability=new Array(this.dataset.length),this._processed=new Array(this.dataset.length),this._coreDistance=0,this._orderedList=[]}e&&(this.epsilon=e),i&&(this.minPts=i),n&&(this.distance=n)},r.prototype._updateQueue=function(t,e,i){var n=this;this._coreDistance=this._distanceToCore(t),e.forEach((function(e){if(void 0===n._processed[e]){var r=n.distance(n.dataset[t],n.dataset[e]),s=Math.max(n._coreDistance,r);void 0===n._reachability[e]?(n._reachability[e]=s,i.insert(e,s)):s<n._reachability[e]&&(n._reachability[e]=s,i.remove(e),i.insert(e,s))}}))},r.prototype._expandCluster=function(t,e){for(var i=e.getElements(),n=0,r=i.length;n<r;n++){var s=i[n];if(void 0===this._processed[s]){var o=this._regionQuery(s);this._processed[s]=1,this.clusters[t].push(s),this._orderedList.push(s),void 0!==this._distanceToCore(s)&&(this._updateQueue(s,o,e),this._expandCluster(t,e))}}},r.prototype._distanceToCore=function(t){for(var e=this.epsilon,i=0;i<e;i++){if(this._regionQuery(t,i).length>=this.minPts)return i}},r.prototype._regionQuery=function(t,e){e=e||this.epsilon;for(var i=[],n=0,r=this.dataset.length;n<r;n++)this.distance(this.dataset[t],this.dataset[n])<e&&i.push(n);return i},r.prototype._euclideanDistance=function(t,e){for(var i=0,n=Math.min(t.length,e.length);n--;)i+=(t[n]-e[n])*(t[n]-e[n]);return Math.sqrt(i)},t.exports&&(t.exports=r)},352:function(t){function e(t,e,i){this._queue=[],this._priorities=[],this._sorting="desc",this._init(t,e,i)}e.prototype.insert=function(t,e){for(var i=this._queue.length,n=i;n--;){var r=this._priorities[n];"desc"===this._sorting?e>r&&(i=n):e<r&&(i=n)}this._insertAt(t,e,i)},e.prototype.remove=function(t){for(var e=this._queue.length;e--;){if(t===this._queue[e]){this._queue.splice(e,1),this._priorities.splice(e,1);break}}},e.prototype.forEach=function(t){this._queue.forEach(t)},e.prototype.getElements=function(){return this._queue},e.prototype.getElementPriority=function(t){return this._priorities[t]},e.prototype.getPriorities=function(){return this._priorities},e.prototype.getElementsWithPriorities=function(){for(var t=[],e=0,i=this._queue.length;e<i;e++)t.push([this._queue[e],this._priorities[e]]);return t},e.prototype._init=function(t,e,i){if(t&&e){if(this._queue=[],this._priorities=[],t.length!==e.length)throw new Error("Arrays must have the same length");for(var n=0;n<t.length;n++)this.insert(t[n],e[n])}i&&(this._sorting=i)},e.prototype._insertAt=function(t,e,i){this._queue.length===i?(this._queue.push(t),this._priorities.push(e)):(this._queue.splice(i,0,t),this._priorities.splice(i,0,e))},t.exports&&(t.exports=e)},847:function(t,e,i){t.exports&&(t.exports={DBSCAN:i(144),KMEANS:i(278),OPTICS:i(613),PriorityQueue:i(352)})},205:function(t,e){var i,n,r,s;s=function(){function t(t){for(var e=t,i=[];e.parent;)i.unshift(e),e=e.parent;return i}var e={search:function(i,n,s,o){i.cleanDirty();var a=(o=o||{}).heuristic||e.heuristics.manhattan,h=o.closest||!1,u=new r((function(t){return t.f})),c=n;for(n.h=a(n,s),u.push(n);u.size()>0;){var l=u.pop();if(l===s)return t(l);l.closed=!0;for(var p=i.neighbors(l),f=0,d=p.length;f<d;++f){var m=p[f];if(!m.closed&&!m.isWall()){var y=l.g+m.getCost(l),g=m.visited;(!g||y<m.g)&&(m.visited=!0,m.parent=l,m.h=m.h||a(m,s),m.g=y,m.f=m.g+m.h,i.markDirty(m),h&&(m.h<c.h||m.h===c.h&&m.g<c.g)&&(c=m),g?u.rescoreElement(m):u.push(m))}}}return h?t(c):[]},heuristics:{manhattan:function(t,e){return Math.abs(e.x-t.x)+Math.abs(e.y-t.y)},diagonal:function(t,e){var i=Math.sqrt(2),n=Math.abs(e.x-t.x),r=Math.abs(e.y-t.y);return 1*(n+r)+(i-2)*Math.min(n,r)}},cleanNode:function(t){t.f=0,t.g=0,t.h=0,t.visited=!1,t.closed=!1,t.parent=null}};function i(t,e){e=e||{},this.nodes=[],this.diagonal=!!e.diagonal,this.grid=[];for(var i=0;i<t.length;i++){this.grid[i]=[];for(var r=0,s=t[i];r<s.length;r++){var o=new n(i,r,s[r]);this.grid[i][r]=o,this.nodes.push(o)}}this.init()}function n(t,e,i){this.x=t,this.y=e,this.weight=i}function r(t){this.content=[],this.scoreFunction=t}return i.prototype.init=function(){this.dirtyNodes=[];for(var t=0;t<this.nodes.length;t++)e.cleanNode(this.nodes[t])},i.prototype.cleanDirty=function(){for(var t=0;t<this.dirtyNodes.length;t++)e.cleanNode(this.dirtyNodes[t]);this.dirtyNodes=[]},i.prototype.markDirty=function(t){this.dirtyNodes.push(t)},i.prototype.neighbors=function(t){var e=[],i=t.x,n=t.y,r=this.grid;return r[i-1]&&r[i-1][n]&&e.push(r[i-1][n]),r[i+1]&&r[i+1][n]&&e.push(r[i+1][n]),r[i]&&r[i][n-1]&&e.push(r[i][n-1]),r[i]&&r[i][n+1]&&e.push(r[i][n+1]),this.diagonal&&(r[i-1]&&r[i-1][n-1]&&e.push(r[i-1][n-1]),r[i+1]&&r[i+1][n-1]&&e.push(r[i+1][n-1]),r[i-1]&&r[i-1][n+1]&&e.push(r[i-1][n+1]),r[i+1]&&r[i+1][n+1]&&e.push(r[i+1][n+1])),e},i.prototype.toString=function(){for(var t,e,i,n,r=[],s=this.grid,o=0,a=s.length;o<a;o++){for(t=[],i=0,n=(e=s[o]).length;i<n;i++)t.push(e[i].weight);r.push(t.join(" "))}return r.join("\n")},n.prototype.toString=function(){return"["+this.x+" "+this.y+"]"},n.prototype.getCost=function(t){return t&&t.x!=this.x&&t.y!=this.y?1.41421*this.weight:this.weight},n.prototype.isWall=function(){return 0===this.weight},r.prototype={push:function(t){this.content.push(t),this.sinkDown(this.content.length-1)},pop:function(){var t=this.content[0],e=this.content.pop();return this.content.length>0&&(this.content[0]=e,this.bubbleUp(0)),t},remove:function(t){var e=this.content.indexOf(t),i=this.content.pop();e!==this.content.length-1&&(this.content[e]=i,this.scoreFunction(i)<this.scoreFunction(t)?this.sinkDown(e):this.bubbleUp(e))},size:function(){return this.content.length},rescoreElement:function(t){this.sinkDown(this.content.indexOf(t))},sinkDown:function(t){for(var e=this.content[t];t>0;){var i=(t+1>>1)-1,n=this.content[i];if(!(this.scoreFunction(e)<this.scoreFunction(n)))break;this.content[i]=e,this.content[t]=n,t=i}},bubbleUp:function(t){for(var e=this.content.length,i=this.content[t],n=this.scoreFunction(i);;){var r,s=t+1<<1,o=s-1,a=null;if(o<e){var h=this.content[o];(r=this.scoreFunction(h))<n&&(a=o)}if(s<e){var u=this.content[s];this.scoreFunction(u)<(null===a?n:r)&&(a=s)}if(null===a)break;this.content[t]=this.content[a],this.content[a]=i,t=a}}},{astar:e,Graph:i}},"object"==typeof t.exports?t.exports=s():(n=[],void 0===(r="function"==typeof(i=s)?i.apply(void 0,n):i)||(t.exports=r))},130:function(t){t.exports=function(t,e,i,n){var r=t[0],s=t[1],o=!1;void 0===i&&(i=0),void 0===n&&(n=e.length);for(var a=(n-i)/2,h=0,u=a-1;h<a;u=h++){var c=e[i+2*h+0],l=e[i+2*h+1],p=e[i+2*u+0],f=e[i+2*u+1];l>s!=f>s&&r<(p-c)*(s-l)/(f-l)+c&&(o=!o)}return o}},693:function(t,e,i){var n=i(130),r=i(906);t.exports=function(t,e,i,s){return e.length>0&&Array.isArray(e[0])?r(t,e,i,s):n(t,e,i,s)},t.exports.nested=r,t.exports.flat=n},906:function(t){t.exports=function(t,e,i,n){var r=t[0],s=t[1],o=!1;void 0===i&&(i=0),void 0===n&&(n=e.length);for(var a=n-i,h=0,u=a-1;h<a;u=h++){var c=e[h+i][0],l=e[h+i][1],p=e[u+i][0],f=e[u+i][1];l>s!=f>s&&r<(p-c)*(s-l)/(f-l)+c&&(o=!o)}return o}},777:function(t){t.exports=function(){"use strict";function t(t,n,r,s,o){!function t(i,n,r,s,o){for(;s>r;){if(s-r>600){var a=s-r+1,h=n-r+1,u=Math.log(a),c=.5*Math.exp(2*u/3),l=.5*Math.sqrt(u*c*(a-c)/a)*(h-a/2<0?-1:1);t(i,n,Math.max(r,Math.floor(n-h*c/a+l)),Math.min(s,Math.floor(n+(a-h)*c/a+l)),o)}var p=i[n],f=r,d=s;for(e(i,r,n),o(i[s],p)>0&&e(i,r,s);f<d;){for(e(i,f,d),f++,d--;o(i[f],p)<0;)f++;for(;o(i[d],p)>0;)d--}0===o(i[r],p)?e(i,r,d):e(i,++d,s),d<=n&&(r=d+1),n<=d&&(s=d-1)}}(t,n,r||0,s||t.length-1,o||i)}function e(t,e,i){var n=t[e];t[e]=t[i],t[i]=n}function i(t,e){return t<e?-1:t>e?1:0}var n=function(t){void 0===t&&(t=9),this._maxEntries=Math.max(4,t),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),this.clear()};function r(t,e,i){if(!i)return e.indexOf(t);for(var n=0;n<e.length;n++)if(i(t,e[n]))return n;return-1}function s(t,e){o(t,0,t.children.length,e,t)}function o(t,e,i,n,r){r||(r=d(null)),r.minX=1/0,r.minY=1/0,r.maxX=-1/0,r.maxY=-1/0;for(var s=e;s<i;s++){var o=t.children[s];a(r,t.leaf?n(o):o)}return r}function a(t,e){return t.minX=Math.min(t.minX,e.minX),t.minY=Math.min(t.minY,e.minY),t.maxX=Math.max(t.maxX,e.maxX),t.maxY=Math.max(t.maxY,e.maxY),t}function h(t,e){return t.minX-e.minX}function u(t,e){return t.minY-e.minY}function c(t){return(t.maxX-t.minX)*(t.maxY-t.minY)}function l(t){return t.maxX-t.minX+(t.maxY-t.minY)}function p(t,e){return t.minX<=e.minX&&t.minY<=e.minY&&e.maxX<=t.maxX&&e.maxY<=t.maxY}function f(t,e){return e.minX<=t.maxX&&e.minY<=t.maxY&&e.maxX>=t.minX&&e.maxY>=t.minY}function d(t){return{children:t,height:1,leaf:!0,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}}function m(e,i,n,r,s){for(var o=[i,n];o.length;)if(!((n=o.pop())-(i=o.pop())<=r)){var a=i+Math.ceil((n-i)/r/2)*r;t(e,a,i,n,s),o.push(i,a,a,n)}}return n.prototype.all=function(){return this._all(this.data,[])},n.prototype.search=function(t){var e=this.data,i=[];if(!f(t,e))return i;for(var n=this.toBBox,r=[];e;){for(var s=0;s<e.children.length;s++){var o=e.children[s],a=e.leaf?n(o):o;f(t,a)&&(e.leaf?i.push(o):p(t,a)?this._all(o,i):r.push(o))}e=r.pop()}return i},n.prototype.collides=function(t){var e=this.data;if(!f(t,e))return!1;for(var i=[];e;){for(var n=0;n<e.children.length;n++){var r=e.children[n],s=e.leaf?this.toBBox(r):r;if(f(t,s)){if(e.leaf||p(t,s))return!0;i.push(r)}}e=i.pop()}return!1},n.prototype.load=function(t){if(!t||!t.length)return this;if(t.length<this._minEntries){for(var e=0;e<t.length;e++)this.insert(t[e]);return this}var i=this._build(t.slice(),0,t.length-1,0);if(this.data.children.length)if(this.data.height===i.height)this._splitRoot(this.data,i);else{if(this.data.height<i.height){var n=this.data;this.data=i,i=n}this._insert(i,this.data.height-i.height-1,!0)}else this.data=i;return this},n.prototype.insert=function(t){return t&&this._insert(t,this.data.height-1),this},n.prototype.clear=function(){return this.data=d([]),this},n.prototype.remove=function(t,e){if(!t)return this;for(var i,n,s,o=this.data,a=this.toBBox(t),h=[],u=[];o||h.length;){if(o||(o=h.pop(),n=h[h.length-1],i=u.pop(),s=!0),o.leaf){var c=r(t,o.children,e);if(-1!==c)return o.children.splice(c,1),h.push(o),this._condense(h),this}s||o.leaf||!p(o,a)?n?(i++,o=n.children[i],s=!1):o=null:(h.push(o),u.push(i),i=0,n=o,o=o.children[0])}return this},n.prototype.toBBox=function(t){return t},n.prototype.compareMinX=function(t,e){return t.minX-e.minX},n.prototype.compareMinY=function(t,e){return t.minY-e.minY},n.prototype.toJSON=function(){return this.data},n.prototype.fromJSON=function(t){return this.data=t,this},n.prototype._all=function(t,e){for(var i=[];t;)t.leaf?e.push.apply(e,t.children):i.push.apply(i,t.children),t=i.pop();return e},n.prototype._build=function(t,e,i,n){var r,o=i-e+1,a=this._maxEntries;if(o<=a)return s(r=d(t.slice(e,i+1)),this.toBBox),r;n||(n=Math.ceil(Math.log(o)/Math.log(a)),a=Math.ceil(o/Math.pow(a,n-1))),(r=d([])).leaf=!1,r.height=n;var h=Math.ceil(o/a),u=h*Math.ceil(Math.sqrt(a));m(t,e,i,u,this.compareMinX);for(var c=e;c<=i;c+=u){var l=Math.min(c+u-1,i);m(t,c,l,h,this.compareMinY);for(var p=c;p<=l;p+=h){var f=Math.min(p+h-1,l);r.children.push(this._build(t,p,f,n-1))}}return s(r,this.toBBox),r},n.prototype._chooseSubtree=function(t,e,i,n){for(;n.push(e),!e.leaf&&n.length-1!==i;){for(var r=1/0,s=1/0,o=void 0,a=0;a<e.children.length;a++){var h=e.children[a],u=c(h),l=(p=t,f=h,(Math.max(f.maxX,p.maxX)-Math.min(f.minX,p.minX))*(Math.max(f.maxY,p.maxY)-Math.min(f.minY,p.minY))-u);l<s?(s=l,r=u<r?u:r,o=h):l===s&&u<r&&(r=u,o=h)}e=o||e.children[0]}var p,f;return e},n.prototype._insert=function(t,e,i){var n=i?t:this.toBBox(t),r=[],s=this._chooseSubtree(n,this.data,e,r);for(s.children.push(t),a(s,n);e>=0&&r[e].children.length>this._maxEntries;)this._split(r,e),e--;this._adjustParentBBoxes(n,r,e)},n.prototype._split=function(t,e){var i=t[e],n=i.children.length,r=this._minEntries;this._chooseSplitAxis(i,r,n);var o=this._chooseSplitIndex(i,r,n),a=d(i.children.splice(o,i.children.length-o));a.height=i.height,a.leaf=i.leaf,s(i,this.toBBox),s(a,this.toBBox),e?t[e-1].children.push(a):this._splitRoot(i,a)},n.prototype._splitRoot=function(t,e){this.data=d([t,e]),this.data.height=t.height+1,this.data.leaf=!1,s(this.data,this.toBBox)},n.prototype._chooseSplitIndex=function(t,e,i){for(var n,r,s,a,h,u,l,p=1/0,f=1/0,d=e;d<=i-e;d++){var m=o(t,0,d,this.toBBox),y=o(t,d,i,this.toBBox),g=(r=m,s=y,a=void 0,h=void 0,u=void 0,l=void 0,a=Math.max(r.minX,s.minX),h=Math.max(r.minY,s.minY),u=Math.min(r.maxX,s.maxX),l=Math.min(r.maxY,s.maxY),Math.max(0,u-a)*Math.max(0,l-h)),v=c(m)+c(y);g<p?(p=g,n=d,f=v<f?v:f):g===p&&v<f&&(f=v,n=d)}return n||i-e},n.prototype._chooseSplitAxis=function(t,e,i){var n=t.leaf?this.compareMinX:h,r=t.leaf?this.compareMinY:u;this._allDistMargin(t,e,i,n)<this._allDistMargin(t,e,i,r)&&t.children.sort(n)},n.prototype._allDistMargin=function(t,e,i,n){t.children.sort(n);for(var r=this.toBBox,s=o(t,0,e,r),h=o(t,i-e,i,r),u=l(s)+l(h),c=e;c<i-e;c++){var p=t.children[c];a(s,t.leaf?r(p):p),u+=l(s)}for(var f=i-e-1;f>=e;f--){var d=t.children[f];a(h,t.leaf?r(d):d),u+=l(h)}return u},n.prototype._adjustParentBBoxes=function(t,e,i){for(var n=i;n>=0;n--)a(e[n],t)},n.prototype._condense=function(t){for(var e=t.length-1,i=void 0;e>=0;e--)0===t[e].children.length?e>0?(i=t[e-1].children).splice(i.indexOf(t[e]),1):this.clear():s(t[e],this.toBBox)},n}()},985:function(t,e){!function(t){"use strict";const e=134217729,i=33306690738754706e-32;function n(t,e,i,n,r){let s,o,a,h,u=e[0],c=n[0],l=0,p=0;c>u==c>-u?(s=u,u=e[++l]):(s=c,c=n[++p]);let f=0;if(l<t&&p<i)for(c>u==c>-u?(a=s-((o=u+s)-u),u=e[++l]):(a=s-((o=c+s)-c),c=n[++p]),s=o,0!==a&&(r[f++]=a);l<t&&p<i;)c>u==c>-u?(a=s-((o=s+u)-(h=o-s))+(u-h),u=e[++l]):(a=s-((o=s+c)-(h=o-s))+(c-h),c=n[++p]),s=o,0!==a&&(r[f++]=a);for(;l<t;)a=s-((o=s+u)-(h=o-s))+(u-h),u=e[++l],s=o,0!==a&&(r[f++]=a);for(;p<i;)a=s-((o=s+c)-(h=o-s))+(c-h),c=n[++p],s=o,0!==a&&(r[f++]=a);return 0===s&&0!==f||(r[f++]=s),f}function r(t){return new Float64Array(t)}const s=33306690738754716e-32,o=22204460492503146e-32,a=11093356479670487e-47,h=r(4),u=r(8),c=r(12),l=r(16),p=r(4);t.orient2d=function(t,r,f,d,m,y){const g=(r-y)*(f-m),v=(t-m)*(d-y),_=g-v;if(0===g||0===v||g>0!=v>0)return _;const x=Math.abs(g+v);return Math.abs(_)>=s*x?_:-function(t,r,s,f,d,m,y){let g,v,_,x,b,P,S,E,A,M,w,G,C,O,N,I,T,Y;const B=t-d,k=s-d,X=r-m,V=f-m;b=(N=(E=B-(S=(P=e*B)-(P-B)))*(M=V-(A=(P=e*V)-(P-V)))-((O=B*V)-S*A-E*A-S*M))-(w=N-(T=(E=X-(S=(P=e*X)-(P-X)))*(M=k-(A=(P=e*k)-(P-k)))-((I=X*k)-S*A-E*A-S*M))),h[0]=N-(w+b)+(b-T),b=(C=O-((G=O+w)-(b=G-O))+(w-b))-(w=C-I),h[1]=C-(w+b)+(b-I),b=(Y=G+w)-G,h[2]=G-(Y-b)+(w-b),h[3]=Y;let D=function(t,e){let i=e[0];for(let n=1;n<t;n++)i+=e[n];return i}(4,h),R=o*y;if(D>=R||-D>=R)return D;if(g=t-(B+(b=t-B))+(b-d),_=s-(k+(b=s-k))+(b-d),v=r-(X+(b=r-X))+(b-m),x=f-(V+(b=f-V))+(b-m),0===g&&0===v&&0===_&&0===x)return D;if(R=a*y+i*Math.abs(D),(D+=B*x+V*g-(X*_+k*v))>=R||-D>=R)return D;b=(N=(E=g-(S=(P=e*g)-(P-g)))*(M=V-(A=(P=e*V)-(P-V)))-((O=g*V)-S*A-E*A-S*M))-(w=N-(T=(E=v-(S=(P=e*v)-(P-v)))*(M=k-(A=(P=e*k)-(P-k)))-((I=v*k)-S*A-E*A-S*M))),p[0]=N-(w+b)+(b-T),b=(C=O-((G=O+w)-(b=G-O))+(w-b))-(w=C-I),p[1]=C-(w+b)+(b-I),b=(Y=G+w)-G,p[2]=G-(Y-b)+(w-b),p[3]=Y;const F=n(4,h,4,p,u);b=(N=(E=B-(S=(P=e*B)-(P-B)))*(M=x-(A=(P=e*x)-(P-x)))-((O=B*x)-S*A-E*A-S*M))-(w=N-(T=(E=X-(S=(P=e*X)-(P-X)))*(M=_-(A=(P=e*_)-(P-_)))-((I=X*_)-S*A-E*A-S*M))),p[0]=N-(w+b)+(b-T),b=(C=O-((G=O+w)-(b=G-O))+(w-b))-(w=C-I),p[1]=C-(w+b)+(b-I),b=(Y=G+w)-G,p[2]=G-(Y-b)+(w-b),p[3]=Y;const L=n(F,u,4,p,c);b=(N=(E=g-(S=(P=e*g)-(P-g)))*(M=x-(A=(P=e*x)-(P-x)))-((O=g*x)-S*A-E*A-S*M))-(w=N-(T=(E=v-(S=(P=e*v)-(P-v)))*(M=_-(A=(P=e*_)-(P-_)))-((I=v*_)-S*A-E*A-S*M))),p[0]=N-(w+b)+(b-T),b=(C=O-((G=O+w)-(b=G-O))+(w-b))-(w=C-I),p[1]=C-(w+b)+(b-I),b=(Y=G+w)-G,p[2]=G-(Y-b)+(w-b),p[3]=Y;const j=n(L,c,4,p,l);return l[j-1]}(t,r,f,d,m,y,x)},t.orient2dfast=function(t,e,i,n,r,s){return(e-s)*(i-r)-(t-r)*(n-s)},Object.defineProperty(t,"__esModule",{value:!0})}(e)},734:function(t,e,i){"use strict";i.r(e),i.d(e,{default:function(){return n}});class n{constructor(t=[],e=r){if(this.data=t,this.length=this.data.length,this.compare=e,this.length>0)for(let t=(this.length>>1)-1;t>=0;t--)this._down(t)}push(t){this.data.push(t),this.length++,this._up(this.length-1)}pop(){if(0===this.length)return;const t=this.data[0],e=this.data.pop();return this.length--,this.length>0&&(this.data[0]=e,this._down(0)),t}peek(){return this.data[0]}_up(t){const{data:e,compare:i}=this,n=e[t];for(;t>0;){const r=t-1>>1,s=e[r];if(i(n,s)>=0)break;e[t]=s,t=r}e[t]=n}_down(t){const{data:e,compare:i}=this,n=this.length>>1,r=e[t];for(;t<n;){let n=1+(t<<1),s=e[n];const o=n+1;if(o<this.length&&i(e[o],s)<0&&(n=o,s=e[o]),i(s,r)>=0)break;e[t]=s,t=n}e[t]=r}}function r(t,e){return t<e?-1:t>e?1:0}}},e={};function i(n){var r=e[n];if(void 0!==r)return r.exports;var s=e[n]={exports:{}};return t[n].call(s.exports,s,s.exports,i),s.exports}i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},i.d=function(t,e){for(var n in e)i.o(e,n)&&!i.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},function(){"use strict";var t=i(271),e=i.n(t);const n=Object.freeze({POINT_FREE_RED:-3,POINT_FREE_BLUE:-2,POINT_FREE:-1,POINT_STARTING:0,POINT_IN_PATH:1,POINT_OWNED_BY_RED:2,POINT_OWNED_BY_BLUE:3});function r(t){console.log(t)}function s(...t){let e="";for(let i=0;i<t.length;i++){const n=t[i];n&&(e+=n)}console.error(e)}"undefined"!=typeof myAlert&&myAlert;function o(t,e,i){const n=t.length;let r,s,o=!1;for(r=0,s=n-1;r<n;s=r++){const n=t[r],a=t[s];(n.y<=i&&i<a.y||a.y<=i&&i<n.y)&&e<(a.x-n.x)*(i-n.y)/(a.y-n.y)+n.x&&(o=!o)}return o}function a(t){const e=t.reduce(((t,e)=>(t.x+=e.x,t.y+=e.y,t)),{x:0,y:0});e.x/=t.length,e.y/=t.length;return t.map((t=>(t.angle=Math.atan2(t.y-e.y,t.x-e.x),t))).sort(((t,e)=>t.angle-e.angle))}class h{#t;#e;constructor(){const t="http://www.w3.org/2000/svg";let e,i,r,s=!1;if(this.#e=null,this.#t=null,self&&self.document&&self.document.createElementNS){const e=document.createElementNS(t,"svg");s=null!==e.x}s?(i=t=>t,r=function(e){switch(e){case"circle":case"line":case"polyline":return document.createElementNS(t,e);default:throw new Error(`unknown type ${e}`)}}):(i=function(){return{attributes:new Map,children:[],setAttributeNS:function(t,e,i){this.attributes.set(e,i)},appendChild:function(t){this.children.push(t)},removeChild:function(t){const e=this.children.indexOf(t);-1!==e&&this.children.splice(e,1)}}},self.SVGCircleElement=function(){this.attributes=new Map},SVGCircleElement.prototype.setAttribute=function(t,e){this.attributes.set(t,e)},SVGCircleElement.prototype.getAttribute=function(t){return this.attributes.get(t)},SVGCircleElement.prototype.removeAttribute=function(t){this.attributes.delete(t)},self.SVGPolylineElement=function(){this.attributes=new Map},SVGPolylineElement.prototype.setAttribute=function(t,e){this.attributes.set(t,e)},SVGPolylineElement.prototype.getAttribute=function(t){return this.attributes.get(t)},SVGPolylineElement.prototype.removeAttribute=function(t){this.attributes.delete(t)},r=function(t){switch(t){case"circle":return new SVGCircleElement;case"polyline":return new SVGPolylineElement;default:throw new Error(`unknown type ${t}`)}}),SVGCircleElement.prototype.move=function(t,e){this.setAttribute("cx",t),this.setAttribute("cy",e)},SVGCircleElement.prototype.GetStrokeColor=function(){return this.getAttribute("stroke")},SVGCircleElement.prototype.SetStrokeColor=function(t){this.setAttribute("stroke",t)},SVGCircleElement.prototype.GetPosition=function(){return void 0===this.cachedPosition&&(this.cachedPosition={x:parseInt(this.getAttribute("cx")),y:parseInt(this.getAttribute("cy"))}),this.cachedPosition},SVGCircleElement.prototype.GetFillColor=function(){return void 0===this.cachedFillColor&&(this.cachedFillColor=this.getAttribute("fill")),this.cachedFillColor},SVGCircleElement.prototype.SetFillColor=function(t){this.cachedFillColor=t,this.setAttribute("fill",t)},SVGCircleElement.prototype.GetStatus=function(){return void 0===this.cachedStatus&&(this.cachedStatus=a(this.getAttribute("data-status"))),this.cachedStatus},SVGCircleElement.prototype.SetStatus=function(t,e=!1){if(e){const e=a(this.getAttribute("data-status"));this.cachedStatus=t,this.setAttribute("data-status",o(this.cachedStatus)),e!==n.POINT_FREE&&e!==t&&this.setAttribute("data-old-status",o(e))}else this.cachedStatus=t,this.setAttribute("data-status",o(t))},SVGCircleElement.prototype.RevertOldStatus=function(){const t=this.getAttribute("data-old-status");return t?(this.removeAttribute("data-old-status"),this.setAttribute("data-status",t),this.cachedStatus=a(t),this.cachedStatus):-1},SVGCircleElement.prototype.GetZIndex=function(){return this.getAttribute("z-index")},SVGCircleElement.prototype.SetZIndex=function(t){this.setAttribute("z-index",t)},SVGCircleElement.prototype.Hide=function(){this.setAttribute("visibility","hidden")},SVGCircleElement.prototype.Show=function(){this.setAttribute("visibility","visible")},SVGCircleElement.prototype.StrokeWeight=function(t){this.setAttribute("stroke-width",t)},SVGCircleElement.prototype.Serialize=function(){const{x:t,y:e}=this.GetPosition();return{x:t,y:e,Status:this.GetStatus(),Color:this.GetFillColor()}},SVGPolylineElement.prototype.AppendPoints=function(t,e,i=1){const n=this.getAttribute("points"),r=n.split(" ");if(r.length<=1||!0==(s=r,new Set(s).size!==s.length))return!1;var s;const o=r.at(-1).split(",");if(2!==o.length)return!1;const a=parseInt(o[0]),h=parseInt(o[1]);return t=parseInt(t),e=parseInt(e),Math.abs(a-t)<=i&&Math.abs(h-e)<=i&&(this.setAttribute("points",n+` ${t},${e}`),!0)},SVGPolylineElement.prototype.RemoveLastPoint=function(){const t=this.getAttribute("points").replace(/(\s\d+,\d+)$/,"");return this.setAttribute("points",t),t},SVGPolylineElement.prototype.ContainsPoint=function(t,e){const i=this.getAttribute("points"),n=`${t},${e}`;let r=0,s=-n.length;for(;(s=i.indexOf(n,s+n.length))>-1;)r++;return r},SVGPolylineElement.prototype.GetPointsString=function(){return this.getAttribute("points")},SVGPolylineElement.prototype.GetPointsArray=function(){return void 0===this.cachedPoints&&(this.cachedPoints=this.getAttribute("points").split(" ").map((function(t){const[e,i]=t.split(",");return{x:parseInt(e),y:parseInt(i)}}))),this.cachedPoints},SVGPolylineElement.prototype.SetPoints=function(t){this.setAttribute("points",t)},SVGPolylineElement.prototype.GetIsClosed=function(){const t=this.getAttribute("points").split(" ");return t[0]===t.at(-1)},SVGPolylineElement.prototype.GetLength=function(){return this.getAttribute("points").split(" ").length},SVGPolylineElement.prototype.SetWidthAndColor=function(t,e){this.setAttribute("stroke",e),this.setAttribute("fill",e),this.setAttribute("stroke-width",t)},SVGPolylineElement.prototype.GetID=function(){return parseInt(this.getAttribute("data-id"))},SVGPolylineElement.prototype.SetID=function(t){this.setAttribute("data-id",t)},SVGPolylineElement.prototype.GetFillColor=function(){return this.getAttribute("fill")},SVGPolylineElement.prototype.Serialize=function(){return{iId:this.GetID(),Color:this.GetFillColor(),PointsAsString:this.GetPointsString()}},this.CreateSVGVML=function(t,n,r,{iGridWidth:o,iGridHeight:a},h){return this.#e=i(t),n&&this.#e.setAttributeNS(null,"width",n),r&&this.#e.setAttributeNS(null,"height",r),t&&(void 0!==o&&void 0!==a&&this.#e.setAttribute("viewBox",`0 0 ${o} ${a}`),this.#t=this.#e.createSVGPoint()),e=h,s?this.#e:null},this.CreatePolyline=function(t,i,n=void 0){const s=r("polyline");return void 0!==e&&s.setAttribute("shape-rendering",!0===e?"auto":"optimizeSpeed"),void 0!==n&&s.setAttribute("stroke-width",n),i&&(s.setAttribute("stroke",i),s.setAttribute("fill",i)),t&&s.setAttribute("points",t),s.setAttribute("data-id",0),this.#e.appendChild(s),s},this.CreateOval=function(t=void 0){const i=r("circle");return void 0!==e&&i.setAttribute("shape-rendering",!0===e?"auto":"optimizeSpeed"),void 0!==t&&i.setAttribute("r",t),i.setAttribute("data-status",o(n.POINT_FREE)),this.#e.appendChild(i),i};const o=function(t){switch(t){case n.POINT_FREE_RED:return Object.keys(n)[0];case n.POINT_FREE_BLUE:return Object.keys(n)[1];case n.POINT_FREE:return Object.keys(n)[2];case n.POINT_STARTING:return Object.keys(n)[3];case n.POINT_IN_PATH:return Object.keys(n)[4];case n.POINT_OWNED_BY_RED:return Object.keys(n)[5];case n.POINT_OWNED_BY_BLUE:return Object.keys(n)[6];default:throw new Error("bad status enum value")}},a=function(t){switch(t.toUpperCase()){case Object.keys(n)[0]:return n.POINT_FREE_RED;case Object.keys(n)[1]:return n.POINT_FREE_BLUE;case Object.keys(n)[2]:return n.POINT_FREE;case Object.keys(n)[3]:return n.POINT_STARTING;case Object.keys(n)[4]:return n.POINT_IN_PATH;case Object.keys(n)[5]:return n.POINT_OWNED_BY_RED;case Object.keys(n)[6]:return n.POINT_OWNED_BY_BLUE;default:throw new Error("bad status enum string")}}}RemoveOval(t){this.#e.removeChild(t)}RemovePolyline(t){this.#e.removeChild(t)}DeserializeOval(t,e=void 0){let{x:i,y:n,Status:r,Color:s}=t;i=parseInt(i),n=parseInt(n);const o=this.CreateOval(e);return o.move(i,n),o.SetFillColor(s),o.SetStatus(r),o}DeserializePolyline(t,e=void 0){const{iId:i,Color:n,PointsAsString:r}=t,s=this.CreatePolyline(r,n,e);return s.SetID(i),s}ToCursorPoint(t,e){this.#t.x=t,this.#t.y=e;return this.#t.matrixTransform(this.#e.getScreenCTM().inverse())}IsPointInCircle(t,e,i,n=4){const r=Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2),s=Math.pow(i,2);return Math.abs(r-s)<n?1:r===s?0:-1}}class u{#i;#n;#r;#s;#o;constructor(t,e,i){this.#i=t,this.#n=e,this.#r=i,this.#s=n.POINT_STARTING,this.#o=n.POINT_IN_PATH}async BuildGraph({freePointStatus:t=n.POINT_FREE_BLUE,cpufillCol:e="var(--bluish)"}={}){const i=new Map,r=new Map,s=function(t,i){const n=i.GetStatus();return!(!t.includes(n)||i.GetFillColor()!==e)},o=async(e,n,o,a,h)=>{if(n>=0&&n<this.#i&&o>=0&&o<this.#n){const u=await this.#r.get(o*this.#i+n);if(u&&!0===s([t],u)){const t=`${a},${h}`,s=`${n},${o}`;if(!1===r.has(`${t}_${s}`)&&!1===r.has(`${s}_${t}`)){if(r.set(`${t}_${s}`,{from:e,to:u}),i.has(t)){i.get(t).adjacents.push(u)}else e.adjacents=[u],i.set(t,e);if(i.has(s)){i.get(s).adjacents.push(e)}else u.adjacents=[e],i.set(s,u)}}}};for(const e of await this.#r.values())if(e&&!0===s([t,this.#s,this.#o],e)){const{x:t,y:i}=e.GetPosition();await o(e,t+1,i,t,i),await o(e,t-1,i,t,i),await o(e,t,i-1,t,i),await o(e,t,i+1,t,i),await o(e,t-1,i-1,t,i),await o(e,t+1,i-1,t,i),await o(e,t-1,i+1,t,i),await o(e,t+1,i+1,t,i)}return{vertices:Array.from(i.values()),edges:Array.from(r.values())}}async#a(t,e,i){for(const n of i){if(!1!==o(n.GetPointsArray(),t,e))return!1}return!0}async MarkAllCycles(t,e,i,r){const s=t.vertices,o=s.length;let h=new Array(o);const u=new Array(o),c=new Array(o),l=new Array(o);for(let t=0;t<o;t++)u[t]=[],h[t]=[];const p=async function(t,e){if(2===c[t])return;if(1===c[t]){f++;let i=e;for(u[i].push(f);i!==t;)i=l[i],u[i].push(f);return}l[t]=e,c[t]=1;const i=s[t];if(i)for(const e of i.adjacents){const i=s.indexOf(e);i!==l[t]&&await p(i,t)}c[t]=2};let f=0,d=o;for(let t=0;t<o;t++)await p(t+1,t);return await(async(t,e)=>{for(let i=0;i<t;i++){const t=e[i];if(void 0!==t&&t.length>0)for(let e=0;e<t.length;e++){const n=h[t[e]];void 0!==n&&n.push(i)}}h=h.filter((t=>t.length>=4)).sort(((t,e)=>e.length-t.length));const o=[];for(const t of await this.#r.values())if(void 0!==t&&t.GetFillColor()===i&&n.POINT_FREE_RED===t.GetStatus()){const{x:e,y:i}=t.GetPosition();if(!1===await this.#a(e,i,r))continue;o.push({x:e,y:i})}for(let t=0;t<=f;t++){const e=h[t];if(e&&e.length>0){const i=a(e.map((t=>s[t].GetPosition())));h[t]={cycl:e,cw_sorted_verts:i}}}return{cycles:h,free_human_player_points:o,cyclenumber:f}})(d,u)}}var c=i(205),l=i(847);addEventListener("message",(async function(t){const i=t.data;switch(i.operation){case"BUILD_GRAPH":{const t=new h;t.CreateSVGVML(null,null,null,i.boardSize);const e=i.paths.map((e=>t.DeserializePolyline(e))),s=new Map;i.points.forEach((e=>{s.set(e.key,t.DeserializeOval(e.value))})),r(`lines.count = ${await e.length}, points.count = ${await s.size}`);const o=new u(i.state.iGridWidth,i.state.iGridHeight,s),a=await o.BuildGraph({freePointStatus:n.POINT_FREE_BLUE,cpufillCol:"var(--bluish)",visuals:!1});postMessage({operation:i.operation,params:a})}break;case"CONCAVEMAN":{const t=new h;t.CreateSVGVML(null,null,null,i.boardSize);const r=new Map;i.points.forEach((e=>{r.set(e.key,t.DeserializeOval(e.value))}));const s=new u(i.state.iGridWidth,i.state.iGridHeight,r),o=(await s.BuildGraph({freePointStatus:n.POINT_FREE_BLUE,cpufillCol:"var(--bluish)",visuals:!1})).vertices.map((function(t){const{x:e,y:i}=t.GetPosition();return[e,i]})),c=e()(o,i.concavity??2,i.lengthThreshold??0),l=a(c.map((([t,e])=>({x:t,y:e}))));postMessage({operation:i.operation,convex_hull:c,cw_sorted_verts:l})}break;case"MARK_ALL_CYCLES":{const t=new h;t.CreateSVGVML(null,null,null,i.boardSize);const e=i.paths.map((e=>t.DeserializePolyline(e))),r=new Map;i.points.forEach((e=>{r.set(e.key,t.DeserializeOval(e.value))}));const s=new u(i.state.iGridWidth,i.state.iGridHeight,r),o=await s.BuildGraph({freePointStatus:n.POINT_FREE_BLUE,cpufillCol:i.colorBlue,visuals:!1}),a=await s.MarkAllCycles(o,i.colorBlue,i.colorRed,e);postMessage({operation:i.operation,cycles:a.cycles,free_human_player_points:a.free_human_player_points,cyclenumber:a.cyclenumber})}break;case"ASTAR":{const{arr:t,start:e,end:n}=i,s=new c.Graph(t,{diagonal:!0}),o=s.grid[e.y][e.x],a=s.grid[n.y][n.x],h=c.astar.search(s,o,a,{heuristic:c.astar.heuristics.diagonal});r(h),postMessage({operation:i.operation,resultWithDiagonals:h})}break;case"CLUSTERING":{const{dataset:t,method:e,numberOfClusters:n,neighborhoodRadius:r,minPointsPerCluster:s}=i;switch(e){case"KMEANS":{const r=(new l.KMEANS).run(t,n);postMessage({operation:i.operation,method:e,clusters:r})}break;case"OPTICS":{const n=new l.OPTICS,o=n.run(t,r,s),a=n.getReachabilityPlot();postMessage({operation:i.operation,method:e,clusters:o,plot:a})}break;case"DBSCAN":{const n=new l.DBSCAN,o=n.run(t,r,s),a=n.noise;postMessage({operation:i.operation,method:e,clusters:o,noise:a})}break;default:throw new Error("bad or no clustering method")}}break;default:s(`unknown params.operation = ${i.operation}`)}})),r("Worker loaded")}()}();
//# sourceMappingURL=AIWorker.Bundle.js.map