/* Four-player basic Mahjong: legal claims, draws, melds and wins; no scoring. */
(function () {
'use strict';
if (window.WcMahjongRules) return;
const typeOf = id => Math.floor(id / 4);
const same = (a, b) => typeOf(a) === typeOf(b);
const nameOf = id => {
 const t = typeOf(id);
 return t < 9 ? (t + 1) + '万' : t < 18 ? (t - 8) + '筒' : t < 27 ? (t - 17) + '条' : ['东', '南', '西', '北', '中', '发', '白'][t - 27];
};
const sorted = hand => hand.sort((a,b) => typeOf(a) - typeOf(b) || a-b);
function init(g) {
 if (!Array.isArray(g.melds)) g.melds = [[], [], [], []];
 for (let i = 0; i < 4; i++) if (!Array.isArray(g.melds[i])) g.melds[i] = [];
 if (!Object.hasOwn(g, 'pending')) g.pending = null;
 return g;
}
function canHu(hand, openCount = 0) {
 if (!Array.isArray(hand) || !Number.isInteger(openCount) || openCount < 0 || openCount > 4 || hand.length !== 14 - openCount * 3 || new Set(hand).size !== hand.length) return false;
 const counts = Array(34).fill(0);
 for (const id of hand) {
  if (!Number.isInteger(id) || id < 0 || id >= 136) return false;
  if (++counts[typeOf(id)] > 4) return false;
 }
 if (openCount === 0 && counts.filter(n => n === 2).length === 7) return true;
 function divide() {
  const t = counts.findIndex(n => n > 0);
  if (t < 0) return true;
  if (counts[t] >= 3) {
   counts[t] -= 3;
   if (divide()) return true;
   counts[t] += 3;
  }
  if (t < 27 && t % 9 < 7 && counts[t+1] && counts[t+2]) {
   counts[t]--; counts[t+1]--; counts[t+2]--;
   if (divide()) return true;
   counts[t]++; counts[t+1]++; counts[t+2]++;
  }
  return false;
 }
 for (let t = 0; t < 34; t++) if (counts[t] >= 2) {
  counts[t] -= 2;
  if (divide()) return true;
  counts[t] += 2;
 }
 return false;
}
function chiOptions(hand, tile) {
 const t = typeOf(tile), moves = [];
 if (t >= 27) return moves;
 for (let start = t-2; start <= t; start++) {
  if (start < 0 || start >= 27 || start % 9 > 6 || Math.floor(start / 9) !== Math.floor(t / 9)) continue;
  const ids = [start, start+1, start+2].filter(x => x !== t).map(x => hand.find(id => typeOf(id) === x));
  if (ids.length === 2 && ids.every(Number.isInteger)) moves.push({ chi: ids });
 }
 return moves;
}
function claimOptions(g, seat, from, tile, kind) {
 const hand = g.hands[seat], matching = hand.filter(id => same(id,tile)), options = [];
 if (canHu([...hand,tile], g.melds[seat].length)) options.push({ hu: true });
 if (kind === 'robkong') return options;
 if (matching.length >= 3 && g.wall.length) options.push({ kong: tile, kind: 'exposed' });
 if (matching.length >= 2) options.push({ peng: true });
 if (seat === (from+1)%4) options.push(...chiOptions(hand,tile));
 return options;
}
const priority = move => move.hu ? 3 : (move.peng || move.kong !== undefined) ? 2 : move.chi ? 1 : 0;
function offer(g, kind, from, tile) {
 const choices = [];
 for (let distance = 1; distance < 4; distance++) {
  const seat = (from+distance)%4, options = claimOptions(g,seat,from,tile,kind);
  for (const level of new Set(options.map(priority))) choices.push({seat, level, distance});
 }
 choices.sort((a,b) => b.level-a.level || a.distance-b.distance);
 if (!choices.length) return false;
 g.pending = {kind, from, tile, order: choices.map(x=>({seat:x.seat,level:x.level})), index:0};
 g.turn = g.pending.order[0].seat;
 return true;
}
function takeNext(g, seat) {
 g.turn = (seat+1)%4;
 if (!g.wall.length) {g.status = 'finished'; g.result = '流局'; return;}
 g.hands[g.turn].push(g.wall.pop()); sorted(g.hands[g.turn]);
}
function kong(g, seat, tile, kind) {
 if (!g.wall.length) return false;
 const hand = g.hands[seat];
 if (kind === 'added') {
  const meld = g.melds[seat].find(m => m.type === 'peng' && same(m.tiles[0], tile));
  const at = hand.indexOf(tile);
  if (!meld || at < 0) return false;
  hand.splice(at,1); meld.type = 'kong'; meld.kind = 'added'; meld.tiles.push(tile);
 } else {
  const tiles = hand.filter(id => same(id,tile)).slice(0,4);
  if (tiles.length !== 4) return false;
  g.hands[seat] = hand.filter(id => !tiles.includes(id));
  g.melds[seat].push({type:'kong',kind:'concealed',tiles,from:seat});
 }
 g.hands[seat].push(g.wall.pop()); sorted(g.hands[seat]);
 g.moves.push({seat,kong:tile,kind});
 return true;
}
function legalMoves(g, seat) {
 init(g);
 if (g.status !== 'playing' || g.turn !== seat) return [];
 const hand = g.hands[seat];
 if (g.pending) {
  const p = g.pending;
  return p.order[p.index]?.seat === seat ? [...claimOptions(g,seat,p.from,p.tile,p.kind).filter(move=>priority(move)===p.order[p.index].level),{pass:true}] : [];
 }
 if (hand.length !== 14 - 3*g.melds[seat].length) return [];
 const options = hand.map(tile => ({tile}));
 if (canHu(hand,g.melds[seat].length)) options.push({hu:true});
 if (g.wall.length) {
  const seen = new Set();
  for (const tile of hand) {
   const t = typeOf(tile);
   if (seen.has(t)) continue;
   seen.add(t);
   if (hand.filter(id=>typeOf(id)===t).length===4) options.push({kong:tile,kind:'concealed'});
   if (g.melds[seat].some(m=>m.type==='peng' && same(m.tiles[0],tile))) options.push({kong:tile,kind:'added'});
  }
 }
 return options;
}
function validateMove(g, seat, move) {
 if (!move || typeof move !== 'object' || Array.isArray(move)) return null;
 return legalMoves(g,seat).find(option => {
  if (option.hu) return move.hu === true && Object.keys(move).every(k=>k==='hu');
  if (option.pass) return move.pass === true && Object.keys(move).every(k=>k==='pass');
  if (option.peng) return move.peng === true && Object.keys(move).every(k=>k==='peng');
  if (option.kong !== undefined) return move.kong === option.kong && move.kind === option.kind;
  if (option.chi) return Array.isArray(move.chi) && option.chi.length === move.chi.length && option.chi.every((id,i)=>id===move.chi[i]);
  return option.tile === move.tile && !('hu' in move) && !('pass' in move);
 }) || null;
}
function finish(g, seat, message) {g.status='finished';g.winner=g.players[seat].id;g.result=g.players[seat].name+message;}
function play(g, memberId, move) {
 if (!g || g.gameType!=='mahjong' || g.status!=='playing' || g.players[g.turn]?.id !== memberId) return false;
 const seat = g.turn, action = validateMove(g,seat,move);
 if (!action) return false;
 if (g.pending) {
  const p = g.pending;
  if (action.pass) {
   p.index++;
   if (p.index < p.order.length) g.turn = p.order[p.index].seat;
   else {
    g.pending = null;
    if (p.kind==='robkong') {if (!kong(g,p.from,p.tile,'added')) return false;g.turn=p.from;}
    else takeNext(g,p.from);
   }
   g.moves.push({seat,pass:true,phase:p.kind});
  } else if (action.hu) {
   if (p.kind === 'robkong') {const fromHand=g.hands[p.from],at=fromHand.indexOf(p.tile);if(at>=0)fromHand.splice(at,1);}
   else {const river=g.discards[p.from],at=river.lastIndexOf(p.tile);if(at>=0)river.splice(at,1);}
   g.pending = null;
   g.moves.push({seat,hu:true,kind:p.kind,from:p.from,tile:p.tile});
   finish(g,seat,p.kind==='robkong'?'抢杠胡':'点炮胡');
  } else {
   if (p.kind !== 'discard') return false;
   const hand = g.hands[seat], river=g.discards[p.from],at=river.lastIndexOf(p.tile);
   if (at<0) return false;
   const take=action.chi?[...action.chi]:hand.filter(id=>same(id,p.tile)).slice(0,action.kong!==undefined?3:2);
   if (take.some(id=>!hand.includes(id))) return false;
   g.hands[seat]=hand.filter(id=>!take.includes(id));river.splice(at,1);
   const type=action.chi?'chi':action.kong!==undefined?'kong':'peng';
   g.melds[seat].push({type,kind:type==='kong'?'exposed':'open',tiles:[...take,p.tile],from:p.from,called:p.tile});
   g.pending=null;g.turn=seat;
   if (type==='kong') {g.hands[seat].push(g.wall.pop());sorted(g.hands[seat]);}
   g.moves.push({seat,claim:type,tile:p.tile,from:p.from});
  }
 } else if (action.hu) {
  g.moves.push({seat,hu:true,kind:'self'});
  finish(g,seat,'自摸胡牌');
 } else if (action.kong !== undefined) {
  if (action.kind==='added' && offer(g,'robkong',seat,action.kong)) g.moves.push({seat,kong:action.kong,kind:'declare'});
  else kong(g,seat,action.kong,action.kind);
 } else {
  const at=g.hands[seat].indexOf(action.tile);if(at<0)return false;
  g.hands[seat].splice(at,1);g.discards[seat].push(action.tile);
  g.moves.push({seat,tile:action.tile});
  if (!offer(g,'discard',seat,action.tile)) takeNext(g,seat);
 }
 g.updatedAt=Date.now();
 if (g.moves.length>450&&g.status==='playing'){g.status='finished';g.result='对局结束';}
 return true;
}
function botStep(g) {
 if(!g||g.status!=='playing'||g.players[g.turn]?.id==='user')return false;
 const seat=g.turn, moves=legalMoves(g,seat);
 if(!moves.length)return false;
 if(g.pending){const claim=moves.find(m=>m.hu)||moves.find(m=>m.kong!==undefined||m.peng)||moves.find(m=>m.chi);return play(g,g.players[seat].id,claim&&Math.random()>.3?claim:{pass:true});}
 const win=moves.find(m=>m.hu);if(win)return play(g,g.players[seat].id,win);
 const supplement=moves.find(m=>m.kong!==undefined);if(supplement)return play(g,g.players[seat].id,supplement);
 const counter=new Map();g.hands[seat].forEach(id=>counter.set(typeOf(id),(counter.get(typeOf(id))||0)+1));
 const discard=g.hands[seat].map(tile=>({tile,score:(counter.get(typeOf(tile))||1)*3+(typeOf(tile)<27?((counter.get(typeOf(tile)-1)||0)+(counter.get(typeOf(tile)+1)||0))*2:0)+Math.random()})).sort((a,b)=>a.score-b.score)[0];
 return !!discard&&play(g,g.players[seat].id,{tile:discard.tile});
}
function view(g, seat) {
 init(g);
 return {remainingTiles:g.wall.length,
  discards:g.discards.map(h=>h.map(id=>({id,name:nameOf(id)}))),
  melds:g.melds.map((list,index)=>list.map(m=>({type:m.type,kind:m.kind,from:m.from,tiles:m.kind==='concealed'&&index!==seat&&g.status==='playing' ? m.tiles.map(()=>({id:null,name:'暗杠'})) : m.tiles.map(id=>({id,name:nameOf(id)}))}))),
  pending:g.pending?{kind:g.pending.kind,from:g.pending.from,tile:{id:g.pending.tile,name:nameOf(g.pending.tile)}}:null,
  ...(seat>=0&&seat===g.turn&&g.status==='playing'?{legalMoves:legalMoves(g,seat)}:{})};
}
function describeMove(move) {
 if(move.pass)return '过';
 if(move.hu)return move.kind==='self'?'自摸胡牌':move.kind==='robkong'?'抢杠胡':'点炮胡';
 if(move.claim)return ({chi:'吃',peng:'碰',kong:'明杠'}[move.claim]||'副露')+' '+nameOf(move.tile);
 if(move.kong!==undefined)return (move.kind==='declare'?'补杠待响应':move.kind==='added'?'补杠':'暗杠')+' '+nameOf(move.kong);
 return '打出：'+nameOf(move.tile);
}
window.WcMahjongRules=Object.freeze({init,canHu,legalMoves,play,botStep,view,describeMove});
}());