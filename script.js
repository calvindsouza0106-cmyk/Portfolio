(function(){
  var svg=document.getElementById('chart'),NS='http://www.w3.org/2000/svg';
  var W=560,H=400,seed=[[60,330],[95,290],[130,310],[170,250],[205,265],[250,215],[290,200],[330,170],[370,185],[410,120],[450,130],[490,80],[525,95],[240,260]];
  var pts=seed.map(function(p){return p.slice()});
  function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e}
  for(var i=1;i<8;i++){svg.appendChild(el('line',{class:'grid',x1:i*70,y1:0,x2:i*70,y2:H}));svg.appendChild(el('line',{class:'grid',x1:0,y1:i*50,x2:W,y2:i*50}))}
  var fit=el('line',{id:'fit'});svg.appendChild(fit);
  var dots=pts.map(function(p,i){var c=el('circle',{class:'dot',r:9,tabindex:0,'aria-label':'Data point '+(i+1)});svg.appendChild(c);return c});
  function update(){
    var n=pts.length,sx=0,sy=0,sxx=0,sxy=0,syy=0;
    pts.forEach(function(p){sx+=p[0];sy+=p[1];sxx+=p[0]*p[0];sxy+=p[0]*p[1];syy+=p[1]*p[1]});
    var d=n*sxx-sx*sx,m=d?(n*sxy-sx*sy)/d:0,c=(sy-m*sx)/n;
    var num=n*sxy-sx*sy,den=Math.sqrt(d*(n*syy-sy*sy)),r2=den?Math.pow(num/den,2):0;
    fit.setAttribute('x1',0);fit.setAttribute('y1',c);fit.setAttribute('x2',W);fit.setAttribute('y2',m*W+c);
    dots.forEach(function(d,i){d.setAttribute('cx',pts[i][0]);d.setAttribute('cy',pts[i][1])});
    var slope=(-m).toFixed(2),icpt=((H-c)/ (H/100)).toFixed(1);
    document.getElementById('eq').textContent='slope '+slope;
    document.getElementById('r2').textContent='R² '+r2.toFixed(2);
  }
  function pos(e){var pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;var q=pt.matrixTransform(svg.getScreenCTM().inverse());return [Math.max(10,Math.min(W-10,q.x)),Math.max(10,Math.min(H-10,q.y))]}
  dots.forEach(function(d,i){
    d.addEventListener('pointerdown',function(e){d.setPointerCapture(e.pointerId);d.dragging=true;e.preventDefault()});
    d.addEventListener('pointermove',function(e){if(d.dragging){pts[i]=pos(e);update()}});
    d.addEventListener('pointerup',function(){d.dragging=false});
    d.addEventListener('keydown',function(e){var s=e.shiftKey?20:6,k={ArrowUp:[0,-s],ArrowDown:[0,s],ArrowLeft:[-s,0],ArrowRight:[s,0]}[e.key];if(k){e.preventDefault();pts[i]=[pts[i][0]+k[0],pts[i][1]+k[1]];update()}});
  });
  document.getElementById('reset').addEventListener('click',function(){pts=seed.map(function(p){return p.slice()});update()});
  update();
})();
