//funcion para inicializar la IA
 function InicioIA(computeFun){
	this.defaultCompute = function(){
		var Lista = obtenerLista();
		//semillas o nodos
		var semilla = Lista.length;
		var index = parseInt(Math.random() * semilla);
		return Lista[index];
	};
	if(typeof computeFun == 'function') this.compute = computeFun;
	else this.compute = this.defaultCompute;
 }
 
function obtenerLista(){
	var iList = itemList;
	var iLista = new Array();
	for(var i = 0;i <= 63; i++){
		if(iList[i].encenderBnd) iLista.push(i);
	}
	return iLista;
}
 
function ListaIA(){

	function Max(){
		var Lista = obtenerLista();
		var iList = itemList;
		var newList = new Array();
		var contJugada = 0;
		//duplicamos la lista del estado
		for(var i = 0;i <= 63; i++){
			itemListO[i] = new Ficha();
			itemListO[i].estado = iList[i].estado;
			itemListO[i].encenderBnd = iList[i].encenderBnd;
			if(itemListO[i].estado == 1 || itemListO[i].estado == 2) contJugada++;
		}
		estadoT = estadoActual;
		var mejorVal = -10000;
		var bestArray = new Array();
		var profundidad = 5;
		var fin = false;
		if(contJugada > 54) {profundidad = 10;fin = true;}
		for(var i in Lista){
			Juego(Lista[i],estadoT);
			reiniciarBnd();
			checarDisponible(estadoT);
			estadoT = estadoT == 1? 2: 1;
			var Valor;
			Valor = -baseMax(-1000,1000,profundidad,false,fin);
			retrocederList();
			console.log(Valor + ":" + Lista[i]);
			if(Valor > mejorVal){
				bestArray = new Array();
				bestArray.push(Lista[i]);
				mejorVal = Valor;
			}
			else if(Valor == mejorVal){
				bestArray.push(Lista[i]);
			}
		}
		var res ;
		if(bestArray.length > 1)
			res=bestArray[0];
		else res = bestArray[0];
		console.log(res);
		return res;
	}
	
	this.Max = new InicioIA(Max);

}



function retrocederList(){
	for(var i = 0;i <= 63; i++){
		itemList[i] = new Ficha();
		itemList[i].estado = itemListO[i].estado;
		itemList[i].encenderBnd = itemListO[i].encenderBnd;
	}
	estadoT = estadoActual;
}

function retrocederUnNivel(olist ,oestado){
	for(var i = 0;i <= 63; i++){
		itemList[i] = new Ficha();
		itemList[i].estado = olist[i].estado;
		itemList[i].encenderBnd = olist[i].encenderBnd;
	}
	estadoT = oestado;
}
var itemListO = new Array();
var estadoT;

function baseMax(alpha, beta, profundidad, pasar, fin){
	var mejorVal = -10000;
	var Lista = obtenerLista();
	var iList = itemList;
	var newList = new Array();
	
	// para finalizar
	if(fin){
		if(profundidad == 0)return obtenerPuntos(iList ,estadoT);
		
		for(var i = 0;i <= 63; i++){
			newList[i] = new Ficha();
			newList[i].estado = iList[i].estado;
			newList[i].encenderBnd = iList[i].encenderBnd;
		}
		for(var i in Lista){
				
			Juego(Lista[i],estadoT);
			reiniciarBnd();
			checarDisponible(estadoT);
			estadoT = estadoT == 1? 2: 1;
			var Valor = -baseMax(-beta, -alpha, profundidad-1, false ,true);
			retrocederUnNivel(newList,estadoT == 1? 2: 1);
			
			//Poda Alpha Beta 
			if(Valor > mejorVal){
				mejorVal = Valor;
				if (Valor > alpha) {
					if (Valor >= beta) {
						return Valor;
					}
					alpha = Valor;
				}
			}	
		}	
		if(Lista.length == 0){
			if(pasar){
				return obtenerPuntos(iList);
			}
			else{
				estadoT = estadoT == 1? 2: 1;
				reiniciarBnd();
				checarDisponible(estadoT);
				mejorVal = -baseMax(-beta, -alpha, profundidad-1, true,true);
				retrocederUnNivel(newList,estadoT == 1? 2: 1);
			}
		}
		return mejorVal;
	}
	if(profundidad == 0){
		return Valoracion();
	}
	else{
		// duplicamos la lista del estado
		for(var i = 0;i <= 63; i++){
			newList[i] = new Ficha();
			newList[i].estado = iList[i].estado;
			newList[i].encenderBnd = iList[i].encenderBnd;
		}
		for(var i in Lista){
			Juego(Lista[i],estadoT);
			reiniciarBnd();
			checarDisponible(estadoT);
			estadoT = estadoT == 1? 2: 1;

			// Busqueda para el mejor valor
			if(mejorVal == alpha){
				var Valor = -baseMax(-alpha-1, -alpha, profundidad-1, false);
				if(Valor <= alpha){
					retrocederUnNivel(newList,estadoT == 1? 2: 1);
					continue;
				}
				if(Valor >= beta){
					retrocederUnNivel(newList,estadoT == 1? 2: 1);
					return Valor;
				}
			}
			var Valor = -baseMax(-beta, -alpha, profundidad-1, false);
			retrocederUnNivel(newList,estadoT == 1? 2: 1);
			

			//Poda AlphaBeta 
			if(Valor > mejorVal){
				mejorVal = Valor;
				if (Valor > alpha) {
					if (Valor >= beta) {
						return Valor;
					}
					alpha = Valor;
				}
			}
		}
		if(Lista.length == 0){
			if(pasar){
				return Valoracion();
			}
			else{
				estadoT = estadoT == 1? 2: 1;
				reiniciarBnd();
				checarDisponible(estadoT);
				mejorVal = -baseMax(-beta, -alpha, profundidad-1, true);
				retrocederUnNivel(newList,estadoT == 1? 2: 1);
			}
		}
	}
	return mejorVal;
}

function Valoracion(){
	var res = 0;
	var iList = itemList;
	for(var i =0 ; i < 64; i++){
		var d;
		if(estadoActual == iList[i].estado) 
			d=1;
		else if (estadoActual == (iList[i].estado==1 ? 2 : 1)) 
			d=-1;
		else continue;
		var semilla = 1;
		if(i == 0) semilla = 30;
		else if(i==9) semilla = -25;
		else if(i==1) semilla = -5;
		else if(i==8) semilla = -5;
		if(i == 7) semilla = 30;
		else if(i==14) semilla = -25;
		else if(i==6) semilla = -5;
		else if(i==15) semilla = -5;
		if(i == 56) semilla = 30;
		else if(i==49) semilla = -25;
		else if(i==48) semilla = -5;
		else if(i==57) semilla = -5;
		if(i == 63) semilla = 30;
		else if(i==54) semilla = -25;
		else if(i==55) semilla = -5;
		else if(i==62) semilla = -5;
		res = res + (semilla*d);
	}
	var Lista = obtenerLista();
	return res + Lista.length;
}

function obtenerPuntos(iList , estado){
	if(!estado) estado = estadoActual;
	var oestado = estado == 1? 2: 1;
	var puntos = 0;
	for(var i =0 ; i < 64 ; i++){
		if(iList[i].estado == estado) puntos++;
		else if(iList[i].estado == oestado) puntos--;
	}
	return puntos;
}
	
var ListaIA = new ListaIA();
function IA(id){
	for( ia in ListaIA){
		if(ia == id){
			return ListaIA[ia].compute();
		}
	}
}
