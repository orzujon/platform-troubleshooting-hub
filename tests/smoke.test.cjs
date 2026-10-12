const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const get=(file)=>fs.readFileSync(path.join(root,file),'utf8');

const elements=new Map();
const listeners=new Map();
const el=(name)=>{
 if(!elements.has(name))elements.set(name,{innerHTML:'',textContent:'',hidden:false,focus(){},scrollIntoView(){},selectionStart:0,setSelectionRange(){}});
 return elements.get(name);
};
const doc={
 querySelector:el,
 documentElement:{dataset:{}},
 activeElement:{tagName:'BODY'},
 title:'',
 addEventListener:(name,fn)=>listeners.set('doc:'+name,fn)
};
const location={hash:'#/home',protocol:'https:'};
const store={};
const storage={getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=v;}};
const browser={scrollTo(){},addEventListener:(name,fn)=>listeners.set('win:'+name,fn)};
const context={window:browser,document:doc,location,localStorage:storage,navigator:{},
 setTimeout:(f,t)=>1,clearTimeout:()=>{},confirm:()=>true,Blob,URL,console};
vm.createContext(context);
vm.runInContext(get('ops-data.js'),context,{filename:'ops-data.js'});
const KB=browser.OpsData;
assert.equal(KB.commands.length,50);
assert.ok(KB.errors.length>=15);
assert.ok(KB.runbooks.length>=10);
assert.ok(KB.labs.length>=8);
assert.ok(KB.questions.length>=12);
for(const [id,node] of Object.entries(KB.tree)){
 assert.ok(node.q||node.leaf,id+' missing title');
 for(const option of node.options||[])assert.ok(KB.tree[option[1]],id+' unknown next step '+option[1]);
}
assert.equal(new Set(KB.commands.map(x=>x.id)).size,KB.commands.length);
for(const c of KB.commands)assert.ok(c.command&&c.purpose&&c.interpretation);
vm.runInContext(get('ops-app.js'),context,{filename:'ops-app.js'});
function goto(route){location.hash='#/'+route;listeners.get('win:hashchange')();return el('#view').innerHTML;}
for(const route of ['home','triage','commands','errors','runbooks','labs','interview','notes','search']){
 const html=goto(route);assert.ok(html.length>180,route+' did not render');
}
assert.match(goto('home'),/Start with evidence/);
assert.match(goto('commands'),/sudo ss -lntp/);
assert.match(goto('labs'),/Mystery process on port 8080/);
assert.match(goto('errors'),/status=203\/EXEC/);
assert.match(goto('notes'),/incident library/i);
function click(ds){
 const button={dataset:ds,hasAttribute:()=>false};
 listeners.get('doc:click')({target:{closest:(selector)=>selector==='button'?button:null}});
}
goto('triage');click({tree:'ref1'});
assert.match(el('#view').innerHTML,/is any process listening/);
click({tree:'refLoop'});
assert.match(el('#view').innerHTML,/loopback binding mismatch/);
click({action:'tree-back'});
assert.match(el('#view').innerHTML,/is any process listening/);
goto('interview');click({quizAnswer:'1'});
assert.match(el('#view').innerHTML,/Correct reasoning/);
goto('notes');click({action:'save-report'});
assert.match(el('#view').innerHTML,/Saved incidents · 1/);
assert.ok(storage.getItem('ops_v2_archive'));
console.log('OpsField smoke tests passed: data, all routes, diagnostic branches, quiz and notebook.');
