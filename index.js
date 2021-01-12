// funcion para recuperar el valor de la coordenada en X
function indiceX(index){
	if(index == 0) return 0;
	else return Math.round(index%8);
}
// funcion para recuperar el valor de la coordenada en Y
function indiceY(index){
	if(index == 0) return 0;
	else return parseInt(index/8); 
}
//funcion para recuperar coordenadas(x,y)
function coordenadaIndice(x,y){
	return y * 8 + x ;
}
//recuperar el objeto que esta en la posicion de las coordenadas
function getObjIndice(index,direccion,paso){
	//posicion x
	var curX = indiceX(index);
	//posicion Y
	var curY = indiceY(index);
	var nextX,nextY;
	
	if(typeof paso == 'undefined' || paso == 0){
		paso = 1;
	}
	//recorrer casillas de acuerdo al caso del que sea la direccion
	switch(direccion){
		case 0: 
			nextX = curX - paso;
			nextY = curY; 
			break;
		case 1: 
			nextX = curX - paso;
			nextY = curY - paso; 
			break;
		case 2: 
			nextX = curX ;
			nextY = curY - paso; 
			break;
		case 3: 
			nextX = curX + paso;
			nextY = curY - paso; 
			break;
		case 4: 
			nextX = curX + paso;
			nextY = curY; 
			break;
		case 5: 
			nextX = curX + paso;
			nextY = curY + paso; 
			break;
		case 6: 
			nextX = curX ;
			nextY = curY + paso; 
			break;
		case 7: 
			nextX = curX - paso;
			nextY = curY + paso; 
			break;	
	}
	//if para cachar errores
	if(typeof nextX == 'undefined' || typeof nextY == 'undefined' || nextX < 0 || nextY < 0 || nextX > 7 || nextY > 7){
		return null;
	}
	//retornamos los parametros de las variables obtenidas nextX y nextY a la funcion de coordenadas
	return coordenadaIndice(nextX,nextY);
}

function Ficha(){
	//0:null; 1:negra; 2:blanca;
	this.estado = 0;
	this.encenderBnd = false;
}
//lista de las casillas
var itemList = new Array();
var estadoActual = 1;

//funcion del tablero
 function InitList(){
	for(var i = 0;i <= 63; i++){
		itemList[i] = new Ficha();
	}
	//iniciamos el juego en los puntos de partida
	//si estado=2 la ficha es blanca, estado=1 la ficha es negra
	itemList[coordenadaIndice(3,3)].estado = 2;
	itemList[coordenadaIndice(4,4)].estado = 2;
	itemList[coordenadaIndice(3,4)].estado = 1;
	itemList[coordenadaIndice(4,3)].estado = 1;
	//encenderBandera en las posiciones iniciales, encenderBand para posibles movimientos
	itemList[coordenadaIndice(2,3)].encenderBnd = true;
	itemList[coordenadaIndice(3,2)].encenderBnd = true;
	itemList[coordenadaIndice(4,5)].encenderBnd = true;
	itemList[coordenadaIndice(5,4)].encenderBnd = true;
	
 }
 //funcion para reiniciar nuestra bandera a false
 function reiniciarBnd(){
 	//copia la lista itemList a iList
	var iList = itemList;
	for(var i = 0;i <= 63; i++){
		iList[i].encenderBnd = false;
	}
 }
 
 //
 function checarDisponible(estado){
 	//una condición( ?)true=2,false=1, expresión si la condición es verdadera ( :) , expresión si la condición es falsa
	var oestado = estado == 1? 2: 1;
	var encenderBnd = false;
	var iList = itemList;
	for(var i = 0;i <= 63; i++){
		if(iList[i].estado == estado){
			for(var j = 0; j <= 7 ; j++){
				var index = getObjIndice(i,j,1);
				if(index != null && iList[index].estado == 0){
					//para ver la direccion opuesta
					var od;
					if(j < 4) od = j + 4;
					else od = j - 4;  
					for(var s = 1 ; s <= 7 ; s ++){
						// pasamos s=1 como paso a la funcion getObjIndice
						var oIndex = getObjIndice(i,od,s);
						if(oIndex == null || iList[oIndex].estado == 0 ) break;
						if(iList[oIndex].estado == oestado){
							iList[index].encenderBnd = true;
							encenderBnd = true;
							break;
						}
					}
				}
			}
		}
	}
	return encenderBnd;
 }
 

// funcion para fijar estado
 function setEstado(index,estado){
	var iList = itemList;
	iList[index].estado = estado ;
 }

 //funcion para mostrar
 function setMostrar(index,direccion,paso,estado){
	for(var s = 1; s < paso;s++){
		setEstado(getObjIndice(index,direccion,s),estado);
	}
 }

 
 function Juego(index,estado){
	var oestado = estado == 1? 2: 1;
	var iList = itemList;
	setEstado(index,estado);
	directionLoop:
	for(var d = 0; d<= 7; d ++){
		stepLoop:
		var setBnd = false;
		for(var s = 1; s<= 7; s ++){
			var nIndex = getObjIndice(index,d,s);
			if(nIndex == null || iList[nIndex].estado == 0 ) continue directionLoop;
			if(iList[nIndex].estado == estado){
				if(s == 1) continue directionLoop;
				if(setBnd){
					setMostrar(index,d,s,estado);
					continue directionLoop;
				}
			}
			else{
				setBnd = true;
			}
		}
	}
 }


 $(function(){
	var bandera = true;//true: vs IA;false: vs Humano;
	var ladoIA = 2;
	var sim = false;

	function puntuacion(){
		//contadores de puntos de Negras o Blancas
		var cont_N = 0;
		var cont_B = 0;
		for(var i = 0;i <= 63; i++){
			var a = $("#casilla_" + i);
			a.removeClass();
			a.parent().removeClass();
			switch(itemList[i].estado){
				case 0:
					break;
				case 1:
					a.addClass("negra");
					cont_N ++;
					break;
				case 2:
					a.addClass("blanca");
					cont_B ++;
					break;
			}
			if(itemList[i].encenderBnd){
				a.addClass("juego");
				a.parent().addClass("juego_li");
			} 	
		}
		$("#turno").removeClass().addClass(estadoActual == 1 ? "negra" : "blanca");
		$("#cont_Negras").text(cont_N);
		$("#cont_Blancas").text(cont_B);
	}
	
	//funcion cuando elegimos jugar vs IA
	function JuegoIA(){
		$("#calculando").show();
		sim = true;
		var ia = $("#algoritmo").val();
		setTimeout(function(){
			var index = IA(ia);	
			sim = false;
			$("#casilla_" + index).click(); 
			$("#calculando").hide();},0);
	}
	

	$("a").click(function(){
		if(!$(this).hasClass("juego") || sim) return;
		Juego($(this).attr('id').replace('casilla_',''),estadoActual);
		reiniciarBnd();
		if(!checarDisponible(estadoActual)){
			estadoActual = estadoActual == 1? 2: 1;
			if(!checarDisponible(estadoActual)){
				//finalizamos el juego
				puntuacion();
				return;
			}
			else{
				estadoActual = estadoActual == 1? 2: 1;
				puntuacion();
				if(estadoActual == ladoIA && bandera){
					JuegoIA();
				} 
			}
		}
		else{
			estadoActual = estadoActual == 1? 2: 1;
			puntuacion();
			if(estadoActual == ladoIA && bandera){
				JuegoIA();
			} 
		}
	});
	
	$("#vsHumano").click(function(){
		bandera = false;
		InitList();
		puntuacion();
		$(".start").hide();
	});
	$("#vsIA").click(function(){
		bandera = true;
		InitList();
		puntuacion();
		$(".start").hide();
		if(ladoIA == 1) JuegoIA();
	});

// para las opciones que tenemos de elegir una IA
	for(var i in ListaIA){
		$("#algoritmo").append("<option value="+i+">"+i+"</option>");
	}
 })