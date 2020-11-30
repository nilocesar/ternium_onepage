define(['jquery', 'nicescroll'], function ($) {
    'use strict';

    var base = function () {
        var $public = {};
        var $private = {};
        var $parent = {};
        var $initMenu = false;
        

        $public.init = function init(_parent) {
            $parent = _parent;
        };

        $public.create = function create(complete) {

            $(".main").append("<div class='base'></div>");
            $(".base").load("views/interface/base/index.html", function () {
                $private.estruturarMenu();
                $private.createTelasContainer();
                $private.controleNavBase();
                $private.createEventosMenu();
                
                complete();
            });

            $private.reziseModal();
            $(window).resize(function () {
                $(".telaBase").height($(window).height());
                $private.reziseModal();
            });

        };


        $public.liberarNavegacao = function liberarNavegacao() {

            $(".setaDirBase").removeClass("setaInativa");
            $parent.liberado = true;

            var _indice = $parent.indice;
            var _config = $parent.config;
            $.each(_config, function (index, value) {
                if (_indice == value.indice) {
                    value.visivel = true;
                }
            });
        }
        
        $public.sair = function sair() {
             $(".sairContainer").css("display", "block");
        }

        $private.createTelasContainer = function createTelasContainer() {
            var _config = $parent.config;

            $.each(_config, function (index, value) {
                $(".telaBase").append("<div indice=" + value.indice + " id=" + value.id + " avancar=" + value.avancar + "  carregado=" + value.carregado + " setas=" + value.setas + " tipo=" + value.tipo + " transicao=" + value.transicao + "  class='telaContainer telaContainer" + value.indice + "'></div>");
            })
        }

        $private.controleNavBase = function controleNavBase() {

            $(".setaEsqBase").on('click', function () {
                $("body").attr("nav", "previous");
                $("body").trigger("navegacao");
            })

            $(".setaDirBase").on('click', function () {
                if ($parent.liberado) {
                    $("body").attr("nav", "next");
                    $("body").trigger("navegacao");
                }
            })

            var _config = $parent.config;
            $parent.ajudaIndice = 0;
            $parent.calculadoraIndice = 0;


            $("body").on('navegacaoComplete', function () {
                var _indice = $parent.indice;
                var _config = $parent.config;
 
                

                $.each(_config, function (index, value) {
                    if ($parent.indice == value.indice) {
                        $private.verificarStatusSetas(index, value, _indice, _config);
                        $private.contadorTitulosStatus(index, value, _indice, _config);
                        $private.destravarStatus(index, value, _indice, _config);
                    }
                })

                //
                // var _heightTop = parseInt($('.topBase').css("height"));
                // $('.telaBase').css("height", window.innerHeight - _heightTop);

            })

        }


        $private.verificarStatusSetas = function verificarStatusSetas(index, value, _indice, _config) {
            if (value.setas == "ambas") {
                $(".setaEsqBase").css("display", "block");
                $(".setaDirBase").css("display", "block");
            } else if (value.setas == "direita") {
                $(".setaEsqBase").css("display", "none");
                $(".setaDirBase").css("display", "block");
            } else if (value.setas == "esquerda") {
                $(".setaEsqBase").css("display", "block");
                $(".setaDirBase").css("display", "none");
            } else {
                $(".setaEsqBase").css("display", "block");
                $(".setaDirBase").css("display", "block");
            }
            //BLOCK AVANCA
            if (value.visivel == true) {
                $(".setaDirBase").removeClass("setaInativa");
                $parent.liberado = true;
            } else {
                $(".setaDirBase").addClass("setaInativa");
                $parent.liberado = false;
            }
        }

        $private.contadorTitulosStatus = function contadorTitulosStatus(index, value, _indice, _config) {

            var _current  = _indice + 1;
            if( _current < 10 )
            {
                $(".bottonInfoCurrent").text( "0" + String(_current));
            }else{
                 $(".bottonInfoCurrent").text( String(_current));
            }
                                             
            var _total = _config.length;
            $(".bottonInfoAll").text(_total);

            ///titulo
            var _titulo1 = value.titulo;
            var _titulo2 = value.parentNivel1.titulo;
            var _titulo3 = value.parentNivel2.titulo;

            $(".titulo1Base").html(_titulo1);
            $(".titulo2Base").html(_titulo2);
            $(".titulo3Base").html(_titulo3);
        }

        $private.destravarStatus = function destravarStatus(index, value, _indice, _config) {

            if (parseInt(value.avancar) > -1) {
                setTimeout(function () {

                    $public.liberarNavegacao();

                }, 1000 * value.avancar);
            }
        }

        $private.createEventosMenu = function createEventosMenu() {
            $private.createMenu();
            $private.createAjuda();
            $private.createSair();
            $private.createRetormar();
        }

        $private.createMenu = function createMenu() {

            $(".main").append("<div class='menuContainer'></div>");
            $(".menuContainer").load("views/interface/menu/index.html", function () {
                $(".menuContainer .fechar").on('click', function () {
                    $(".menuContainer").css("display", "none");
                })
            });

            $(".iconMenuBase").on('click', function () {
                $(".menuContainer").css("display", "block");
                $(".contentMenu").niceScroll();
            })
        }


        $private.estruturarMenu = function estruturarMenu() {

            $private.configMenu = [];

            var _indice = $parent.indice;
            var _config = $parent.config;
            var _indiceIDArray = [];

            for (var i = 0; i < _config.length; i++) {
                var _itemMenu = {
                    telaID: _config[i].id,
                    indiceID: _config[i].indice,
                    titulo: _config[i].parentNivel1.titulo,
                    id: _config[i].parentNivel1.id
                };

                if (_indiceIDArray.indexOf(_config[i].parentNivel1.id) == -1) {
                    $private.configMenu.push(_itemMenu);
                    _indiceIDArray.push(_config[i].parentNivel1.id)
                }
            }
        }

        $private.createRetormar = function createRetormar() {

            if (!$parent.retornar) /// confere se é para ter a tela de retornar de onde parou
                return false

            var _indice = $parent.indice;
            if (_indice != 0) {
                $(".retormar").css("display", "block");

                $(".retormar").find(".naoSair").on("click", function () {

                    $(".retormar").css("display", "none");
                    

                    $parent.indice = 0;
                    $("body").attr("nav", "go");
                    $("body").trigger("navegacao");

                });

                $(".retormar").find(".simSair").on("click", function () {
                    $(".retormar").css("display", "none");
                });

            }
        }

        $private.controleTelas = function controleTelas() {


            if ($parent.scorm_get_suspendData("indiceMenu")) {
                if (Number($parent.scorm_get_suspendData("indiceMenu")) <= $parent.indice) {
                    $parent.scorm_set_suspendData("indiceMenu", $parent.indice)
                }
            } else {
                $parent.scorm_set_suspendData("indiceMenu", $parent.indice)
            }

            var _indice = $parent.indice;
            var _config = $parent.config;
            var _indiceMenu = Number($parent.scorm_get_suspendData("indiceMenu"));
            var _configMenu = $private.configMenu;


            for (var i = 1; i <= _configMenu.length; i++) {


                if (!$initMenu) /// Cria os btn somente uma vez
                {
                    if (i != 1) {
                        $("#menuItem1").clone(true).attr("id", "menuItem" + i).appendTo(".contentMenu");
                    }
                    //  
                    $("#menuItem" + i).find("spam").html(_configMenu[i - 1].titulo);
                    $("#menuItem" + i).attr("indiceID", _configMenu[i - 1].indiceID);
                    $("#menuItem" + i).attr("status", "disabled");
                    $("#menuItem" + i).addClass("disabled");
                    $("#menuItem" + i).on("mouseover", function (event) {
                        if ($(this).attr("status") != "disabled") {
                            $(this).removeClass("disabled active blick over");
                            $(this).addClass("over");
                        }
                    });
                    $("#menuItem" + i).on("mouseout", function (event) {
                        $(this).removeClass("disabled active blick over");
                        $(this).addClass($(this).attr("status"));

                    });
                    $("#menuItem" + i).on("click", function (event) {

                        var _status = $(this).attr("status");
                        if (_status != "disabled") {
                            $parent.indice = Number($(this).attr("indiceID"));
                            $("body").attr("nav", "go");
                            $("body").trigger("navegacao");
                            $(".menuContainer").css("display", "none");
                        }
                    });
                }

                if (_configMenu[i - 1].indiceID > _indiceMenu) {

                    if ($("#menuItem" + i).attr("status") != "active" && $("#menuItem" + i).attr("status") != "blick") {
                        $("#menuItem" + i).attr("status", "disabled");
                        $("#menuItem" + i).removeClass("disabled active blick over");
                        $("#menuItem" + i).addClass("disabled");

                    } else /// esse else 'e o controle de quando volta para tras
                    {
                        $("#menuItem" + i).attr("status", "active");
                        $("#menuItem" + i).removeClass("disabled active blick over");
                        $("#menuItem" + i).addClass("active");
                    }
                } else {
                    $("#menuItem" + i).attr("status", "active");
                    $("#menuItem" + i).removeClass("disabled active blick over");
                    $("#menuItem" + i).addClass("active");
                }


                ///O BLINK e o ATUAL
                if (_config[$parent.indice].parentNivel1.id == _configMenu[i - 1].id) {
                    $("#menuItem" + i).attr("status", "blick");
                    $("#menuItem" + i).removeClass("disabled active blick over");
                    $("#menuItem" + i).addClass("blick");
                }
            }

            $initMenu = true;
        }


        $private.createAjuda = function createAjuda() {
            $(".main").append("<div class='ajudaContainer'></div>");
            $(".ajudaContainer").load("views/interface/ajuda/index.html", function () {
                $(".ajudaContainer .fechar").on('click', function () {
                    $(".ajudaContainer").css("display", "none");
                })
            });

            $(".iconAjudaBase").on('click', function () {
                $(".ajudaContainer").css("display", "block");
            })

        }

        $private.createSair = function createSair() {

            $(".main").append("<div class='sairContainer'></div>");
            $(".sairContainer").load("views/interface/sair/sair.html", function () {
                $(".sairContainer .naoSair").on('click', function () {
                    $(".sairContainer").css("display", "none");
                })

                $(".sairContainer .simSair").on('click', function () {
                    $private.sairCurso();
                })

            });
            
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                $(".iconSairBase").css("display", "block");    
            }
            
            $(".iconSairBase").on('click', function () {
                $(".sairContainer").css("display", "block");
            })
        }

        $private.sairCurso = function sairCurso() {

            var _quit_url = "views/interface/sair/encerrado.html";

            if (top === window) { // IS IFRAME
                var Browser = navigator.appName;
                var indexB = Browser.indexOf('Explorer');

                if (indexB > 0) {
                    var indexV = navigator.userAgent.indexOf('MSIE') + 5;
                    var Version = navigator.userAgent.substring(indexV, indexV + 1);

                    if (Version >= 7) {
                        window.open('', '_self', '');
                        window.close();
                    } else if (Version == 6) {
                        window.opener = null;
                        window.close();
                    } else {
                        window.opener = '';
                        window.close();
                    }

                } else {
                    window.open('', '_parent', '');
                    window.close();
                }
            } else {
                var contentRoot = window;
                var urlBase = $private.GetContentRootUrlBase(contentRoot);
                window.location.href = urlBase + _quit_url;
            }
            
           $parent.sairScorm();
        }

        $private.GetContentRootUrlBase = function GetContentRootUrlBase(contentRoot) {

            var urlParts = contentRoot.location.href.split("/");
            delete urlParts[urlParts.length - 1];
            contentRoot = urlParts.join("/");
            return contentRoot;
        }

        $private.reziseModal = function reziseModal() {


            // Get screen size (inner/outerWidth, inner / outerHeight)
            var height = $(window).height();
            var width = $(window).width();


            if (width > height) {
                // Landscape
                $(".portrait").css("display", "none");
            } else {

                // Portrait
                setTimeout(function () {
                    $(".portrait").css("display", "block");
                }, 1000 * 0.2);

            }
        }

        return $public;
    };

    return base();
});
