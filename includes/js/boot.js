var course = course || {};
var PATH_CONFIG = "./data.xml";
(function(doc, undefined) {
    'use strict';
    //
    require.config({
        baseUrl: './includes/js',
        paths: {
            jquery: 'vendor/jquery-1.11.2.min',
            jquery_scorm: "iframe/vendor/scorm.jquery",
            imagesloaded: "vendor/imagesloaded.pkgd.min",
            nicescroll: "vendor/jquery.nicescroll.min",
            modernizr: "vendor/modernizr",
            velocity: "vendor/velocity.min",
            detectmobilebrowser: "vendor/detectmobilebrowser",
            transform2d_jquery: "vendor/jquery.transform2d",
            transform3d_jquery: "vendor/jquery.transform3d",
            transit_jquery: "vendor/jquery.transit.min",
            easing_jquery: "vendor/jquery.easing.min",
            easepack: "vendor/EasePack.min",
            tweenMax: "vendor/TweenMax.min",
            slider: "vendor/bootstrap-slider.min",
            easydrag: "vendor/jquery.easydrag.handler.beta2",
            componentes_jquery: "vendor/componentes.jquery",
            blast: "vendor/blast",
            viewElement: "vendor/viewElement",
            behaviorAdapt: "vendor/behaviorAdapt",
            course: 'course'
        },
        shim: {
            jquery: {
                exports: '$'
            },
            imagesloaded: {
                deps: ['jquery']
            },
            nicescroll: {
                deps: ['jquery']
            }
        }
    });

    require(['jquery'], function($) {
        require(['course'], function(_course) {
            $(function() {
                course = _course;
                course.setCourse('PATH_CONFIG', PATH_CONFIG).init();
            });
        });
    });

})(document);