const cols = 9, rows = 6;
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const cellW = canvas.width / cols, cellH = canvas.height / rows;

const colors = ['red','blue'];
let current = 0;
let grid = Array.from({length: rows}, () => Array.from({length: cols}, () => ({count:0, owner:-1})));

canvas.addEventListener('click', e => {
  const c = Math.floor(e.offsetX / cellW), r = Math.floor(e.offsetY / cellH);
  const cell = grid[r][c];
  if (cell.owner === -1 || cell.owner === current) {
    cell.count++;
    cell.owner = current;
    resolveExplosions();
    current = 1 - current;
    draw();
  }
});

function resolveExplosions(){
  let toCheck = [];
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++)
    if (grid[r][c].count >= criticalMass(r,c))
      toCheck.push([r,c]);
  while(toCheck.length){
    const [r,c] = toCheck.shift();
    const cell = grid[r][c];
    const owner = cell.owner;
    const burst = cell.count - criticalMass(r,c);
    cell.count -= criticalMass(r,c);
    if (cell.count <= 0) cell.owner = -1;
    for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nr = r+dr, nc = c+dc;
      if (nr>=0 && nr<rows && nc>=0 && nc<cols){
        let ncells = grid[nr][nc];
        ncells.count++;
        ncells.owner = owner;
        if (ncells.count >= criticalMass(nr,nc))
          toCheck.push([nr,nc]);
      }
    }
  }
}

function criticalMass(r,c){
  let cnt = 0;
  if(r>0) cnt++; if(r<rows-1) cnt++;
  if(c>0) cnt++; if(c<cols-1) cnt++;
  return cnt;
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      ctx.strokeStyle = '#888';
      ctx.strokeRect(c*cellW, r*cellH, cellW, cellH);
      const cell = grid[r][c];
      if (cell.count > 0){
        ctx.fillStyle = colors[cell.owner];
        for(let i=0;i<cell.count;i++){
          const x = c*cellW + cellW*(0.3 + 0.4*Math.random());
          const y = r*cellH + cellH*(0.3 + 0.4*Math.random());
          ctx.beginPath();
          ctx.arc(x,y, cellW*0.1, 0, 2*Math.PI);
          ctx.fill();
        }
      }
    }
  }
}

draw();
