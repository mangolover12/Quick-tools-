const $=id=>document.getElementById(id);
$('quality').addEventListener('input',e=>$('qualityOut').value=e.target.value+'%');

function loadImage(file){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=URL.createObjectURL(file)})}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.className='download';a.textContent='Download';document.body.appendChild(a)}

$('compressBtn').onclick=async()=>{
 const f=$('compressFile').files[0]; if(!f)return $('compressResult').textContent='Choose an image first.';
 const img=await loadImage(f), c=document.createElement('canvas'); c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);
 c.toBlob(b=>{ $('compressResult').innerHTML=`Original: ${(f.size/1024).toFixed(1)} KB → Result: ${(b.size/1024).toFixed(1)} KB`;downloadBlob(b,'compressed-image.jpg')},'image/jpeg',+$('quality').value/100);
};

$('resizeBtn').onclick=async()=>{
 const f=$('resizeFile').files[0]; if(!f)return $('resizeResult').textContent='Choose an image first.';
 const img=await loadImage(f); let w=+$('width').value,h=+$('height').value;
 if(!w&&!h)return $('resizeResult').textContent='Enter a width or height.';
 if(!w)w=Math.round(img.naturalWidth*(h/img.naturalHeight)); if(!h)h=Math.round(img.naturalHeight*(w/img.naturalWidth));
 const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);
 c.toBlob(b=>{ $('resizeResult').textContent=`New size: ${w} × ${h}`;downloadBlob(b,'resized-image.jpg')},'image/jpeg',.88);
};

$('pctBtn').onclick=()=>{const p=+$('pct').value,n=+$('num').value;if(!Number.isFinite(p)||!Number.isFinite(n))return $('pctResult').textContent='Enter both numbers.';$('pctResult').textContent=`${p}% of ${n} = ${(p*n/100).toLocaleString()}`};

$('jsonBtn').onclick=()=>{try{$('jsonResult').textContent=JSON.stringify(JSON.parse($('jsonInput').value),null,2)}catch(e){$('jsonResult').textContent='Invalid JSON: '+e.message}};

$('textInput').addEventListener('input',()=>{const t=$('textInput').value.trim(),words=t?t.split(/\s+/).length:0;const chars=$('textInput').value.length;const mins=Math.max(0,Math.ceil(words/200));$('wordResult').textContent=`${words.toLocaleString()} words · ${chars.toLocaleString()} characters · ${mins} min read`});

$('ageBtn').onclick=()=>{const s=$('dob').value;if(!s)return $('ageResult').textContent='Choose your date of birth.';const b=new Date(s+'T00:00:00'),now=new Date();let y=now.getFullYear()-b.getFullYear(),m=now.getMonth()-b.getMonth(),d=now.getDate()-b.getDate();if(d<0){m--;d+=new Date(now.getFullYear(),now.getMonth(),0).getDate()}if(m<0){y--;m+=12}$('ageResult').textContent=`You are ${y} years, ${m} months and ${d} days old.`};
