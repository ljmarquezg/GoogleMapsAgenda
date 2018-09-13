function cambiarPagina(pagina){
    $.mobile.changePage("#"+pagina,{
        transition: "none"
    });
}

$(document).ready(function(){
    var hoteles = [],
        hotel1 = {
            nombre: "Hilton Trinidad",
            direccion: 'Lady Young Rd, Port of Spain, Trinidad and Tobago',
            lat: 10.6719602,
            lng: -61.5087979999998,
            ciudad: "Colombia",
            telefono: "email",
            email: 'Miasdasd',
            estrellas: 3
        },
        hotel2 = {
            nombre: "Trinidad Hayyatt",
            direccion: '1, Wrightson Rd, Port of Spain, Trinidad & Tobago',
            lat: 10.6506061,
            lng: -61.51650670000036,
            ciudad: "Colombia",
            telefono: "email",
            email: 'Miasdasd',
            estrellas: 3
        },

        hotel3 = {
            nombre: "Hilton España",
            direccion: '1, Wrightson Rd, Port of Spain, Trinidad & Tobago',
            lat: 40.4518794,
            lng: -3.585782,
            ciudad: "Colombia",
            telefono: "email",
            email: 'Miasdasd',
            estrellas: 4
        },
        latInicial = 3.44595822,
        lngInicial = -76.531177,
        lat,
        lng,
        origen,
        llegada,
        latActual,
        lngActual,
        popupTitulo,
        popupMensaje,
        marcadorInicial,
        disabledOn = true,
        navigatorOn = false;
        

        hoteles.push(hotel1);
        hoteles.push(hotel2);
        hoteles.push(hotel3);
    //Parametros para Mapas
    var mapaRegistro,
        mapaLista,
        mapaRutas,
        latlngInicial = new google.maps.LatLng(latInicial, lngInicial),
        geocoder = new google.maps.Geocoder(),
        directionsDisplay,
        directionsServices = new google.maps.DirectionsService(),
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
        
        geocodeLatLng(geocoder, mapaRegistro, infowindow);

        $('#btnUbicarMapa').on('click', function(event) {
            event.preventDefault();
            if (($("#nombre").val()).trim().length == 0){
                popupTitulo = "Error";
                popupMensaje = "El campo Nombre no puede estar vacío";
                mostrarDialogo();
            }else{
                geocodeAddress(geocoder, mapaRegistro);
            }
        });

          
        google.maps.event.addListener(marcadorInicial, "click", function(){
            ventanaInfoInicial.open(mapaRegistro, marcadorInicial);
        });

        google.maps.event.addListener(marcadorInicial, "dragend", function(event){
            moverMarcador(event)
        })

        google.maps.event.addListener(mapaRegistro, "click", function(event){
            moverMarcador(event)
        })

        function moverMarcador(event){
            $("#lat").val(event.latLng.lat());
            $("#lng").val(event.latLng.lng());
            var latlng = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
            marcadorInicial.setPosition(latlng)
            geocodeLatLng(geocoder, mapaRegistro, infowindow);
            $("#direccion").attr("style", "");
            $("#ciudad").attr("style", "");
        }
    }

    function geocodeAddress(geocoder, resultsMap) {
        showLoading("Buscando Punto...");
        var address = $('#nombre').val();
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            marcadorInicial.setPosition(results[0].geometry.location);
            // infowindow.setContent(results[0].formatted_address);
            $("#lat").val(resultsMap.center.lat());
            $("#lng").val(resultsMap.center.lng());
            geocodeLatLng(geocoder, mapaRegistro, infowindow);
            hideLoading();
          } else {
            popupTitulo = "Error";
            popupMensaje = "Se ha generado un error: "+ status;
            mostrarDialogo();
            hideLoading();
          }
        });
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
                popupTitulo = "Error";
                popupMensaje = "No se han encontrado resultados.";
                mostrarDialogo();
            }
          } else {
            popupTitulo = "Error";
            popupMensaje = "Se ha generado un error:" + status;
            mostrarDialogo();
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
            verificarHoteles();
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
        if (hoteles.length != 0){
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
        $(".dialogo").popup();
        $("#popupMensaje").html(popupMensaje);
        $("#popupTitulo").html(popupTitulo);
        $(".dialogo").popup("open");
    }

    function verificarHoteles(){
        if (hoteles.length == 0){
            $(".btnPaginaListaHotel").addClass("ui-disabled");
            $(".mostrarRutas").addClass("ui-disabled");
        }else{
            $(".btnPaginaListaHotel").removeClass("ui-disabled")
            $(".mostrarRutas").removeClass("ui-disabled")
        };
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

    function llenarSelects(){
        mapaRutas = new google.maps.Map(document.getElementById("mapaRutas"), opciones);
        if (navigatorOn == true){
            $('#rutaOrigen').append('<option value="actual">Posicion Actual</option>');
            $('#rutaLlegada').append('<option value="actual">Posicion Actual</option>');
        }

        for ( var i = 0; i < hoteles.length; i++){
             $('#rutaOrigen').append('<option value="'+i+'">'+hoteles[i].nombre+'</option>')
             $('#rutaLlegada').append('<option value="'+i+'">'+hoteles[i].nombre+'</option>')
        }

        $('select').selectmenu('refresh', true);

        $('#btnCalcularRuta').on('click', function(){
            calcularRuta();
        })

        // $('select').on('change', function(){
        //     calcularRuta();
        // })
    }

    function calcularRuta(){
        showLoading("Calculando Ruta...");
        origen = $("#rutaOrigen option:selected").val(),
        llegada = $("#rutaLlegada option:selected").val();
        
        if (origen == "actual"){
            alert(lngActual)
            latOrigen = latActual;
            lngOrigen = lngActual;
        }else{
            latOrigen = hoteles[origen].lat;
            lngOrigen =  hoteles[origen].lng;
        }

        if (llegada == "actual"){
            latLlegada = latActual;
            lngLlegada = lngActual;
        }else{
            latLlegada = hoteles[llegada].lat;
            lngLlegada = hoteles[llegada].lng;
        }
        
        puntoOrigen = new google.maps.LatLng(latOrigen, lngOrigen);
        puntoLlegada = new google.maps.LatLng(latLlegada, lngLlegada);

        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(mapaRutas);

        var peticion = {
            origin: puntoOrigen,
            destination: puntoLlegada,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsServices.route(peticion, function(respuesta, estado){
            if (estado == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(respuesta);
            }else{
                popupMensaje= "Error en el servicio. "+ estado
                popupTitulo = "Navigator";
                mostrarDialogo();
            }
            hideLoading();
        })
    }
   
    function exitoso(pos){
            latActual = pos.coords.latitude;
            lngActual = pos.coords.longitude;
            navigatorOn = true;
            disabledOn = false;
            hideLoading();
            popupTitulo = "Navigator";
            popupMensaje = "Usuario Localizado";
            mostrarDialogo();
    };

    function fallido(error){
        popupTitulo = "Navigator";
        popupMensaje = error.message;;
        disabledOn = false;
        hideLoading();
        mostrarDialogo();
    };

    function showLoading(texto){
        $.mobile.loading("show",{
            textOnly: false,
            textVisible: true,
            theme: "b",
            text: texto
        })
    }

    function hideLoading(){
        $.mobile.loading("hide");
    }

    function obtenerPosicionActual(){
        if (navigator.geolocation){
            disabledOn = true;
            navigator.geolocation.getCurrentPosition(exitoso, fallido, {
                maximumAge: 500000,
                enableHighAccuracy: true,
                timeout: 6000,
            });
            showLoading("Obteniendo ubicación actual del usuario. Por favor espere.");
        }else{
            alert("Tu navegador no es compatible con la geolocalización")
        }
    }
    /**************************************************************************
                  Accion de botones
    **************************************************************************/
   $("input").focus(function(){
        $(this).attr("style", "")
    });

    $(".btnPaginaRegistrarHotel").on("click",function(){
        if (disabledOn == false){
            verificarHoteles()
            cambiarPagina('paginaRegistrarHotel');
        }
    });

    $(".btnPaginaListaHotel").on("click",function(){
        if (disabledOn == false){
            listarHoteles();
            cambiarPagina('paginaListaHotel');
        }
        $("#listaHotel").listview("refresh");
        
    });

    $(".volver").on("click",function(){
        if (disabledOn == false){
            verificarHoteles();
            cambiarPagina('paginaInicio');
        }
    });

    $(".mostrarRutas").on("click",function(){
        if (disabledOn == false){
            cambiarPagina('paginaRutas');
            llenarSelects();
        }
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
                }
             }
    });

    verificarHoteles();
    mostrarMapa();
    listarHoteles();
    detalleHotel();
    obtenerPosicionActual();
});