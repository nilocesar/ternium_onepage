define(['jquery', 'jquery_scorm', 'modernizr', 'imagesloaded', 'velocity', 'componentes_jquery',
    "transform2d_jquery", "transform3d_jquery", "transit_jquery", "easing_jquery", 'detectmobilebrowser',
    'easepack', "tweenMax", 'slider', 'easydrag', 'blast', 'wow', 'behaviorAdapt'
], function($) {

    'use strict';

    var course = function() {
        var $public = {};
        var $private = {};

        //=============================================================
        // VARIABLES
        //=============================================================

        $private.projectData = {};
        $private.componenteData = {};

        $public.pathTelas = "views/telas/";
        $public.ajudaIndice = 0;
        $public.indice = 0;
        $public.indiceOLD = 0;
        $public.config = [];
        $public.liberado = false;
        $public.block = true;
        $public.debug = false;
        $public.retornar = false;
        $public.cache = false;
        $public.log = true;
        $public.resize = false;
        $public.body = $("body");
        $public.IE = (navigator.userAgent.indexOf("Edge") > -1 || navigator.userAgent.indexOf("Trident/7.0") > -1) ? true : false;
        $public.MOBILE = SmartPhone.isAny();
        $public.parentBody = null;

        $public.pageLoaderInit = 3; /// carrega 3 página inicialmente 


        $public.telasExce = [{
            "t": "aa1",
            "a": 0
        }]; /// telas exceção de carregamento - elas já são carregadas na primeira remessa

        $public.padraoALL = 0;




        //=============================================================
        // PUBLIC FUNCTIONS
        //=============================================================  

        $public.init = function init() {

            $private.initXML();

        };

        $public.setComponente = function setComponente(pathName, pathData) {
            $private.componenteData[pathName] = pathData;
        };

        $public.getComponente = function getComponente(pathName) {
            return $private.componenteData[pathName];
        };

        $public.setCourse = function setCourse(pathName, pathData) {
            $private.projectData[pathName] = pathData;
            return $public;
        };

        $public.getCourse = function getCourse(pathName) {
            return $private.projectData[pathName];
        };

        ///Função chamada em carregamento.js
        $public.carregamentoCompleto = function carregamentoCompleto() {
            $private.carregamentoInitComplete();
        }

        $public.createBase = function createBase(complete) {
            $public.getComponente("base").create(complete);
        }

        $public.liberarNavegacao = function liberarNavegacao() {
            $public.getComponente("base").liberarNavegacao();
        }

        $public.carregamento = function carregamento() {
            $public.getComponente("carregamento").carregar();
        }

        $public.motion = function motion(_status) {
            $public.getComponente("motion").call(_status);
        }

        $public.scorm_get_suspendData = function scorm_get_suspendData(variable) {
            return $public.getComponente("scorm").getSuspendata(variable);
        }

        $public.scorm_set_suspendData = function scorm_set_suspendData(variable, value) {
            $public.getComponente("scorm").setSuspendata(variable, value);
        }

        $public.scorm_get_lessonLocation = function scorm_get_lessonLocation(variable) {
            return $public.getComponente("scorm").getLessonLocation(variable);
        }

        $public.scorm_set_lessonLocation = function scorm_set_lessonLocation(variable, value) {
            $public.getComponente("scorm").setLessonLocation(variable, value);
        }

        $public.scorm_set_score = function scorm_set_score(raw) {
            $public.getComponente("scorm").setScore(raw);
        }

        $public.scorm_get_score = function scorm_get_score() {
            return $public.getComponente("scorm").getScore();
        }

        $public.scorm_set_interactions = function scorm_set_interactions(indice, correto, resposta, tipo, tempoGasto, pesoDado) {
            $public.getComponente("scorm").setInteractions(indice, correto, resposta, tipo, tempoGasto, pesoDado); //_indice, correto, resposta, _tipo, _tempoGasto, _pesoDado
        }

        $public.scorm_set_status_lesson = function scorm_set_status_lesson(_status) {
            $public.getComponente("scorm").setStatusLesson(_status)
        }

        $public.scorm_get_status_lesson = function scorm_get_status_lesson() {
            return $public.getComponente("scorm").getStatusLesson()
        }

        $public.getInteractionsCount = function getInteractionsCount() {
            return $public.getComponente("scorm").getInteractionsCount();
        }

        $public.sairScorm = function sairScorm() {
            $public.getComponente("scorm").sairScorm();
        }

        $public.completeScorm = function completeScorm() {
            $public.getComponente("scorm").completeScorm();
        }

        $public.sair = function sair() {
            $public.getComponente("base").sair();
        }


        //=============================================================
        // CONTROLES
        //=============================================================    

        //////////////////////////////// 
        //       INIT XML             //
        ////////////////////////////////

        $private.initXML = function initXML() {
            require(["utils/xml/xmlLoader"], function(module) {
                module.init($public);
                module.create(function() {
                    $private.initScorm();
                });
            });
        };

        //////////////////////////////// 
        //       SCORM                //
        ////////////////////////////////


        $private.initScorm = function initScorm() {
            require(["utils/scorm/scorm"], function(module) {
                module.init($public);
                module.create(function() {
                    $private.initBase();
                    $private.initSpeed();
                });

                $public.setComponente("scorm", module);
            });
        }

        //////////////////////////////// 
        //       SPEED                //
        ////////////////////////////////

        $private.initSpeed = function initSpeed() {
            if ($public.speed) {
                require(["componentes/speed"], function(module) {
                    module.init($public);
                });
            }
        }


        //////////////////////////////// 
        //       NAVEGACAO            //
        ////////////////////////////////

        $private.initBase = function initBase() {
            require(["componentes/base"], function(module) {
                module.init($public);
                $public.setComponente("base", module);
                $private.initNav();
            });
        }

        $private.initNav = function initNav() {

            require(["utils/navegacao/carregamento"], function(module) {
                module.init($public);
                $public.setComponente("carregamento", module);
            });

            require(["utils/navegacao/motion"], function(module) {
                module.init($public);
                $public.setComponente("motion", module);
            });

            require(["utils/navegacao/navegacao"], function(module) {
                module.init($public);
                module.create();
                $public.setComponente("navegacao", module);
            });

            require(["componentes/info"], function(module) {
                module.init($public);
                module.create();
                $public.setComponente("info", module);
            });
        }


        $private.carregamentoInitComplete = function carregamentoInitComplete() {


            var _indice = $public.indice + 1;

            $(".containerAA" + _indice).css("display", "none");
            $("#loading").css("display", "none");
            $(".containerAA" + _indice).css("display", "block");

            window.parent.iframe.preloaderComplete();

            //
            window.BehaviorAdapt(1920, 1080, 22); // largura, altura, font-size base 

            //Iniciar após o carregamento inicial
            $("body").attr("nav", "init");
            $("body").trigger("navegacao");

            // var wow = new WOW({
            //     boxClass: 'wow',
            //     animateClass: 'animated',
            //     offset: 90,
            //     mobile: false,
            //     live: true
            // });

            // if ($("body").hasClass("appear-animate")) {
            //     wow.init();
            // }

        }

        return $public;
    };

    return course();
});