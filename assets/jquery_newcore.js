window.slate = window.slate || {};
window.theme = window.theme || {};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

if(Shopify && typeof Shopify === 'object') {

    Shopify.addValueToString = function(str, obj) {
        $.each(obj, function(i) {
            str = str.replace('{{ ' + i + ' }}', this);
        });
        return str;
    };
    Shopify.handleize = function (str) {
        return str.toLowerCase().replace(/[-!"#$%&'* ,./:;<=>?@[\\\]_`{|}~]+/g, "-").replace(/[()]+/g, "").replace(/^-+|-+$/g, "");
    };
}
theme.Global = function() {
    function Global() {
        this.load();
    };

    Global.prototype = $.extend({}, Global.prototype, {
        load: function() {
            var ua = window.navigator.userAgent.toLowerCase(),
                current_bp,
                $scroll_example = $('.scroll-offset-example');
            window.$window = $(window);
            window.$html = $('html');
            window.$body = $html.find('body');
        }
    });
    theme.Global = new Global;
};

theme.Notifications = function() {

    function Notifications() {
        this.selectors = {
            elems: '.popup-cookie'
        };

        this.settings = {
            close_limit: 40,
            translate_limit: 50,
            opacity_limit: 0.4
        };

        this.load();
    };
    Notifications.prototype = $.extend({}, Notifications.prototype, {
        load: function() {
            var _ = this,
                dif;
		
            $body.on('mousedown', this.selectors.elems, function(e) {
                if(e.target.tagName === 'A' || $(e.target).parents('[data-js-action]').length) {
                    return;
                }

                _.is_holded = true;

                var $this = $(this),
                    start_posX = e.screenX;

                dif = 0;

                $this.addClass('animate');
              jQuery("body").addClass("notifications-cookie");
                setTimeout(function () {
                    $this.addClass('pressed');
                }, 0);

                $body.on('mousemove.notification', function(e) {
                    var posX = e.screenX,
                        set_posX = Math.min(start_posX + _.settings.translate_limit, Math.max(start_posX - _.settings.translate_limit, posX));

                    dif = set_posX - start_posX;

                    $this.removeClass('animate');
					jQuery("body").removeClass("notifications-cookie");
                    setTimeout(function () {
                        $this.css({
                            transform: 'translateX(' + dif + 'px) scale(0.95)',
                            opacity: Math.max((_.settings.translate_limit - Math.abs(dif)) / _.settings.translate_limit, _.settings.opacity_limit)
                        });
                    }, 0);

                    setTimeout(function () {
                        $this.addClass('animate');
                      jQuery("body").addClass("notifications-cookie");
                    }, 0);
                });

                $body.one('mouseup.notification', function() {
                    $this.trigger('mouseup');
                });

                e.preventDefault();
                return false;
            });

            $body.on('mouseup', this.selectors.elems, function() {
                var $this = $(this);

                _.is_holded = false;
                
                $body.unbind('mousemove.notification mouseup.notification');

                setTimeout(function () {
                    if(Math.abs(dif) > _.settings.close_limit) {
                        var $notification = $this.find('[data-js-notification-inner]'),
                            $btn_close = $notification.find('[data-js-action="close"]').first();

                        if($notification.hasClass('d-none')) {
                            return;
                        }

                        $this.one('transitionend', function() {
                            dif = 0;

                            $this.trigger('mouseup').trigger('transitionend');

                            $btn_close.trigger('click');
                            $notification.trigger('transitionend');

                            $this.trigger('onpressedend');
                        });

                        $this.css({
                            transform: 'translateX(' + (dif + 20) + 'px) scale(0.95)',
                            opacity: 0
                        });
                    } else {
                        $this.removeClass('pressed');

                        $this.one('transitionend' ,function () {
                            $this.removeClass('animate');
                          jQuery("body").removeClass("notifications-cookie");
                            $this.trigger('onpressedend');
                        });

                        $this.css({
                            transform: '',
                            opacity: ''
                        });
                    }

                    if($this.css('transition-duration') === '0s') {
                        $this.trigger('transitionend');
                    }
                }, 0);
            });

            $body.on('close', this.selectors.elems, function() {
                var $this = $(this);

                $body.unbind('mousemove.notification');
                $this.trigger('mouseup').trigger('transitionend');
            });
        },
        _cookies: function($container) {
            var _ = this,
                $notification = $container.find('.cookies-inner');

            if($notification.length) {
                var $btn_close = $notification.find('[data-js-action="close"]'),
                    cookie = $.cookie('notification-cookies'),
                    show_once = $notification.attr('data-js-show-once'),
                    delay = +$notification.attr('data-js-delay'),
                    cookies_life = +$notification.attr('data-js-cookies-life');

                if(cookie !== 'off') {
                    setTimeout(function () {
                        _._show($notification, function () {
                            $btn_close.one('click', function() {
                               jQuery("body").removeClass("notifications-cookie");
                                if(show_once === 'true') {
                                    var date = new Date(),
                                        timer = 24 * 60 * 60 * 1000 * cookies_life;

                                    date.setTime(date.getTime() + timer);

                                    $.cookie('notification-cookies', 'off', {
                                        expires: date,
                                        path: '/'
                                    });
                                }

                                $(this).off();

                                _._hide($notification, function () {
                                    $notification.remove();
                                });
                            });
                        });
                    }, delay * 1000);
                }

                return $btn_close;
            }
        },
        _products: function($container) {
        },
        _show: function ($notification, callback, beforeShow) {
            $notification.unbind('transitionend');

            if(callback) {
                $notification.one('transitionend', function () {
                    callback();
                });
            }

            $notification.removeClass('d-none');
            $notification.addClass('animate');
          jQuery("body").addClass("notifications-cookie");

            function onVisible() {
                setTimeout(function () {
                    $notification.addClass('visible');
                }, 0);

                if($notification.css('transition-duration') === '0s') {
                    $notification.trigger('transitionend');
                }
            };

            if(beforeShow) {
                beforeShow(onVisible);
            } else {
                onVisible();
            }
        },
        _hide: function ($notification, callback) {
            $notification.unbind('transitionend');

            $notification.one('transitionend', function () {
               jQuery("body").removeClass("notifications-cookie");
                $notification.addClass('d-none').removeClass('animate').removeAttr('style');

                $notification.parents('.popup-cookie').trigger('close');

                if(callback) {
                    callback();
                }
            });

            $notification.removeClass('visible');

            if($notification.css('transition-duration') === '0s') {
                $notification.trigger('transitionend');
            }
        },
        init: function ($container) {
            this._products($container);
            this._cookies($container);
        },
        destroy: function ($container) {
            $container.find('.cookies-inner, .js-notification-products').find('[data-js-action="close"]').off();
        }
    });

    theme.Notifications = new Notifications;
};
theme.ProductCurrency = function() {

    function ProductCurrency() {

    };

    ProductCurrency.prototype = $.extend({}, ProductCurrency.prototype, {
      
        setPrice: function($price, price, compare_at_price) {
            price = +price;
            compare_at_price = +compare_at_price;

            var html = '',
                sale = compare_at_price && compare_at_price > price;

            $price[sale ? 'addClass' : 'removeClass']('price-sale');

            if(sale) {
                html += '<span class="old-price">';
                html += Shopify.formatMoney(compare_at_price, theme.moneyFormat);
                html += '</span>';

                if($price[0].hasAttribute('data-js-show-sale-separator')) {
                    html += theme.strings.priceSaleSeparator;
                }
            }

            html += '<span>';
            html += Shopify.formatMoney(price, theme.moneyFormat);
            html += '</span>';

            $price.html(html);
        },
        update: function() {
            if(theme.multipleСurrencies) {
                Currency.convertAll(window.shop_currency, jQuery('.currencies_ul .currency.selected').data('currency'), 'span.money', 'money_format')
            }
        }
    });

    theme.ProductCurrency = new ProductCurrency;
};
theme.ProductImagesNavigation = function() {

    function ProductImagesNavigation() {
        this.selectors = {
            images_nav: '.js-product-images-navigation'
        };

        this.load();
    };

    ProductImagesNavigation.prototype = $.extend({}, ProductImagesNavigation.prototype, {
        load: function() {
            var _ = this;

            $body.on('click', '[data-js-product-images-navigation]:not([data-disabled])', function() {
                var $this = $(this),
                    $product = $this.parents('[data-js-product]'),
                    direction = $this.attr('data-js-product-images-navigation');

              
                var data = theme.ProductOptions.switchByImage($product, direction, null, function (data) {
                    _._updateButtons($product, data.is_first, data.is_last);
                });
            });
        },
        switch: function($product, data) {
            var $image = $product.find('[data-js-product-image] img');

            if($image.length) {
              
                var image = data.update_variant.featured_image;

                if(!image || !image.src) {
                    if(data.json.images[0]) {
                        image = data.json.images[0];
                    }
                }

                if(image && image.src && image.id !== $image.attr('data-image-id')) {
                    var src = Shopify.resizeImage(image.src, $image.width() + 'x') + ' 1x, ' + Shopify.resizeImage(image.src, $image.width() * 2 + 'x') + ' 2x';

                    this.changeSrc($image, src, image.id);

                    if($image.parents(this.selectors.images_nav).length) {
                        this._updateButtons($product, +data.json.images[0].id === +image.id, +data.json.images[data.json.images.length - 1].id === +image.id);
                    }
                }
            }
        },
        changeSrc: function ($image, srcset, id) {
            var $parent = $image.parent();
            id = id || 'null';
            $image.one('load', function () {
            });
            
            $image.attr('srcset', srcset).attr('data-image-id', id);
        },
        _updateButtons: function($product, is_first, is_last) {
            $product.find('[data-js-product-images-navigation="prev"]')[is_first ? 'attr' : 'removeAttr']('data-disabled', 'disabled');
            $product.find('[data-js-product-images-navigation="next"]')[is_last ? 'attr' : 'removeAttr']('data-disabled', 'disabled');
        }
    });

    theme.ProductImagesNavigation = new ProductImagesNavigation;
};

theme.ProductOptions = function() {

    function ProductOptions() {
        this.selectors = {
            options: '.js-product-options',
            options_attr: '[data-js-product-options]'
        };

        this.afterChange = [];

        this.load();
    };
    ProductOptions.prototype = $.extend({}, ProductOptions.prototype, {
        load: function() {
            var _ = this,
                timeout,
                xhr;

            function onProcess(e) {
                var $this = $(this);

                if ($this.hasClass('active') || $this.hasClass('disabled')) {
                    return;
                }
                var $options = $this.parents(_.selectors.options),
                    $section = $this.parents('[data-property]'),
                    $values = $section.find('[data-js-option-value]'),
                    $product = $this.parents('[data-js-product]'),
                    json = $product.attr('data-json-product'),
                    current_values = {},
                    update_variant = null,
                    is_avilable = true;

                if(e.type === 'click') {
                    $values.removeClass('active');
                    $this.addClass('active');
                }

                _._loadJSON($product, json, function (json) {
                    var $active_values = $options.find('[data-js-option-value].active').add($options.find('option:selected'));

                    $.each($active_values, function() {
                        var $this = $(this);

                        current_values[$this.parents('[data-property]').data('property')] = '' + $this.data('value');
                    });

                    $.each(json.variants, function() {
                        var variant_values = {},
                            current_variant = true;

                        $.each(this.options, function(i) {
                            variant_values[Shopify.handleize(json.options[i])] = Shopify.handleize(this);
                        });

                        $.each(current_values, function(i) {
                            if(current_values[i] !== variant_values[i]) {
                                current_variant = false;
                                return false;
                            }
                        });

                        if(current_variant && current_values.length === variant_values.length) {
                            update_variant = this;
                            return false;
                        }
                    });

                    if(!update_variant) {
                        update_variant = _._getDefaultVariant(json);
                        is_avilable = false;
                    }
                    _._switchVariant($product, {
                        update_variant: update_variant,
                        json: json,
                        current_values: current_values,
                        is_avilable: is_avilable
                    });
                });
            };
            $body.on('click', this.selectors.options + ' [data-js-option-value]', onProcess);
            $body.on('mouseenter', this.selectors.options + '[data-js-options-onhover] [data-js-option-value]', $.debounce(400, onProcess));
            $body.on('change', '[data-js-option-select]', function (e, onupdate) {
                if(onupdate) {
                    return;
                }
                var $this = $(this).find('option:selected');
                onProcess.call($this, e);
            });
            $body.on('change', '[data-js-product-variants="control"]', function () {
                var $this = $(this),
                    $product = $this.parents('[data-js-product]'),
                    id = $this.find('option:selected').attr('value'),
                    json = $product.attr('data-json-product'),
                    update_variant = null,
                    is_avilable = true;

                _._loadJSON($product, json, function (json) {
                    $.each(json.variants, function() {
                        if(+this.id === +id) {
                            update_variant = this;
                            return false;
                        }
                    });

                    if(!update_variant) {
                        update_variant = _._getDefaultVariant(json);
                        is_avilable = false;
                    }
                    
                    _._switchVariant($product, {
                        update_variant: update_variant,
                        json: json,
                        is_avilable: is_avilable,
                        dontUpdateVariantsSelect: true
                    });
                });
            });

        },
        _loadJSON: function ($product, json, callback, animate) {
            if($product[0].hasAttribute('data-js-process-ajax-loading-json')) {
                $product.one('json-loaded', function () {
                    if(callback) {
                        callback(JSON.parse($product.attr('data-json-product')));
                    }
                });

                return;
            }

            animate = animate === undefined ? true : animate;

            if(json) {
                if(callback) {
                    callback(typeof json == 'object' ? json : JSON.parse(json));
                }
            } else {
                $product.attr('data-js-process-ajax-loading-json', true);
                var handle = $product.attr('data-product-handle');

                var xhr = $.ajax({
                    type: 'GET',
                    url: '/products/' + handle,
                    data: {
                        view: 'get_json'
                    },
                    cache: false,
                    dataType: 'html',
                    success: function (data) {
                        json = JSON.parse(data);
                        $product.attr('data-json-product', JSON.stringify(json));
                        if(callback) {
                            callback(json);
                        }
                        $product.trigger('json-loaded');
                    },
                    complete: function () {
                        $product.removeAttr('data-js-process-ajax-loading-json');
                    }
                });

                return xhr;
            }
        },
        switchByImage: function($product, get_image, id, callback) {
            var _ = this,
                $image = $product.find('[data-js-product-image] img'),
                json = $product.attr('data-json-product'),
                data = false;
            this._loadJSON($product, json, function (json) {
                var json_images = json.images,
                    current_image_id = (get_image === 'by_id') ? +id : +$image.attr('data-image-id'),
                    image_index,
                    update_variant,
                    is_avilable = true;

                $.each(json_images, function(i) {
                    if(+this.id === current_image_id) {
                        image_index = i;
                        return false;
                    }
                });

                if(image_index || image_index === 0) {
                    if(get_image === 'prev' && image_index !== 0) {
                        image_index--;
                    } else if(get_image === 'next' && image_index !== json_images.length - 1) {
                        image_index++;
                    }

                    $.each(json.variants, function() {
                        if(this.featured_image && +this.featured_image.id === +json_images[image_index].id) {
                            update_variant = this;
                            return false;
                        }
                    });
                    if(!update_variant) {
                        update_variant = _._getDefaultVariant(json);
                        update_variant.featured_image = json_images[image_index];
                        is_avilable = false;
                    }
                    _._updateOptions($product, {
                        update_variant: update_variant,
                        json: json
                    });
                    
                    _._switchVariant($product, {
                        update_variant: update_variant,
                        json: json,
                        is_avilable: is_avilable
                    });

                    data = {
                        index: image_index,
                        image: json_images[image_index],
                        is_first: image_index === 0,
                        is_last: image_index === json_images.length - 1
                    };
                }

                callback(data);
            });
        },
        _switchVariant: function($product, data) {
            data.update_variant.metafields = $.extend({}, data.json.metafields);
            $product.attr('data-product-variant-id', data.update_variant.id);
            this._updateContent($product, data);
        },
        _getDefaultVariant: function(json) {
            var default_variant = {};

            $.each(json.variants, function() {
                if(+this.id === +json.default_variant_id) {
                    Object.assign(default_variant, this);
                    return false;
                }
            });
            return default_variant;
        },
        _updateContent: function($product, data) {
            var clone_id = $product.attr('data-js-product-clone-id'),
                $clone_product = $('[data-js-product-clone="' + clone_id + '"]');
            this._updateFormVariantInput($product, data);
            this._updatePrice($product, $clone_product, data);
            this._updateAddToCart($product, $clone_product, data);
            this._updateGallery($product, data);
            this._updateLinks($product, data);
            this._updateHistory($product, data);
            theme.StoreLists.checkProductStatus($product);
            theme.ProductImagesNavigation.switch($product, data);
            if(!data.dontUpdateVariantsSelect) {
                this._updateVariantsSelect($product, data);
            }
            if($clone_product.length) {
                this._updateOptions($clone_product, data, true);
                theme.ProductImagesNavigation.switch($clone_product, data);
            }
        },
        _updateOptions: function($product, data, set_current) {
            var $options = $product.find(this.selectors.options_attr);
            if($options.length) {
                $options.find('[data-js-option-value]').removeClass('active');

                if(set_current) {
                    $.each(data.current_values, function(i, k) {
                        $options.find('[data-property="' + i + '"] [data-js-option-value][data-value="' + k + '"]').addClass('active');
                        $options.find('[data-js-option-select][data-property="' + i + '"]').val(k).trigger('change', [ true ]);
                    });
                } else {
                    $.each(data.json.options, function(i) {
                        $options.find('[data-property="' + Shopify.handleize(this) + '"] [data-js-option-value][data-value="' + Shopify.handleize(data.update_variant.options[i]) + '"]').addClass('active');
                        $options.find('[data-js-option-select][data-property="' + Shopify.handleize(this) + '"]').val(data.update_variant.options[i]).trigger('change', [ true ]);
                    });
                }
            }
        },
        _updateFormVariantInput: function ($product, data) {
            var $input = $product.find('[data-js-product-variant-input]');

            $input.attr('value', data.update_variant.id);
        },
        _updateVariantsSelect: function($product, data) {
            var $select = $product.find('[data-js-product-variants]');

            if($select.length) {
                $select.val(data.update_variant.id).change();
            }
        },
        _updateAddToCart: function($product, $clone_product, data) {
            var $button = $product.add($clone_product).find('[data-js-product-button-add-to-cart]');
            
            if($button.length) {
                data.is_avilable && data.update_variant.available ? $button.removeAttr('disabled data-button-status') : $button.attr('disabled', 'disabled').attr('data-button-status', 'sold-out');
            }
        },
        _updatePrice: function($product, $clone_product, data) {
            var $price = $product.add($clone_product).find('[data-js-product-price]'),
                $details = $product.find('[data-js-product-price-sale-details]');

            if($price.length) {
                theme.ProductCurrency.setPrice($price, data.update_variant.price, data.update_variant.compare_at_price);
            }
            if($details.length) {
                var details;

                $.each(data.json.variants_price_sale_details, function () {
                    if(+this.id === +data.update_variant.id) {
                        details = this.details;
                    }
                });

                $details.html(details ? details : '')[details ? 'removeClass' : 'addClass']('d-none-important');
            }
            if($price.length || $details.length) {
                theme.ProductCurrency.update();
            }
        },
      
        _updateGallery: function ($product, data) {
            var $gallery = $product.find('[data-js-product-gallery]');

            if($gallery.find('.fotorama').length) {
                var image = data.update_variant.featured_image;

                if(!image || !image.src) {
                    if(data.json.images[0]) {
                        image = data.json.images[0];
                    }
                }

                $gallery.productGallery('switchImageById', image.id);
            }
        },
        _updateLinks: function ($product, data) {
            var url = decodeURIComponent(window.location.origin) + '/products/' + data.json.handle + '?variant=' + data.update_variant.id;

            $product.find('a[href*="products/' + data.json.handle + '"]').attr('href', url);
        },
        _updateHistory: function ($product, data) {
            var $options = $product.find(this.selectors.options);

            if($options.length && $options[0].hasAttribute('data-js-change-history')) {
                var url = decodeURIComponent(window.location.origin) + '/products/' + data.json.handle + '?variant=' + data.update_variant.id;

                history.replaceState({foo: 'product'}, url, url);
            }
        }
    });

    theme.ProductOptions = new ProductOptions;
};

theme.StoreLists = function() {
    
    function Engine(namespace, callback) {
        this.namespace = namespace;

        this.selectors = {
            button: '.js-store-lists-add-' + namespace,
            button_remove: '.js-store-lists-remove-' + namespace,
            button_clear: '.js-store-lists-clear-' + namespace,
            has_items: '[data-js-store-lists-has-items-' + namespace + ']',
            dhas_items: '[data-js-store-lists-dhas-items-' + namespace + ']'
        };

      
        this.load(callback);
    };

    Engine.prototype = $.extend({}, Engine.prototype, {
       
        checkProductStatus: function($products) {
            $products = $products || $('[data-js-product]');

            var _ = this,
                storage = localStorage.getItem(this.current_storage),
                items = storage ? JSON.parse(storage) : [],
                $active_products = $();

            $.each(items, function () {
                $.each(this, function (k, v) {
                    var $selected_product = $products.filter('[data-product-handle="' + v + '"][data-product-variant-id="' + k + '"]');

                    if ($selected_product.length) {
                        $active_products = $active_products.add($selected_product);
                    }
                });
            });

            $products.not($active_products).find(_.selectors.button).removeAttr('data-button-status');
            $active_products.find(_.selectors.button).attr('data-button-status', 'added');
        }
    });



    function StoreLists() {
        this.load();
    };

    StoreLists.prototype = $.extend({}, StoreLists.prototype, {
        lists: {},
        load: function () {
        },
        checkProductStatus: function () {
            $.each(this.lists, function () {
                this.checkProductStatus();
            });
        }
    });

    theme.StoreLists = new StoreLists;
};
var Section = {};
Section.prototype = $.extend({}, Section.prototype, {
 
});
theme.Footbar = (function() {
    function Footbar(container) {
        this.$container = $(container);

        //var sectionId = this.$container.attr('data-section-id');

        //this.settings = {};

        this.namespace = '.footbar';

        this.onLoad();
    };

    Footbar.prototype = $.extend({}, Section.prototype, Footbar.prototype, {
        onLoad: function() {
            theme.Notifications.init(this.$container);
            //theme.ProductFootbar.init(this.$container);
        },
        onUnload: function() {
            this.$container.off(this.namespace);
            
            theme.Notifications.destroy(this.$container);
           // theme.ProductFootbar.destroy();
        }
    });

    return Footbar;
})();

$(function() {
  theme.Global();
  theme.ProductCurrency();
  theme.Notifications();
  theme.ProductImagesNavigation();
  theme.ProductOptions();
  theme.StoreLists();
   var sections = new slate.Sections();
  sections.register('footbar', theme.Footbar);
});