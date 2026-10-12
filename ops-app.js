/* OpsField v2 — browser-only, no shell execution or telemetry. */
(function(){
'use strict';
const KB=window.OpsData;
const $=(q)=>document.querySelector(q);
const esc=(v)=>String(v==null?'':v).replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const save=(k,v)=>{try{localStorage.setItem('ops_v2_'+k,JSON.stringify(v));}catch(e){}};
const load=(k,d)=>{try{const s=localStorage.getItem('ops_v2_'+k);return s?JSON.parse(s):d;}catch(e){return d;}};
const nav=[['home','Overview','◫'],['triage','Decision tree','◇'],['commands','Commands','⌘'],['errors','Error decoder','!'],['runbooks','Runbooks','▤'],['labs','Break & fix','⚒'],['interview','Interviews','◎'],['notes','Incident notebook','✎']];
const S={page:'home',query:'',category:'All',selected:null,node:'start',trail:[],triage:load('triage',{app:'',env:'',endpoint:'',impact:'',start:'',changes:''}),finished:load('finished',[]),hints:{},solutions:{},labAnswers:load('labAnswers',{}),quiz:load('quiz',{}),quizIndex:0,notes:load('notes',{title:'',ticket:'',environment:'',severity:'P2',endpoint:'',impact:'',started:'',timeline:'',evidence:'',hypotheses:'',rootcause:'',mitigation:'',verification:'',followup:''}),theme:load('theme','dark')};
const flags={'-l':'listening sockets','-n':'numeric addresses, skip DNS lookup','-t':'TCP sockets','-p':'owning process','-u':'unit or service (journalctl); UDP in ss','-h':'human readable','-i':'inodes or interactive mode depending on command','-a':'all / verbose (command-dependent)','-f':'follow or file (command-dependent)','--all':'show all, not only active','--failed':'show failed units','--no-pager':'print directly, no interactive pager','--previous':'previous terminated container','-A':'all Kubernetes namespaces','-o':'output format','-v':'verbose','-x':'stay on the same filesystem (du)','--sort':'sort by chosen field','--since':'limit results to a time window'};
const examples={
'sudo ss -lntp':'LISTEN 0 5 127.0.0.1:8080 0.0.0.0:* users:(("python3",pid=2863,fd=3))',
'systemctl --failed':'0 loaded units listed.  (Healthy systemd does not prove app availability.)',
'systemctl status SERVICE --no-pager':'Active: failed (Result: exit-code)\nProcess: 123 ExecStart=/invalid/bin (code=exited, status=203/EXEC)',
'ip -br addr':'lo UNKNOWN 127.0.0.1/8\nens33 UP 192.168.112.129/24',
'free -h':'Mem: total 1.6Gi used 462Mi available 1.1Gi',
'df -h':'Filesystem Size Used Avail Use% Mounted on\n/dev/sdb1 8.0G 8.0G 0 100% /var',
'kubectl get pods -A -o wide':'NAMESPACE NAME READY STATUS RESTARTS\npayments api-7f49 0/1 CrashLoopBackOff 6',
'hostnamectl':'Static hostname: linux-debug\nVirtualization: vmware\nOperating System: Ubuntu Server',
'getent hosts HOSTNAME':'10.0.4.15 api.internal.example',
'curl -v --connect-timeout 5 http://HOST:PORT/':'* Trying 192.0.2.10:8080...\n* connect failed: Connection refused'
};
function h(ey,title,sub){return '<div class="heading"><div class="eyebrow">'+esc(ey)+'</div><h1>'+esc(title)+'</h1><p>'+esc(sub)+'</p></div>';}
function chip(t,c){return '<span class="chip '+(c||'')+'">'+esc(t)+'</span>';}
function code(c,risk){const kind=risk==='change'?'WRITE / disruptive':'READ-ONLY / verify';return '<div class="terminal"><div class="terminal-label">'+esc(kind)+'</div><div class="terminal-row"><code>'+esc(c)+'</code><button type="button" data-copy="'+esc(c)+'" aria-label="Copy command">Copy</button></div></div>';}
function panel(title,body,klass){return '<article class="panel '+(klass||'')+'"><h3>'+esc(title)+'</h3>'+body+'</article>';}
function points(arr){return '<ul class="steps">'+arr.map((x)=>'<li>'+esc(x)+'</li>').join('')+'</ul>';}
function warn(msg){return '<div class="notice"><strong>Safety note</strong><p>'+esc(msg)+'</p></div>';}
function header(){return '<div class="top-actions"><span id="pageLabel">'+esc((nav.find(n=>n[0]===S.page)||nav[0])[1])+'</span><div class="top-right"><button type="button" id="global-search-btn" data-action="search">⌕ Search <kbd>/</kbd></button><button type="button" data-action="theme" aria-label="Toggle light and dark theme">◐</button><a target="_blank" rel="noopener noreferrer" href="https://github.com/orzujon/platform-troubleshooting-hub">GitHub ↗</a></div></div>';}
function renderNav(){const n=nav.map(x=>'<a href="#/'+x[0]+'" data-route="'+x[0]+'" class="'+(S.page===x[0]?'current':'')+'"><span class="nav-symbol">'+x[2]+'</span>'+esc(x[1])+'</a>').join('');$('#nav').innerHTML=n;$('#mobile-nav').innerHTML=n;}
function overview(){
 const counters=[['50','Linux / platform commands','commands'],['15','Common incident errors','errors'],['10','Runbooks for on-call','runbooks'],['8','Fault-finding labs','labs']];
 return '<div class="hero"><div class="eyebrow">OPSField 2.0 · INCIDENT RESPONSE WORKBENCH</div><h1>Start with evidence.<br><em>Find the failure.</em></h1><p>Your searchable guide for unfamiliar infrastructure problems, on-call incidents and senior platform engineering interviews. It does not execute commands or connect to servers.</p><div class="hero-actions"><button class="primary" data-route="triage">Start a diagnosis →</button><button data-route="labs">Practise an incident</button></div></div>'
 +'<div class="metric-grid">'+counters.map(c=>'<button class="metric" data-route="'+c[2]+'"><strong>'+c[0]+'</strong><span>'+c[1]+'</span></button>').join('')+'</div>'
 +'<h2 class="section-title">The four questions before you run a command</h2>'
 +'<div class="grid four">'+[['01','Identify','What app, endpoint, environment and impact?'],['02','Locate','Which system and team actually own the endpoint?'],['03','Observe','What do DNS, sockets, processes, service state and logs say?'],['04','Verify','Which hypothesis fits evidence, and how will you prove recovery?']].map(p=>panel(p[0]+' · '+p[1],'<p>'+esc(p[2])+'</p>')).join('')+'</div>'
 +'<h2 class="section-title">Your real Ubuntu lab</h2>'+panel('An active service is not necessarily reachable',chip('Observed from your VM','green')+'<p>Ubuntu 26.04.1 VMware guest, hostname <code>linux-debug</code>. The earlier snapshot showed <code>lab-web.service</code> active and a Python listener on <code>127.0.0.1:8080</code>.</p>'+code('sudo ss -lntp')+'<p class="muted">The PID 2863 was a point-in-time observation, not a permanent identifier. Remote access to the VM IP on 8080 may fail even when localhost works.</p>')
 +warn('Use disposable VMs for fault injection. Check production change policies. Never paste credentials, private hostnames, IP inventories or raw sensitive logs into a public GitHub repository.')
 +'<div class="grid three">'+panel('Interactive triage','<p>Branch through diagnostic questions and receive the next check.</p><button data-route="triage">Open triage →</button>')+panel('Command reference','<p>Learn what each command shows, common flags and misleading outputs.</p><button data-route="commands">Explore commands →</button>')+panel('Interview practice','<p>Answer 12 evidence-based technical scenarios.</p><button data-route="interview">Start practice →</button>')+'</div>';
}
function triage(){
 const t=KB.tree[S.node]||KB.tree.start;
 const form=['app|Application / service','env|Environment (DEV / UAT / PROD)','endpoint|Exact endpoint or host:port','impact|Affected users / impact','start|First observed (with timezone)','changes|Recent deployments / changes'];
 let context='<div class="context-grid">'+form.map((f)=>{let [k,label]=f.split('|');return '<label>'+esc(label)+'<input type="text" data-triage="'+k+'" value="'+esc(S.triage[k]||'')+'" placeholder="'+esc(label)+'"></label>';}).join('')+'</div>';
 let tree='<div class="journey"><div class="journey-top">'+chip('STEP '+(S.trail.length+1),'green')+'<button data-action="tree-reset">Start again</button></div><h2>'+esc(t.q||t.leaf)+'</h2>'+(t.help?'<p class="muted">'+esc(t.help)+'</p>':'');
 if(t.cmd&&t.cmd.length)tree+='<h3>Evidence to collect</h3>'+t.cmd.map(c=>code(c)).join('');
 if(t.options){tree+='<div class="choice-list">'+t.options.map((o)=>'<button type="button" class="choice" data-tree="'+esc(o[1])+'">'+esc(o[0])+'<span>→</span></button>').join('')+'</div>';}
 else{tree+='<div class="result">'+chip('Working hypothesis — not confirmed','amber')+'<p>'+esc(t.hypothesis)+'</p><h3>How to validate</h3><p>'+esc(t.verify)+'</p><button class="primary" data-route="notes">Document this incident →</button></div>';}
 tree+='<div class="journey-foot">'+(S.trail.length?'<button data-action="tree-back">← Previous question</button>':'<span>Begin with the actual symptom, not the assumed root cause.</span>')+'</div></div>';
 return h('LIVE TRIAGE','Troubleshoot from the symptom','Collect the missing context first, then follow a decision tree. Every branch changes which evidence you collect.')
 +panel('Incident context · saved only in this browser',context+'<p class="muted">Do not store confidential production details here on a shared or public device.</p>')
 +tree+warn('Read-only checks come first. Command placeholders such as HOST, PORT, SERVICE and NAMESPACE must be replaced with verified values. An observation suggests a hypothesis; it does not prove a root cause.');
}
function toolsBar(kind,cats,placeholder){return '<div class="toolbar"><input id="item-query" type="search" value="'+esc(S.query)+'" placeholder="'+esc(placeholder)+'" aria-label="Filter '+esc(kind)+'"><select id="category" aria-label="Category">'+['All',...cats].map(c=>'<option value="'+esc(c)+'" '+(S.category===c?'selected':'')+'>'+esc(c)+'</option>').join('')+'</select></div>';}
function commands(){
 const cats=[...new Set(KB.commands.map(x=>x.category))].sort();
 const arr=KB.commands.filter(x=>(S.category==='All'||S.category===x.category)&&[x.command,x.category,x.purpose,x.interpretation].join(' ').toLowerCase().includes(S.query.toLowerCase()));
 return h('FIELD REFERENCE','Command explorer','What to run, why, what the output proves, and where to look next. Never run an unexplained command blindly.')
 +toolsBar('commands',cats,'Search ss, journalctl, port, memory, disk...')+'<div id="list-results">'+cmdCards(arr)+'</div>';
}
function cmdCards(arr){
 if(!arr.length)return '<p class="empty">No matches. Try a broader term.</p>';
 return '<div class="stack">'+arr.map(x=>{
 const bits=(x.command.match(/(^|\s)(--?[a-zA-Z][a-zA-Z-]*)(?=\s|$)/g)||[]).map(x=>x.trim()).filter(x=>flags[x]);
 let detail=bits.length?'<div class="flag-list"><strong>Flags:</strong> '+[...new Set(bits)].map(f=>'<span><code>'+esc(f)+'</code> '+esc(flags[f])+'</span>').join('')+'</div>':'';
 if(examples[x.command])detail+='<div class="example"><small>ILLUSTRATIVE OUTPUT — NOT LIVE</small><pre>'+esc(examples[x.command])+'</pre></div>';
 return '<article class="panel command-card"><div class="item-top">'+chip(x.category,'blue')+chip(x.risk==='change'?'May modify service':'Read-only check',x.risk==='change'?'red':'green')+'</div>'+code(x.command,x.risk)+'<div class="grid two"><div><h3>Why run it?</h3><p>'+esc(x.purpose)+'</p></div><div><h3>How to interpret it</h3><p>'+esc(x.interpretation)+'</p></div></div>'+detail+'</article>';}).join('')+'</div>';
}
function errors(){
 const cats=[...new Set(KB.errors.map(x=>x.category))].sort();
 const arr=KB.errors.filter(x=>(S.category==='All'||S.category===x.category)&&[x.title,x.meaning,x.causes,x.category].join(' ').toLowerCase().includes(S.query.toLowerCase()));
 return h('ERROR TRANSLATOR','Error decoder','A symptom is not a diagnosis. Read likely causes, checks and what would confirm them.')
 +toolsBar('errors',cats,'Search 203/EXEC, timeout, 502, OOM...')+'<div id="list-results">'+errorCards(arr)+'</div>';
}
function errorCards(arr){return arr.length?'<div class="stack">'+arr.map(x=>panel(x.title,chip(x.category,'blue')+'<p><strong>What it means: </strong>'+esc(x.meaning)+'</p><p><strong>Potential causes: </strong>'+esc(x.causes)+'</p><h4>Useful checks</h4>'+x.commands.map(c=>code(c)).join('')+'<p class="muted"><strong>What to do with the evidence: </strong>'+esc(x.next)+'</p>','error-card')).join('')+'</div>':'<p class="empty">No errors match your search.</p>';}
function runbooks(){
 const cats=[...new Set(KB.runbooks.map(x=>x.domain))].sort();
 const arr=KB.runbooks.filter(x=>(S.category==='All'||S.category===x.domain)&&[x.name,x.domain,x.symptom].join(' ').toLowerCase().includes(S.query.toLowerCase()));
 return h('OPERATIONAL PLAYBOOKS','Incident runbooks','A repeatable, evidence-first investigation path. Use change approval for remedial actions.')
 +toolsBar('runbooks',cats,'Search a failure scenario...')+'<div id="list-results">'+rbCards(arr)+'</div>';
}
function rbCards(arr){return arr.length?'<div class="stack">'+arr.map((x)=>panel(x.name,chip(x.domain,'blue')+'<p>'+esc(x.symptom)+'</p><h4>Investigation sequence</h4><ol class="ordered">'+x.checks.map(c=>'<li>'+esc(c)+'</li>').join('')+'</ol><div class="verify"><strong>Recovery evidence:</strong> '+esc(x.verify)+'</div>')).join('')+'</div>':'<p class="empty">No runbooks match.</p>';}
function labs(){
 const complete=S.finished.length; const cats=[...new Set(KB.labs.map(x=>x.domain))].sort();
 const arr=KB.labs.filter(x=>(S.category==='All'||S.category===x.domain)&&[x.name,x.report,x.domain].join(' ').toLowerCase().includes(S.query.toLowerCase()));
 return h('PRACTICE ARENA','Break-and-fix incident labs','Read the alert, inspect realistic evidence, form a hypothesis and reveal hints only when needed.')
 +'<div class="progress"><div style="width:'+Math.round(100*complete/KB.labs.length)+'%"></div></div><p class="muted">'+complete+' of '+KB.labs.length+' labs completed on this browser</p>'
 +toolsBar('labs',cats,'Search lab scenarios...')+'<div id="list-results">'+labCards(arr)+'</div>';
}
function labCards(arr){return arr.length?'<div class="stack">'+arr.map(x=>{
 let n=S.hints[x.id]||0,sol=S.solutions[x.id];
 return '<article class="panel lab"><div class="item-top">'+chip(x.domain,'blue')+chip(x.difficulty,'amber')+(S.finished.includes(x.id)?chip('Completed','green'):'')+'</div><h3>'+esc(x.name)+'</h3><blockquote>'+esc(x.report)+'</blockquote><h4>Evidence delivered by monitoring/on-call</h4><div class="example"><pre>'+esc(x.output)+'</pre></div><h4>Your challenge</h4><p>'+esc(x.ask)+'</p><textarea placeholder="Write your diagnosis before revealing the answer (stored on this device)..." data-lab-answer="'+esc(x.id)+'" rows="3">'+esc(S.labAnswers[x.id]||'')+'</textarea>'
 +'<div class="button-row"><button data-lab-hint="'+esc(x.id)+'">Reveal hint ('+n+'/'+x.hints.length+')</button><button data-lab-solution="'+esc(x.id)+'">'+(sol?'Hide':'Reveal')+' diagnosis</button><button class="'+(S.finished.includes(x.id)?'completed':'primary')+'" data-lab-done="'+esc(x.id)+'">'+(S.finished.includes(x.id)?'✓ Completed':'Mark complete')+'</button></div>'
 +(n?'<div class="hint">'+x.hints.slice(0,n).map((s,i)=>'<p><strong>Hint '+(i+1)+':</strong> '+esc(s)+'</p>').join('')+'</div>':'')
 +(sol?'<div class="solution"><h4>Explanation</h4><p>'+esc(x.solution)+'</p><h4>Verify recovery</h4><p>'+esc(x.verify)+'</p></div>':'')+'</article>';
 }).join('')+'</div>':'<p class="empty">No labs match.</p>';}
function interview(){
 const count=Object.keys(S.quiz).length,score=KB.questions.filter((x,i)=>S.quiz[i]===x.correct).length;
 const q=KB.questions[S.quizIndex];let selected=S.quiz[S.quizIndex];let has=Number.isInteger(selected);
 let opts=q.options.map((o,i)=>'<button data-quiz-answer="'+i+'" class="quiz-option '+(has?(i===q.correct?'right':(i===selected?'wrong':'')):'')+'" '+(has?'disabled':'')+'><span>'+String.fromCharCode(65+i)+'</span>'+esc(o)+'</button>').join('');
 return h('TECHNICAL INTERVIEWS','Senior engineering practice','Explain what you would investigate and why. Answer before seeing the reasoning.')
 +'<div class="panel"><div class="item-top">'+chip('Question '+(S.quizIndex+1)+' of '+KB.questions.length,'blue')+chip(score+' correct · '+count+' answered',score?'green':'')+'</div><div class="progress"><div style="width:'+Math.round(100*count/KB.questions.length)+'%"></div></div><h2 class="quiz-q">'+esc(q.q)+'</h2><div class="quiz-choices">'+opts+'</div>'
 +(has?'<div class="solution"><strong>'+(selected===q.correct?'✓ Correct reasoning':'Review the evidence')+'</strong><p>'+esc(q.why)+'</p></div>':'<p class="muted">Select an answer to reveal the explanation.</p>')
 +'<div class="button-row"><button data-quiz-prev '+(S.quizIndex===0?'disabled':'')+'>← Previous</button><button data-quiz-next '+(S.quizIndex===KB.questions.length-1?'disabled':'')+'>Next →</button><button data-action="quiz-reset">Restart quiz</button></div></div>';
}
const noteFields=[['title','Incident title'],['ticket','Incident or ticket ID'],['environment','Environment'],['severity','Severity (P1/P2/P3)'],['endpoint','Service / endpoint (omit confidential data)'],['impact','User/business impact'],['started','Start time and timezone'],['timeline','Timeline and changes'],['evidence','Commands run and exact safe evidence'],['hypotheses','Hypotheses tested and ruled out'],['rootcause','Confirmed root cause / uncertainty'],['mitigation','Mitigation and rollback'],['verification','External verification and outcome'],['followup','Preventive action and owner']];
function markdown(){const n=S.notes;return '# '+(n.title||'Untitled incident')+'\n\n'+noteFields.map(([k,label])=>'## '+label+'\n\n'+String(n[k]||'Not recorded')).join('\n\n')+'\n\n---\nOpsField incident report. Redact private data before sharing.\n';}
function notes(){
 const fields=noteFields.map(([k,label])=>'<label>'+esc(label)+(k==='title'||k==='ticket'||k==='environment'||k==='severity'||k==='started'?'<input data-note="'+esc(k)+'" value="'+esc(S.notes[k]||'')+'">':'<textarea data-note="'+esc(k)+'" rows="3">'+esc(S.notes[k]||'')+'</textarea>')+'</label>').join('');
 return h('POST-INCIDENT KNOWLEDGE','Incident notebook','Build a report from evidence. The content stays in this browser until you export it; it does not sync to GitHub.')
 +warn('Avoid passwords, tokens, private IP inventories, personal data and sensitive logs. Browser storage on shared devices is not a secure incident database.')
 +'<div class="panel"><div class="context-grid notes-grid">'+fields+'</div><div class="button-row"><button class="primary" data-action="download-report">↓ Download Markdown report</button><button data-action="copy-report">Copy report</button><button data-action="clear-notes">Clear this browser’s notes</button></div><p class="muted">Autosaved locally. Exported Markdown can be reviewed and committed to a private repository when appropriate.</p></div>';
}
function searchPage(){
 let q=S.query.trim().toLowerCase();
 const groups=[['Commands',KB.commands.map(x=>({name:x.command,body:x.purpose,to:'commands'}))],['Errors',KB.errors.map(x=>({name:x.title,body:x.meaning,to:'errors'}))],['Runbooks',KB.runbooks.map(x=>({name:x.name,body:x.symptom,to:'runbooks'}))],['Labs',KB.labs.map(x=>({name:x.name,body:x.report,to:'labs'}))]];
 return h('GLOBAL SEARCH','Find an answer','Search command names, error messages, runbooks, and exercises.')
 +'<input id="item-query" class="search-large" placeholder="Try 203/EXEC, DNS, full disk, pod, ports..." value="'+esc(S.query)+'">'
 +'<div id="list-results">'+(q?groups.map(g=>{let matches=g[1].filter(x=>[x.name,x.body].join(' ').toLowerCase().includes(q));return matches.length?'<h2 class="section-title">'+g[0]+'</h2>'+matches.slice(0,8).map(x=>'<button class="search-result" data-route="'+x.to+'"><strong>'+esc(x.name)+'</strong><span>'+esc(x.body)+'</span> →</button>').join(''):'';}).join('')||'<p class="empty">No results found.</p>':'<div class="panel"><h3>Suggested searches</h3><p>Connection refused · 203/EXEC · OOMKilled · CrashLoopBackOff · DNS · ssh · disk</p></div>')+'</div>';
}
const views={home:overview,triage,commands,errors,runbooks,labs,interview,notes,search:searchPage};
function render(){
 document.documentElement.dataset.theme=S.theme;
 renderNav();$('#top').innerHTML=header();$('#view').innerHTML=(views[S.page]||overview)();
 document.title=(nav.find(x=>x[0]===S.page)?.[1]||'Search')+' • OpsField';
}
function go(p){if(!views[p])p='home';if(p!==S.page){S.query='';S.category='All';}S.page=p;render();window.scrollTo(0,0);}
function copyText(s){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(s).then(()=>showToast('Copied to clipboard')).catch(()=>fallbackCopy(s));}else fallbackCopy(s);}
function fallbackCopy(s){let t=document.createElement('textarea');t.value=s;t.style.position='fixed';t.style.left='-9999px';document.body.append(t);t.select();let ok=false;try{ok=document.execCommand('copy');}catch(e){}t.remove();showToast(ok?'Copied to clipboard':'Copy unavailable: select the text manually');}
let toastTimeout;function showToast(s){$('#toast').textContent=s;$('#toast').hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('#toast').hidden=true,2200);}
function refreshList(){if(S.page==='commands')$('#list-results').innerHTML=cmdCards(KB.commands.filter(x=>(S.category==='All'||S.category===x.category)&&[x.command,x.category,x.purpose,x.interpretation].join(' ').toLowerCase().includes(S.query.toLowerCase())));else if(S.page==='errors')$('#list-results').innerHTML=errorCards(KB.errors.filter(x=>(S.category==='All'||S.category===x.category)&&[x.title,x.meaning,x.causes,x.category].join(' ').toLowerCase().includes(S.query.toLowerCase())));else if(S.page==='runbooks')$('#list-results').innerHTML=rbCards(KB.runbooks.filter(x=>(S.category==='All'||S.category===x.domain)&&[x.name,x.domain,x.symptom].join(' ').toLowerCase().includes(S.query.toLowerCase())));else if(S.page==='labs')$('#list-results').innerHTML=labCards(KB.labs.filter(x=>(S.category==='All'||S.category===x.domain)&&[x.name,x.report,x.domain].join(' ').toLowerCase().includes(S.query.toLowerCase())));else if(S.page==='search')$('#view').innerHTML=searchPage();}
document.addEventListener('click',(e)=>{
 const route=e.target.closest('[data-route]');if(route){e.preventDefault();location.hash='/'+route.dataset.route;return;}
 const cp=e.target.closest('[data-copy]');if(cp){copyText(cp.dataset.copy);return;}
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.tree){S.trail.push(S.node);S.node=b.dataset.tree;render();$('#view').scrollIntoView({block:'start'});return;}
 if(b.dataset.action==='tree-back'){S.node=S.trail.pop()||'start';render();return;}
 if(b.dataset.action==='tree-reset'){S.node='start';S.trail=[];render();return;}
 if(b.dataset.labHint){const l=KB.labs.find(x=>x.id===b.dataset.labHint);S.hints[l.id]=Math.min(l.hints.length,(S.hints[l.id]||0)+1);render();return;}
 if(b.dataset.labSolution){S.solutions[b.dataset.labSolution]=!S.solutions[b.dataset.labSolution];render();return;}
 if(b.dataset.labDone){const id=b.dataset.labDone;S.finished=S.finished.includes(id)?S.finished.filter(x=>x!==id):[...S.finished,id];save('finished',S.finished);render();return;}
 if(b.dataset.quizAnswer!=null){if(!Number.isInteger(S.quiz[S.quizIndex])){S.quiz[S.quizIndex]=Number(b.dataset.quizAnswer);save('quiz',S.quiz);render();}return;}
 if(b.hasAttribute('data-quiz-next')){S.quizIndex=Math.min(KB.questions.length-1,S.quizIndex+1);render();return;}
 if(b.hasAttribute('data-quiz-prev')){S.quizIndex=Math.max(0,S.quizIndex-1);render();return;}
 if(b.dataset.action==='quiz-reset'){S.quiz={};S.quizIndex=0;save('quiz',S.quiz);render();return;}
 if(b.dataset.action==='theme'){S.theme=S.theme==='dark'?'light':'dark';save('theme',S.theme);render();return;}
 if(b.dataset.action==='search'){location.hash='/search';setTimeout(()=>$('#item-query')?.focus(),100);return;}
 if(b.dataset.action==='download-report'){let blob=new Blob([markdown()],{type:'text/markdown;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='opsfield-incident-report.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('Report downloaded');return;}
 if(b.dataset.action==='copy-report'){copyText(markdown());return;}
 if(b.dataset.action==='clear-notes'){if(confirm('Clear the incident notebook on this browser?')){S.notes={};save('notes',S.notes);render();}return;}
});
document.addEventListener('input',(e)=>{
 const el=e.target;
 if(el.dataset.triage){S.triage[el.dataset.triage]=el.value;save('triage',S.triage);}
 if(el.dataset.note){S.notes[el.dataset.note]=el.value;save('notes',S.notes);}
 if(el.dataset.labAnswer){S.labAnswers[el.dataset.labAnswer]=el.value;save('labAnswers',S.labAnswers);}
 if(el.id==='item-query'){S.query=el.value;refreshList();}
});
document.addEventListener('change',(e)=>{if(e.target.id==='category'){S.category=e.target.value;render();}});
window.addEventListener('hashchange',()=>{const p=location.hash.replace(/^#\/?/,'');go(p||'home');});
window.addEventListener('keydown',(e)=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();location.hash='/search';setTimeout(()=>$('#item-query')?.focus(),100);}});
go(location.hash.replace(/^#\/?/,'')||'home');
if('serviceWorker' in navigator&&location.protocol==='https:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
})();