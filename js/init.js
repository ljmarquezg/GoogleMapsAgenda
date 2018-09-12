function cambiarPagina(pagina){
    $.mobile.changePage("#"+pagina,{
        transition: "none"
    });
}

$(document).ready(function(){
    var hoteles = [],
        latInicial = 3.44595822,
        lngInicial = -76.531177,
        lat,
        lng,
        popupTitulo,
        popupMensaje,
        marcadorInicial;


        var hotel1 = {
            nombre: "Hotel2",
            ciudad: "Colombia",
            direccion: "sdsadsaasdads",
            telefono: "-1546563132",
            lat: 18,
            lng: -131,
            email: "asdadasdsd",
            estrellas: 1
        }

        var hotel2 = {
            nombre: "Hotel1",
            ciudad: "Venezuela",
            direccion: "sdsadsaasdads",
            telefono: "-1546563132",
            lat: 18,
            lng: -131,
            email: "asdadasdsd",
            estrellas: 2
        }

       hoteles.push(hotel1)
       hoteles.push(hotel2)

    //Parametros para Mapas
    var mapaRegistro,
        mapaLista,
        latlngInicial = new google.maps.LatLng(latInicial, lngInicial),
        geocoder = new google.maps.Geocoder(),
        infowindow = new google.maps.InfoWindow,
        mensajeMarcadorInicial = "Mover para Seleccionar el punto en el mapa";
        ventanaInfoInicial = new google.maps.InfoWindow({
            content: mensajeMarcadorInicial
        }),
        opciones = {
            zoom: 5,
            center: latlngInicial,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    
    /*************************************************************************
     *                  Funciones
     *************************************************************************/
    function mostrarMapa(){
        mapaRegistro = new google.maps.Map(document.getElementById("registroMapa"), opciones);
        lat = $("#lat").val(latInicial);
        lng = $("#lng").val(lngInicial);
        marcadorInicial = new google.maps.Marker({
            position: latlngInicial,
            draggable: true,
            title: "Punto Referencia",
            map: mapaRegistro 
        });
        
        google.maps.event.addListener(marcadorInicial, "click", function(){
            ventanaInfoInicial.open(mapaRegistro, marcadorInicial);
        });

        google.maps.event.addListener(marcadorInicial, "dragend", function(event){
            $("#lat").val(event.latLng.lat());
            $("#lng").val(event.latLng.lng());
            geocodeLatLng(geocoder, mapaRegistro, infowindow);
        })
    }

    function geocodeLatLng(geocoder, map, infowindow) {
        lat = $("#lat").val();
        lng = $("#lng").val();
        var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              infowindow.setContent(results[0].formatted_address);
              infowindow.open(map, marcadorInicial);
              var direccion = ''+results[0].formatted_address+'',
                  arregloDireccion = direccion.split(", "),
                  ciudad = arregloDireccion.pop();
              $("#ciudad").val(ciudad)
              $("#direccion").val(direccion);
            } else {
              window.alert('No se han encontrado resultados.');
            }
          } else {
            window.alert('Se ha generado un error: ' + status);
          }
        });
      }
    

    $("#btnRegistrarHotel").click(function(){   
        var nombre = ($("#nombre").val()).trim();
        var ciudad = ($("#ciudad").val()).trim();
        var direccion = ($("#direccion").val()).trim();
        var telefono = ($("#telefono").val()).trim();
        var email = ($("#email").val()).trim();
        var estrellas = $('input[name="estrellas"]:checked').length;
        var lat = ($("#lat").val()).trim();
        var lng = ($("#lng").val()).trim();
        
        if ( nombre == "" || ciudad == "" || direccion == "" || telefono == "" || email == "" || estrellas == 0 || lat == "" || lng == ""){
            for (var i = 0; i < $("input").length ; i++){
                if ($("input")[i].value == ""){
                    $("input")[i].setAttribute("style", "box-shadow: 0 0 5px red; background-color: white");
                }
            }
            if(estrellas == 0){
                $('.ui-controlgroup-controls').addClass("error");;
            }
            popupTitulo = "Formulario Incompleto";
            popupMensaje = "Por favor complete el formulario";
            mostrarDialogo();
        }else{
            estrellas = $('input[name="estrellas"]:checked').val();
            var hotel ={
                nombre: nombre,
                ciudad: ciudad,
                direccion: direccion,
                telefono: telefono,
                email: email,
                estrellas: estrellas,
                lat: lat,
                lng: lng,
            };
            
            hoteles.push(hotel);
            popupTitulo = "Registro exitoso";
            popupMensaje = "Se ha registrado la información correctamente. <br>Actualmente existen "+hoteles.length+ " hoteles registrados";

            mostrarDialogo();
            $("#nombre").val("");
            $("#ciudad").val("");
            $("#telefono").val("");
            $("#direccion").val("");
            $("#email").val("");
            $('input[type="radio"]').removeAttr("checked").data("cacheval","false");
            $('label[for^="estrella"]').removeClass("ui-radio-on ui-radio-active active ui-btn-active").addClass("ui-radio-off");
            
        }
    });

    function listarHoteles(){
        var totalHoteles = $(hoteles).length
        $(".ui-li-count").html(totalHoteles);
        $("li.list-item").remove();
        if (totalHoteles == 0){
            $("#listaHotel").append('<li class="list-item" id="detalle">No existen resitros guardados</li>');
        }else{
            $(".list-item").remove()
            for (var i=0; i < totalHoteles; i++){
                var item = '<li class="list-item"><a id="'+i+'" class="detalleHotel"> <h2>'+hoteles[i].nombre+ " "+ obtenerEstrellas(hoteles[i].estrellas)+ '</h2><p><b>Ciudad: </b>'+hoteles[i].ciudad+'</p></a></li>';
                $("#listaHotel").append(item);
            }
             detalleHotel();
        }

    }

    function detalleHotel(){
        if (hoteles.length == 0){
            $("#mensajeLista").html("No existen hoteles registrados")
        }else{
            $("#mensajeLista").html("")
            $(".detalleHotel").click(function(){
                var id = $(this).attr("id"),
                    nombreHotel = hoteles[id].nombre
                    latHotel = hoteles[id].lat,
                    lngHotel = hoteles[id].lng,
                    valoracion = hoteles[id].estrellas,
                    estrellas = obtenerEstrellas(valoracion);
                    tbody = $('<tbody class="infoHotel"></tbody>'),
                    tr = $('<tr></tr>'),
                    td1 = $('<th></th>').html(nombreHotel),
                    td2 = $('<td></td>').html(hoteles[id].ciudad),
                    td3 = $("<td></td>").html(hoteles[id].direccion),
                    td4 = $('<td></td>').html(hoteles[id].telefono),
                    td5 = $('<td></td>').html(hoteles[id].email),
                    td6 = $('<td></td>').html(estrellas),
                    td7 = $('<td></td>').html(latHotel),
                    td8 = $('<td></td>').html(lngHotel),
                    
                    $("#nombreHotel").html(nombreHotel);
                    latlngHotel = new google.maps.LatLng(latHotel, lngHotel);
                    mapaRegistro;
                    mapaLista;
                    opcionesHotel = {
                            zoom: 5,
                            center: latlngHotel,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    mapaRegistro = new google.maps.Map(document.getElementById("detalleHotelMapa"), opcionesHotel);
                    marcadorRegistro = new google.maps.Marker({
                        position: latlngHotel,
                        draggable: false,
                        map: mapaRegistro 
                    });
                $(".infoHotel").remove();
                tr.append(td1);
                tr.append(td2);
                tr.append(td3);
                tr.append(td4);
                tr.append(td5);
                tr.append(td6);
                tr.append(td7);
                tr.append(td8);
                tbody.append(tr);
                $("#detalleHotel").append(tbody);
                cambiarPagina("paginaDetalleHotel");
                $("#detalleHotel").table( "rebuild" );
            });
        }
    }
    
    function mostrarDialogo(){
        $("#popupMensaje").html(popupMensaje);
        $("#popupTitulo").html(popupTitulo);
        $("#dialogo").popup("open");
    }

    function obtenerEstrellas(valoracion){
        var estrellas = "";
            for (var i = 0; i < 5; i++){
                if (i < valoracion){
                    estrellas += '<span class="active">★</span>';
                }else{
                    estrellas += '<span>★</span>';
                }
            }
        return estrellas
    }
    mostrarMapa();
    listarHoteles();
    detalleHotel();

    /**************************************************************************
                  Accion de botones
    **************************************************************************/
   $("input").focus(function(){
        $(this).attr("style", "")
    });

    $(".btnPaginaRegistrarHotel").click(function(){
        cambiarPagina('paginaRegistrarHotel');
    });

    $(".btnPaginaListaHotel").click(function(){
        listarHoteles();
        cambiarPagina('paginaListaHotel');
        $("#listaHotel").listview("refresh");
        
    });

    $(".volver").click(function(){
        cambiarPagina('paginaInicio');
    });

    $("input[name^='estrella']").bind( "change", function(event, ui) {
        $('.ui-controlgroup-controls').removeClass("error");
        var  value = $(this).attr("value"),
             boton = $('label[for^="estrella"]'),
             actual = $('label[for^="estrella'+value+'"]'),
             position = actual.attr("for");
             var total = boton.length
             for (var i = 0; i < total ; i++){
                $(boton[i]).removeClass("active");
                if ($(boton[i]).attr("for") <= position ){
                    $(boton[i]).addClass("active");
                    console.log($(boton[i]));
                }
             }
    });
});