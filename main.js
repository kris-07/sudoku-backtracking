var boxes=document.querySelectorAll('.box');
var gs = new Set([1,2,3,4,5,6,7,8,9]);
var generated_grid,position_changed={}, grid_blank_filled=0,max_pos=0,zero_c=0, p_el=0,blank_pos_count =5;
var obj;
var grid = new Array();


function oned2twod(n){
	let r,c;
	r=parseInt(n/9);
	c=parseInt(n)%9;
	return [r,c];
}

function twod2oned(r,c){
	let n;
	r=parseInt(r);
	c=parseInt(c);
	n=r*9+c;
	return n;
}

Set.prototype.union = function(otherSet) 
{ 
    var unionSet = new Set(); 
    for (var elem of this) 
    { 
        unionSet.add(elem); 
    }
    for(var elem of otherSet) 
        unionSet.add(elem);
    return unionSet; 
}

Set.prototype.intersection = function(otherSet) 
{ 
    var intersectionSet = new Set(); 
    for(var elem of otherSet) 
    { 
        if(this.has(elem)) 
            intersectionSet.add(elem); 
    } 
return intersectionSet;                 
} 

Set.prototype.difference = function(otherSet) 
{ 
    var differenceSet = new Set();
    for(var elem of this) 
    { 
        if(!otherSet.has(elem)) 
            differenceSet.add(elem); 
    }
    return differenceSet; 
} 

Array.prototype.shuffle = function (y) {
    this.sort(() => Math.random() - 0.5);
    return this;
}


if(localStorage.saved_grid){
    generated_grid = JSON.parse(localStorage.saved_grid);
    if(localStorage.saved_grid_index)
        position_changed = JSON.parse(localStorage.saved_grid_index);
    display();
}
else{
    newGrid();
}


function gridGen(){
    for(let i=0 ;i<9;i++)
    {
        grid[i]=[];
        for(let j=0;j<9;j++)
        grid[i].push(0);
    }
    for (let y=0;y<9;y++){
        for (let x=0;x<9;x++){
            if(grid[y][x]==0)
                zero_c++;
        }
    }
    //let start, end;
    //start = new Date().getTime();
    
    solve();
    //end = new Date().getTime();
    //console.log(end-start);
    
    console.log(grid);
}

function solve(){
    for (let y=0;y<9;y++){
        for (let x=0;x<9;x++){
            if(grid[y][x]==0){
                let number_set = new Set([1,2,3,4,5,6,7,8,9].shuffle());
                number_set.forEach((n) => {
                    if(possible(y,x,n)){
                        grid[y][x] = n;
                        grid_blank_filled ++;
                        solve();
                        if(zero_c==grid_blank_filled )
                            return;
                        grid[y][x] = 0;
                        grid_blank_filled --;
                    }
                });
                return;
            }
        }
    }
    
}

function possible (y,x,n) {
    let rcc,bc,uc;
    rcc = row_colCheck(y,x);
    bc = _blockCheck(y,x);
    uc= rcc.union(bc);    
    return (!uc.has(n));
}

function _check_create (y,x,n) {
    let rcc,bc,uc;
    let gc = new Set([1,2,3,4,5,6,7,8,9]);
    rcc = row_colCheck(y,x);
    bc = _blockCheck(y,x);
    uc= rcc.union(bc);    
    return (gc.difference(uc));
}

function row_colCheck(r,c){
    var rc = new Set();
    var cc = new Set();
    for(let i = 0;i<9;i++){
        let k = grid[r][i];
        let l = grid[i][c];
        if(k && c!=i){ 
            rc.add(k);       
        }
        if(l && r!=i){ 
            cc.add(l);       
        }
    }
    return rc.union(cc);
}

function _blockCheck(r,c){
    var bc = new Set();
	let _r=parseInt(r/3)*3;
    let _c=parseInt(c/3)*3;
	for(let i =_r ;i<_r+3;i++){
		for(let j =_c;j<_c+3;j++){
			let k = grid[i][j];
            if(k && !(r==i && c==j)){
                bc.add(k);       
            }
		}
    }
    return bc;
}

//End of Grid generate

function check(index){
    let n = parseInt(boxes[index].innerText);
    let rc,cc,bc,uc,dc;
    rc = rowCheck(index);
    cc = columnCheck(index);
    bc = blockCheck(index);
    uc = rc.union(cc);
    uc= uc.union(bc);
    dc= gs.difference(uc);
    if(uc.has(n))
        boxes[index].style.backgroundColor = '#ffbab0';
    else{
        boxes[index].style.backgroundColor = '';   
    }
    return dc;
    
}
function rowCheck(index){
    index = parseInt(index);
    let indexa,r,c,n;
    n=boxes[index].innerText;
    indexa=oned2twod(index);
    r=indexa[0];
    c=indexa[1];
    var rc = new Set();
    for(let i = 0;i<9;i++){
        let l = twod2oned(r,i);
        let k = parseInt(boxes[l].innerText);
        if(k && index!=l){ 
            rc.add(k);       
        }
    }
    return rc;
}
function columnCheck(index){
    let indexa,r,c,n;
    n=boxes[index].innerText;
    indexa=oned2twod(index);
    r=indexa[0];
    c=indexa[1];
    var cc = new Set();
    for(let i = 0;i<9;i++){
        let l = twod2oned(i,c);
        let k = parseInt(boxes[l].innerText);
        if(k && index!=l){ 
            cc.add(k);       
        }
    }
    return cc;
}
function blockCheck(index){
    let indexa,r,c,n;
    n=boxes[index].innerText;
    indexa=oned2twod(index);
    var bc = new Set();
	r=parseInt(indexa[0]/3)*3;
    c=parseInt(indexa[1]/3)*3;
	for(let i =r ;i<r+3;i++){
		for(let j =c;j<c+3;j++){
			let l = twod2oned(i,j);
            let k = parseInt(boxes[l].innerText);
            if(k && index!=l){ 
                bc.add(k);       
            }
		}
    }
    return bc;
}
function removeFewNumbers(){
    generated_grid = JSON.parse(JSON.stringify(grid));
    let count=blank_pos_count;
    while(count >0){
        let i,j;
        i = (parseInt(Math.random()*100)%9);
        j = (parseInt(Math.random()*100)%9);
        
        if(generated_grid[i][j]!=0)
        {
            generated_grid[i][j]=0;
            count--;
        }
    }
    console.log(generated_grid);
}

function display(){
    
    boxes.forEach( (el,index) => {
        el.style.backgroundColor = '';
        let indexa,i,j;
        indexa=oned2twod(index);
        i=indexa[0];
        j=indexa[1];
        if(generated_grid[i][j]==0){
            if(index in position_changed){
                el.innerText=position_changed[index];
            }
            else{
                el.innerText='';
            }
            el.classList.value = 'box box-editable';
            el.onclick = function(){
                if(p_el||p_el==0){
                    
                    //console.log(p_el);
                    boxes[p_el].style.backgroundColor = '';
                }
                    
                
                let num = parseInt(this.innerText);
                this.innerText =(num>0 && num<9) ? this.innerText-(-1) : 1;
                position_changed[index]=this.innerText;
                check(index);
                localStorage.saved_grid = JSON.stringify(generated_grid);
                localStorage.saved_grid_index = JSON.stringify(position_changed);
                p_el=index;
                let position_changed_keys = Object.keys(position_changed);
                if(position_changed_keys.length==blank_pos_count ){
                    // for( let x=0;x<position_changed_keys.length ;x++){
                    //     //console.log(position_changed);
                    //     //console.log([...check(x)],Object.keys(position_changed));
                    //     let check_index = position_changed[position_changed_keys[x]]
                    //     console.log(check_index,check(position_changed_keys[x]));
                    //     if(check(position_changed_keys[x]).has(parseInt(check_index))){
                    //         console.log('Index check true :',check_index);
                    //         continue;
                    //         boxes[x].style.backgroundColor='';
                    //         console.log(x);
                            
                    //     }
                    //     //else
                    //     //return;
                    // }
                    for(let x in position_changed){
                        //console.log(position_changed[x],check(x))
                        if(check(x).has(parseInt(position_changed[x]))){
                            //console.log('Index check true :',x);
                            continue;
                        }
                        else
                        return;
                    }
                    document.querySelector('.win-win').style.display='block';
                }
            };
        }
        else{
            el.innerText=generated_grid[i][j];
            el.classList.value = 'box box-nonEditable';
            el.onclick=undefined;
        }
    });
}

function newGrid(){
    position_changed={};
    document.getElementById('finish-new-game').style.display='none';
    gridGen();
    removeFewNumbers();
    display();
    localStorage.saved_grid = JSON.stringify(generated_grid);
    localStorage.removeItem('saved_grid_index');
    p_el=null;
}

function resetGrid(){
    position_changed={};
    display();
    localStorage.removeItem('saved_grid_index');
    p_el=null;
}
