(function($) {
  if ($("#filter-sidebar")) {
    History.Adapter.bind(window, "statechange", function() {
      var e = History.getState();
      if (!mt._sidebarAjaxClick) {
        mt._sidebarparams();
        var n = mt._sidebarcreateUrl();
        mt._sidebargetContent(n);
        mt._reactivesidebar();
      }
      mt._sidebarAjaxClick = false
    })
  }
  if (window.use_color_swatch) {
    $(".swatch :radio").change(function() {
      var t = $(this).closest(".swatch").attr("data-option-index");
      var n = $(this).val();
      $(this).closest("form").find(".single-option-selector").eq(t).val(n).trigger("change")
    });
    Shopify.optionsMap = {};
    Shopify.updateOptionsInSelector = function(t) {
      switch (t) {
        case 0:
          var n = "root";
          var r = $(".single-option-selector:eq(0)");
          break;
        case 1:
          var n = $(".single-option-selector:eq(0)").val();
          var r = $(".single-option-selector:eq(1)");
          break;
        case 2:
          var n = $(".single-option-selector:eq(0)").val();
          n += " / " + $(".single-option-selector:eq(1)").val();
          var r = $(".single-option-selector:eq(2)")
          }
      var i = r.val();
      r.empty();
      var s = Shopify.optionsMap[n];
      for (var o = 0; o < s.length; o++) {
        var u = s[o];
        var a = $("<option></option>").val(u).html(u);
        r.append(a)
      }
      $('.swatch[data-option-index="' + t + '"] .swatch-element').each(function() {
        if ($.inArray($(this).attr("data-value"), s) !== -1) {
          $(this).removeClass("soldout").show().find(":radio").removeAttr("disabled", "disabled").removeAttr("checked")
        } else {
          $(this).addClass("soldout").hide().find(":radio").removeAttr("checked").attr("disabled", "disabled")
        }
      });
      if ($.inArray(i, s) !== -1) {
        r.val(i)
      }
      r.trigger("change")
    };
    Shopify.linkOptionSelectors = function(mt) {
      for (var n = 0; n < mt.variants.length; n++) {
        var r = mt.variants[n];
        if (r.available) {
          Shopify.optionsMap["root"] = Shopify.optionsMap["root"] || [];
          Shopify.optionsMap["root"].push(r.option1);
          Shopify.optionsMap["root"] = Shopify.uniq(Shopify.optionsMap["root"]);
          if (mt.options.length > 1) {
            var i = r.option1;
            Shopify.optionsMap[i] = Shopify.optionsMap[i] || [];
            Shopify.optionsMap[i].push(r.option2);
            Shopify.optionsMap[i] = Shopify.uniq(Shopify.optionsMap[i])
          }
          if (mt.options.length === 3) {
            var i = r.option1 + " / " + r.option2;
            Shopify.optionsMap[i] = Shopify.optionsMap[i] || [];
            Shopify.optionsMap[i].push(r.option3);
            Shopify.optionsMap[i] = Shopify.uniq(Shopify.optionsMap[i])
          }
        }
      }
      Shopify.updateOptionsInSelector(0);
      if (mt.options.length > 1) Shopify.updateOptionsInSelector(1);
      if (mt.options.length === 3) Shopify.updateOptionsInSelector(2);
      $(".single-option-selector:eq(0)").change(function() {
        Shopify.updateOptionsInSelector(1);
        if (mt.options.length === 3) Shopify.updateOptionsInSelector(2);
        return true
      });
      $(".single-option-selector:eq(1)").change(function() {
        if (mt.options.length === 3) Shopify.updateOptionsInSelector(2);
        return true
      })
    }
  }
  $(document).ready(function() {
    mt.go()
  });
  $(window).resize(function() {
    mt._resizeImage()
  });
  var mt = {
    atTimeout: null,
    _sidebarAjaxClick: false,
    go: function() {
      this._resizeImage();
      this._quickview();
      this._sidebar();
      this._zoomimage();
      this._scrollTop();
      this._headerdropcart();
      this.translateBlock(".main-content");
      this._addtocart();

      this._quickshop();
      this._mesagebox();
      this._productaddtocart();
      this._wishlist();
      this._productwishlist();
      this._removewishlist();
      this._colorswatchgridInit();
      this._infinitescrolling();
      this._autoinfinitescrolling();
      this.free_shipping();
      this._ajaxnewsleter();
    },
    _ajaxnewsleter: function() {
      function t(t, e, o) {
       $.ajax({
          type: "GET",
          url: t.attr("action"),
          data: t.serialize(),
          cache: !1,
          dataType: "jsonp",
          jsonp: "c",
          contentType: "application/json; charset=utf-8",
          error: function(t) {
            var a = t.replace("0 - ", "").replace("1 - ", "").replace("2 - ", "");
            e.html('<div class="message-error">' + a + "</div>").show(100)
          },
          success: function(t) {
            var a = t.msg.replace("0 - ", "").replace("1 - ", "").replace("2 - ", "");
        
            "success" != t.result ? e.html('<div class="message-warning">' + a + "</div>").show(100) : e.html('<div class="message-susscer">' + a + "</div>").show(100)
          }
        })
      }
      $('form.clv-ajax-from [type="submit"]').bind("click", function(e) {
        var o = $(this).closest("form.clv-ajax-from"),
            a = o.find(".message-newsneter"),
            s = $(this);
        e && e.preventDefault(), a.hide(100), t(o, a, s)
      })
    },
    _autoinfinitescrolling: function() {

      var itemsWrapper = '.collection-grid';
      var count = $('.collection-product-item').length;
     
      var count_item = $('.infinite-scrolling').attr('data-count');
    
      if(count_item > count){


        //Scrolling loading example
        var scrollingLoadingOptions = {
          selectors              : {
            itemsWrapper     : itemsWrapper,
            item             : '.collection-product-item',
            nextPageLink     : '#paginatie-next',
            previousPageLink : '#paginatie-previous',
            paginationWrapper: '.component-pagination'
            //scrollableElem: itemsWrapper, YOU CAN SPECIFY THIS
          },

          waitForImagesToBeLoaded: false,
          //throttleDelay: 100, YOU CAN SPECIFY THIS
          callBacks              : {
            onAllPagesLoaded: function () {
              $('.component-pagination').css("display", "none");
              $('.loading-more').text("All products loaded.").addClass('active');
              $('.loading-more').show();
            },
            beforePageLoad  : function () {
              $('.loading-more').show();
              //console.log("Before page load callback called..");
            },
            onPageLoad      : function (items) {
              $('.loading-more').hide();
              if (window.product_image_resize) {
                $(".products-grid .product-image img").fakecrop({
                  fill: window.images_size.is_crop,
                  widthSelector: ".products-grid .grid-item .product-image",
                  ratioWrapper: window.images_size
                })
              }
              //console.log("Page loaded callback called..");
            }
          }
        };
        $(itemsWrapper).t3PageLoad(scrollingLoadingOptions);
      }
    },

    _infinitescrolling: function() {
      if ($(".infinite-scrolling").length > 0) {
        $(".loading-product").hide();
        $(".infinite-scrolling a").click(function(n) {
          n.preventDefault();
          if (!$(this).hasClass("disabled")) {
            mt.doInfiniteScrolling()
          }
        })
      }
    },
    doInfiniteScrolling: function() {
      var n = $(".main_container .products-grid");

      if (!n.length) {
        n = $(".main_container .product-list")
      }
      if (n) {
        var r = $(".infinite-scrolling a").first();
        $.ajax({
          type: "GET",
          url: r.attr("href"),
          beforeSend: function() {

            $(".loading-product").show();
          },
          success: function(i) {
            mt.hideLoading();
            $(".loading-product").hide();
            var s = $(i).find(".main_container .products-grid");
            if (!s.length) {
              s = $(i).find(".main_container .product-list-item")
            }
            if (s.length) {
              if (s.hasClass("products-grid")) {
                if (window.product_image_resize) {
                  s.children().find("img").fakecrop({
                    fill: window.images_size.is_crop,
                    widthSelector: ".products-grid .grid-item .product-image",
                    ratioWrapper: window.images_size
                  })
                }
              }
              n.append(s.children());
              mt._quickview();
              mt._addtocart();
              mt._wishlist();
              if ($(i).find(".infinite-scrolling").length > 0) {
                r.attr("href", $(i).find(".infinite-scrolling a").attr("href"))
              } else {
                r.hide();
                r.next().show()
              }
              if ($(".spr-badge").length > 0) {
                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges()
              }
            }
          },
          error: function(n, r) {
            mt.hideLoading();
            $(".loading-product").hide();
            $(".ajax-error-message").text($.parseJSON(n.responseText).description);
            mt.showModal(".ajax-error-modal")
          },
          dataType: "html"
        })
      }
    },
    _colorswatchgridInit: function(){
      $('.color-swatch-item li a').on('click', function(e){
        e.preventDefault();  
        var productImage = $(this).parents('.product-inner').find('.grid-image'); 
        productImage.find('img.feature-images').attr('src', $(this).data('image'));  
      });
    },
    _ajaxsidebar: function() {
      $(".sidebar-tag a, .sidebar-tag label").click(function(n) {
        var r = [];
        if (Shopify.queryParams.constraint) {
          r = Shopify.queryParams.constraint.split("+")
        }
        if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(":checked")) {
          var i = $(this).parents(".sidebar-tag").find("input:checked");
          if (i.length > 0) {
            var s = i.val();
            if (s) {
              var o = r.indexOf(s);
              if (o >= 0) {
                r.splice(o, 1)
              }
            }
          }
        }
        var s = $(this).prev().val();
        if (s) {
          var o = r.indexOf(s);
          if (o >= 0) {
            r.splice(o, 1)
          } else {
            r.push(s)
          }
        }
        if (r.length) {
          Shopify.queryParams.constraint = r.join("+")
        } else {
          delete Shopify.queryParams.constraint
        }
        mt.sidebarAjaxClick();
        n.preventDefault()
      })
    },


    _evensidebar: function() {
      mt._ajaxsidebar();

    },

    _checkitemdropcart: function() {
      if ($("#dropdown-cart .cart-list").children().length > 0) {
        $("#dropdown-cart .cart-empty").hide();
        $("#dropdown-cart .mini_cart_header").addClass("active");
      } else {
        $("#dropdown-cart .mini_cart_header").removeClass("active");
        $("#dropdown-cart .cart-empty").show()
      }
    },

    _headerdropcart: function() {
      mt._checkitemdropcart();
      $("#dropdown-cart .cart-empty a").click(function() {
        $("#dropdown-cart").slideUp("fast")
      });
      $("#dropdown-cart .btn-remove").click(function(n) {
        n.preventDefault();
        var cart = $(this).parents(".item").attr("id");
        cart = cart.match(/\d+/g);
        Shopify.removeItem(cart, function(e) {
          mt._headercartitem(e);
          $(this).addClass('remove-cart');
        })
      })
    },
    closeDropdownCart: function() {
      if ($("#dropdown-cart").is(":visible")) {
        $("#dropdown-cart").slideUp("fast")
      }
    },

    _accordionsibar: function() {
      if ($(".sidebar-tag").length > 0) {
        $(".sidebar-tag .widget-title span").click(function() {
          var cart = $(this).parents(".widget-title");
          if (mt.hasClass("click")) {
            mt.removeClass("click")
          } else {
            mt.addClass("click")
          }
          $(this).parents(".sidebar-tag").find(".widget-content").slideToggle()
        })
      }
    },
    _clearsidebarall: function() {
      $('.addlabel a').each(function() {


        var filterTag = $(this);

        filterTag.on('click', function(e) {
          e.preventDefault();
          var tag = $(this).data('filterTag');
          var params = Shopify.queryParams.constraint.split('+');
          params.splice(params.indexOf(tag), 1);
          Shopify.queryParams.constraint = params.join('+');
          mt.sidebarAjaxClick();

        });
      })
      $("a.clear-all").click(function() {
        $(this).removeClass('active');
        $('body').find(".addlabel").removeClass('active');
        $('body').find(".filter-top-wr").removeClass('active-filter-top');
      });
      $("#filter-sidebar a.clear-all").click(function($) {

        delete Shopify.queryParams.constraint;
        delete Shopify.queryParams.q;
        mt.sidebarAjaxClick();
        $.preventDefault();
      })
    },
    _clearsidebar: function() {
      $(".sidebar-tag").each(function() {
        var n = $(this);
        if (n.find("input:checked").length > 0) {
          $('.wrapper-container').removeClass('show-fillter');
          $('body').find(".clear-all").addClass('active');

          $('body').find(".addlabel").addClass('active');
          $('body').find(".filter-top-wr").addClass('active-filter-top');
          n.find(".clear-all").show().click(function(cart) {
            var i = [];
            if (Shopify.queryParams.constraint) {
              i = Shopify.queryParams.constraint.split("+")
            }
            n.find("input:checked").each(function() {

              var cart = $(this);
              var n = mt.val();
              if (n) {
                var cart = i.indexOf(n);
                if (r >= 0) {
                  i.splice(cart, 1)
                }
              }
            });
            if (i.length) {
              Shopify.queryParams.constraint = i.join("+")
            } else {
              delete Shopify.queryParams.constraint
            }
            mt.sidebarAjaxClick();
            cart.preventDefault()
          })
        }
      })
    },
    _evensidebar: function() {
      mt._ajaxsidebar();
      mt._collectionlinkajax();
      mt._colorswatchgridInit();
    },
    _reactivesidebar: function() {
      $(".sidebar-custom .active, .sidebar-links .active").removeClass("active");
      $(".sidebar-tag input:checked").attr("checked", false);

      var n = location.pathname.match(/\/collections\/(.*)(\?)?/);
      if (n && n[1]) {
        $(".sidebar-links a[href='" + n[0] + "']").addClass("active");
        $(".sidebar-tag").addClass('1111');
      }
      if (Shopify.queryParams.view) {
        $(".view-mode .active").removeClass("active");
        var cart = Shopify.queryParams.view;
        if (cart.indexOf("list") >= 0) {
          cart(".view-mode .list").addClass("active");
          cart = cart.replace("list", "")
        } else {
          $(".view-mode .grid").addClass("active")
        }
        $(".filter-show > button span").text(cart);
        $(".filter-show li.active").removeClass("active");
        $(".filter-show a[href='" + cart + "']").parent().addClass("active")
      }
    },
    _collectionlinkajax: function() {
      $(".sidebar-links a").click(function(n) {
        if (!$(this).hasClass("active")) {
          delete Shopify.queryParams.q;
          mt.sidebarAjaxClick($(this).attr("href"));
          $(".sidebar-links a.active").removeClass("active");
          $(this).addClass("active")
        }
        n.preventDefault()
      })
    },
    sidebarMapData: function(n) {
      var rs = $(".col-main .products-grids");
      if (rs.length == 0) {
        rs = $(".col-main .product-list")
      }
      var is = $(n).find(".col-main .products-grids");
      if (is.length == 0) {
        is = $(n).find(".col-main .product-list")
      }
      var cart = $(".col-main .products-grid");
      if (cart.length == 0) {
        cart = $(".col-main .product-list")
      }
      var i = $(n).find(".col-main .products-grid");
      if (i.length == 0) {
        i = $(n).find(".col-main .product-list")
      }
      if (i.length > 0 && i.hasClass("products-grid")) {
        if (window.product_image_resize) {
          i.find("img").fakecrop({
            fill: window.images_size.is_crop,
            widthSelector: ".products-grid .grid-item .product-image",
            ratioWrapper: window.images_size
          })
        }
      }
      cart.replaceWith(i);
      rs.replaceWith(is);
      if ($(".padding").length > 0) {
        $(".padding").replaceWith($(n).find(".padding"))
      } else {
        $(".main-content .col-main").append($(n).find(".padding"))
      }
      var s = $(".page-header");
      var o = $(n).find(".page-header");
      if (s.find("h2").text() != o.find("h2").text()) {
        s.find("h2").replaceWith(o.find("h2"));
        if (s.find(".rte").length) {
          if (o.find(".rte").length) {
            s.find(".rte").replaceWith(o.find(".rte"))
          } else {
            s.find(".rte").hide()
          }
        } else {
          if (o.find(".rte").length) {
            s.find("h2").after(o.find(".rte"))
          }
        }
      }
      $(".addlabel").replaceWith($(n).find(".addlabel"));
      $(".sidebar-block").replaceWith($(n).find(".sidebar-block"))
    },
    _sidebarcreateUrl: function(mt) {
      var n = $.param(Shopify.queryParams).replace(/%2B/g, "+");
      if (mt) {
        if (n != "") return mt + "?" + n;
        else return mt
          }
      return location.pathname + "?" + n
    },
    sidebarAjaxClick: function(e) {
      delete Shopify.queryParams.page;
      var n = mt._sidebarcreateUrl(e);
      mt._sidebarAjaxClick = true;
      History.pushState({
        param: Shopify.queryParams
      }, n, n);
      mt._sidebargetContent(n)
    },

    _sidebargetContent: function(n) {
      $.ajax({
        type: "get",
        url: n,
        beforeSend: function() {
          mt.showLoading();
          $('.loadding-collection').show();
        },
        success: function(e) {
          $('.loadding-collection').hide();
          mt.sidebarMapData(e);
          mt._ajaxsidebar();
          mt._accordionsibar();
          mt._clearsidebar();
          mt._clearsidebarall();
          mt.hideLoading();
          mt._addtocart();
          mt._wishlist();
          mt._colorswatchgridInit();
          mt._quickview();
          mt._quickshop();
          mt._infinitescrolling();
        },
        error: function(n, cart) {
          mt.hideLoading();
          $(".loading-modal").hide();
          $('.loadding-collection').hide();
          $(".ajax-error-message").text($.parseJSON(n.responseText).description);
          mt.showModal(".ajax-error-modal")
        }
      })
    },
    _sidebarparams: function() {
      Shopify.queryParams = {};
      if (location.search.length) {
        for (var e, mt = 0, n = location.search.substr(1).split("&"); mt < n.length; mt++) {
          e = n[mt].split("=");
          if ($.length > 1) {
            Shopify.queryParams[decodeURIComponent(e[0])] = decodeURIComponent(e[1])
          }
        }
      }
    },

    _sidebar: function() {
      if ($("#filter-sidebar").length > 0) {
        mt._sidebarparams();
        mt._evensidebar();
        mt._accordionsibar();
        mt._clearsidebar();
        mt._clearsidebarall();
        mt._colorswatchgridInit();
        mt._quickview();
      }
    },

    _wishlist: function() {
      $(".grid-item button.wishlist").click(function(n) {

      })
    },
    _productwishlist: function() {
      $(".product button.wishlist").click(function(n) {

      })
    },

    _removewishlist: function() {
      $(".btn-remove-wishlist").each(function(){
        $(this).click(function(n) {
          n.preventDefault();
          var r = $(this).parents("tr");
          var i = r.find(".tag-id").val();
          var s = jQuery("#remove-wishlist-form-"+i);
          s.find("input[name='contact[tags]']").val("x" + i);
          r.fadeOut(300);
          setTimeout(s.submit(),3e3);
        })
      })
    },
    _resizeImage: function() {
      if (window.product_image_resize) {
        $(".products-grid .product-image img").fakecrop({
          fill: window.images_size.is_crop,
          widthSelector: ".products-grid .grid-item .product-image",
          ratioWrapper: window.images_size
        })
      }
    },

    showBox: function(n) {
      $(n).fadeIn(500);
      mt.atTimeout = setTimeout(function() {
        $(n).fadeOut(300)
      }, 5e3)
    },
    _mesagebox: function() {
      $(".continue-shopping").click(function() {
        clearTimeout(mt.atTimeout);
        $(".ajax-success-cbox").fadeOut(500)
      });
      $(".close-cbox").click(function() {
        clearTimeout(mt.atTimeout);
        $(".ajax-success-cbox").fadeOut(500)
      })
    },

    _zoomimage: function() {
      if ($("#product-featured-image").length > 0) {

        $("#product-featured-image").elevateZoom({
          gallery: "zt_list_product",
          zoomType	: "inner",
          onImageSwapComplete: function() {
            $(".gallery-images div").hide()
          },
          loadingIcon: window.loading_url
        });
        $("#product-featured-image").bind("click", function(mt) {
          var n = $("#product-featured-image").data("elevateZoom");
          $.fancybox(n.getGalleryList());
          return false
        })


      }
    },
    _scrollTop: function() {
      $("#back-top").click(function() {
        $("body,html").animate({
          scrollTop: 0
        }, 400);
        return false
      })
    },
    _productaddtocart: function() {
      if ($("#product-add-to-cart").length > 0) {
        $("#product-add-to-cart").click(function(n) {
          n.preventDefault();
          if ($(this).attr("disabled") != "disabled") {
            if (!window.ajax_cart) {
              $(this).closest("form").submit()
            } else {
              var cart = $("#add-to-cart-form select[name=id]").val();
              if (!cart) {
                cart = $("#add-to-cart-form input[name=id]").val()
              }
              var i = $("#add-to-cart-form input[name=quantity]").val();
              if (!i) {
                i = 1
              }

              var o = $("#product-featured-image").attr("src");
              mt._ajaxaddtocart(cart, i, o)
            }
          }
          return false
        })
      }
    },
    _addtocart: function() {
      if ($(".add-to-cart-btn").length > 0) {
        $(".add-to-cart-btn").click(function(n) {
          n.preventDefault();
          if ($(this).attr("disabled") != "disabled") {
            var cart = $(this).parents(".product-item");
            var i = $(cart).attr("id");
            i = i.match(/\d+/g);
            if (!window.ajax_cart) {
              $("#product-actions-" + i).submit()
            } else {
              var s = $("#product-actions-" + i + " select[name=id]").val();
              if (!s) {
                s = $("#product-actions-" + i + " input[name=id]").val()
              }
              var o = $("#product-actions-" + i + " input[name=quantity]").val();
              if (!o) {
                o = 1
              }
              var u = $(cart).find(".product-title").text();
              mt._ajaxaddtocart(s, o, u)
            }

          }
          return false
        })
      }
    },
    showLoading: function() {
      $(".loading").show()
    },
    hideLoading: function() {
      $(".loading").hide()
    },
    _ajaxaddtocart: function(n, r, title, s) {
      $.ajax({
        type: "post",
        url: "/cart/add.js",
        data: "quantity=" + r + "&id=" + n,
        dataType: "json",
        beforeSend: function() {
          mt.showLoading();
          jQuery('.mini_cart_header').addClass('loading');
          jQuery('#dropdown-cart').addClass('active');
          jQuery('.wrapper-container').addClass('show-cart');
        },
        success: function(n) {
          mt.hideLoading();

          $('.ajax-success-cbox').find('.product-title').html(mt.translateText(n.title));


          $(".ajax-success-cbox").find(".show-wishlist").hide();
          $(".ajax-success-cbox").find(".show-cart").show();
          mt.showBox(".ajax-success-cbox");

          $(".ajax-success-cbox").find(".show-wishlist").hide();
          jQuery('#dropdown-cart').addClass('active');
          jQuery('.wrapper-container').addClass('show-cart');

          mt._updateheadercart();
          mt.free_shipping();
          jQuery('.mini_cart_header').removeClass('loading');


        },
        error: function(n, r) {
          mt.hideLoading();
          jQuery('#dropdown-cart').removeClass('active');
          jQuery('.wrapper-container').removeClass('show-cart');
          $(".ajax-error-message").text($.parseJSON(n.responseText).description);
          mt.showBox(".ajax-error-cbox");
        }
      })
    },
    _loadslideimagequickview: function(n, cart) {
      var s = Shopify.resizeImage(n.featured_image, "grande");
      cart.find(".quickview-featured-image").append('<a href="' + n.url + '"><img src="' + s + '" title="' + n.title + '"/><div style="height: 100%; width: 100%; top:0; left:0 z-index: 2000; position: absolute; display: none; background: url(' + window.loading_url + ') 50% 50% no-repeat;"></div></a>');
      if (n.images.length > 0) {
        var o = cart.find(".more-view ul");
        for (i in n.images) {
          var u = Shopify.resizeImage(n.images[i], "grande");
          var a = Shopify.resizeImage(n.images[i], "compact");
          var f = '<li><a href="javascript:void(0)" data-image="' + u + '"><img src="' + a + '"  /></a></li>';
          o.append(f)
        }
        o.find("a").click(function() {
          var mt = cart.find(".quickview-featured-image img");
          var n = cart.find(".quickview-featured-image div");
          if (mt.attr("src") != jQuery(this).attr("data-image")) {
            mt.attr("src", jQuery(this).attr("data-image"));
            n.show();
            mt.load(function(t) {
              n.hide();
              jQuery(this).unbind("load");
              n.hide()
            })
          }
        });
        if (o.hasClass("quickview-more-views-owlslider")) {
          mt._quickviewthumbslide(o)
        } else {

        }
      } else {
        cart.find(".quickview-more-views").remove();
        cart.find(".quickview-more-view-wrapper-jcarousel").remove()
      }
    },
    _quickview: function() {
      jQuery(".quickview-button a").click(function() {
        console.log('lol1');
        var n = jQuery(this).attr("id");

        Shopify.getProduct(n, function(n) {
          var cart = jQuery("#quickview-popup").html();
          //console.log(cart);
          jQuery(".product-quickview").addClass('active');
          jQuery(".product-quickview").html(cart);
          var pre = n.description.indexOf('pre-order-label');

          if(pre > 0){
            jQuery('.actions').addClass('pre');
            jQuery('.actions .add-to-cart-btn').append( "<span>Pre-Order</span>" );	

          }
          var i = jQuery(".product-quickview");
          i.find(".product-title a").html(mt.translateText(n.title));
          i.find(".product-title a").attr("href", n.url);
          var getUrl = window.location.origin;

          i.find(".product_socials_wrapper_inner a.twitter").attr('href','//twitter.com/share?url=' + getUrl + n.url +'&text='+ n.title );
          i.find(".product_socials_wrapper_inner a.facebook").attr('href','https://www.facebook.com/sharer/sharer.php?u='+ getUrl + n.url );
          i.find(".product_socials_wrapper_inner a.google-plus").attr('href','//plus.google.com/share?url='+ getUrl + n.url );
          i.find(".product_socials_wrapper_inner a.pinterest").attr('href','//pinterest.com/pin/create/button/?url='+ getUrl + n.url +'&description='+ n.title );



          if (i.find(".product-vendor span").length > 0) {
            i.find(".product-vendor span").text(n.vendor)
          }


          if (i.find(".product-type span").length > 0) {
            i.find(".product-type span").text(n.type)
          }
          if (i.find(".product-inventory span").length > 0) {
            var o = n.variants[0].inventory_quantity;
            if (o > 0) {
              if (n.variants[0].inventory_management != null) {
                i.find(".product-inventory span").text(o + " in stock")
              } else {
                i.find(".product-inventory span").text("Many in stock")
              }
            } else {
              i.find(".product-inventory span").text("Out of stock")
            }
          }
          if (i.find('.product-description').length > 0) {
            var s = n.description.replace(/(<([^>]+)>)/ig, "");
            var s = s.replace(/\[countdown\](.*)\[\/countdown\]/ig, "");
            var s = s.replace(/\[item-gallery]/ig, "");
            var s = s.replace(/\[label-icon-new]/ig, "");
            var s = s.replace(/\[pre-order-label]/ig, "");
            var s = s.replace(/\[video\](.*)\[\/video\]/ig, "");
            var s = s.replace(/\[short-description\](.*)\[\/short-description\]/ig, "");
            var s = s.replace(/\[custom_html\](.*)\[\/custom_html\]/ig, "");
            var s = s.replace(/\[tabs\](.*)/ig, "");
            var s = s.replace(/\[tab\](.*)\[\/tab\]/ig, "");
            var s = s.replace(/\[tabs\](.*)\[\/tabs\]/ig, "");


            if (window.multi_lang) {
              if (s.indexOf("[lang2]") > 0) {
                var descList = s.split("[lang2]");
                if (jQuery.cookie("language") != null) {
                  s = descList[translator.current_lang - 1];
                } else {
                  s = descList[0];
                }
              }
            }
            s = s.split(" ").splice(0, 20).join(" ") + "...";
            i.find('.product-description').text(s);
          } else {
            i.find('.product-description').remove();
          }

          i.find(".product-description").text(s);
          i.find(".price").html(Shopify.formatMoney(n.price, window.money_format));
          i.find(".product-item").attr("id", "product-" + n.id);
          i.find(".variants").attr("id", "product-actions-" + n.id);
          i.find(".variants select").attr("id", "product-select-" + n.id);
          if (n.compare_at_price > n.price) {
            i.find(".compare-price").html(Shopify.formatMoney(n.compare_at_price_max, window.money_format)).show();
            i.find(".price").addClass("on-sale")
          } else {
            i.find(".compare-price").html("");
            i.find(".price").removeClass("on-sale")
          }
          if (!n.available) {
            i.find("select, input, .total-price, .dec, .inc, .variants label").remove();
            i.find(".add-to-cart-btn").text(window.inventory_text.unavailable).addClass("disabled").attr("disabled", "disabled");
          } else {
            i.find(".total-price span").html(Shopify.formatMoney(n.price, window.money_format));
            if (window.use_color_swatch) {
              mt._createvariantquickviewwatch(n, i)
            } else {
              mt._createquickviewvariant(n, i)
            }
          }
          i.find(".button").on("click", function() {
            var n = i.find(".quantity").val(),
                cart = 1;
            if (jQuery(this).text() == "+") {
              cart = parseInt(n) + 1
            } else if (n > 1) {
              cart = parseInt(n) - 1
            }
            i.find(".quantity").val(cart);
            if (i.find(".total-price").length > 0) {
              mt._updatepricequickview()
            }
          });
          if (window.show_multiple_currencies) {
            if(typeof Currency != 'undefined')
              Currency.convertAll(window.shop_currency, jQuery('#currencies .currency.selected').data('currency'), 'span.money', 'money_format')
              }
          mt._loadslideimagequickview(n, i);
          mt._addtocartquickview();
          mt.translateBlock(".product-quickview");
          jQuery(".product-quickview").fadeIn(500);
          if (jQuery(".product-quickview .total-price").length > 0) {
            jQuery(".product-quickview input[name=quantity]").on("change", mt._updatepricequickview)
          }
        });
        return false
      });
      jQuery(".product-quickview .overlay, .close-popup, .overlay").live("click", function() {
        jQuery(".product-quickview").removeClass('active');
        mt._closequickview();
        $(".ajax-success-cbox").hide();
        return false
      })
    },

    _quickshop: function() {
      jQuery(".quickshop a").click(function() {
        console.log('lol');
        var n = jQuery(this).attr("id");

        Shopify.getProduct(n, function(n) {
          var cart = jQuery("#quickview-popup").html();
          jQuery(".quick-shop-content"+ n.id).html(cart);

          var i = jQuery(".quick-shop-content"+ n.id);

          i.find(".price").html(Shopify.formatMoney(n.price, window.money_format));
          i.find(".product-item").attr("id", "product-" + n.id);
          i.find(".variants").attr("id", "product-actions-" + n.id);
          i.find(".variants select").attr("id", "product-select-" + n.id);
          if (n.compare_at_price > n.price) {
            i.find(".compare-price").html(Shopify.formatMoney(n.compare_at_price_max, window.money_format)).show();
            i.find(".price").addClass("on-sale")
          } else {
            i.find(".compare-price").html("");
            i.find(".price").removeClass("on-sale")
          }
          if (!n.available) {
            i.find("select, input, .total-price, .dec, .inc, .variants label").remove();
            i.find(".add-to-cart-btn").text(window.inventory_text.unavailable).addClass("disabled").attr("disabled", "disabled");
          } else {
            i.find(".total-price span").html(Shopify.formatMoney(n.price, window.money_format));
            if (window.use_color_swatch) {
              mt._createvariantquickviewwatch(n, i)
            } else {
              mt._createquickviewvariant(n, i)
            }
          }

          if (window.show_multiple_currencies) {
            if(typeof Currency != 'undefined')
              Currency.convertAll(window.shop_currency, jQuery('#currencies .currency.selected').data('currency'), 'span.money', 'money_format')
              }

          mt._addtocartquickview();
          mt.translateBlock(".quick-shop-content");
          jQuery(".quick-shop-content").fadeIn(500);
          if (jQuery(".quick-shop-content .total-price").length > 0) {
            jQuery(".quick-shop-content input[name=quantity]").on("change", mt._updatepricequickview)
          }
        });
        return false
      });
    },

    _updatepricequickview: function() {
      var mt = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;
      var n = jQuery(".product-quickview .price").text().match(mt);
      if (!n) {
        mt = /([0-9]+[.|,][0-9]+)/g;
        n = jQuery(".product-quickview .price").text().match(mt)
      }
      if (n) {
        var cart = n[0];
        var i = cart.replace(/[.|,]/g, "");
        var s = parseInt(jQuery(".product-quickview input[name=quantity]").val());
        var o = i * s;
        var u = Shopify.formatMoney(o, window.money_format);
        u = u.match(mt)[0];
        var a = new RegExp(r, "g");
        var f = jQuery(".product-quickview .price").html().replace(a, u);
        jQuery(".product-quickview .total-price span").html(f)
      }
    },
    _addtocartquickview: function() {
      if (jQuery(".product-quickview .add-to-cart-btn").length > 0) {
        jQuery(".product-quickview .add-to-cart-btn").click(function() {
          var n = jQuery(".product-quickview select[name=id]").val();
          if (!n) {
            n = jQuery(".product-quickview input[name=id]").val()
          }
          var cart = jQuery(".product-quickview input[name=quantity]").val();
          if (!cart) {
            cart = 1
          }
          var i = jQuery(".product-quickview .product-title a").text();
          var s = jQuery(".product-quickview .quickview-featured-image img").attr("src");
          mt._ajaxaddtocart(n, cart, i, s);
          mt._closequickview()
        })
      }
    },
    _updateheadercart: function() {
      Shopify.getCart(function(e) {
        mt._headercartitem(e);
        mt.free_shipping();
      })
    },
    _headercartitem: function(n) {
      $(".cart-count").text(n.item_count);
    },


    convertToSlug: function(e) {
      return $.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    },

    _updateheadercart: function() {
      Shopify.getCart(function(e) {
        mt._headercartitem(e);
        mt.free_shipping();
      })
    },

    _headercartitem: function(n) {
      var cart = '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-inner"><a href="javascript:void(0)" title="Remove Item" class="btn-remove"><i class="cs-font clever-icon-close"></i></a><p class="product-name"><a href="{URL}">{TITLE}</a></p><div class="cart-collateral"><span class="price">{PRICE}</span>Qty:  {QUANTITY}</div></div></li>';
      $(".cart-count").text(n.item_count);
      $(".cartToggle .price-cart-mini").html(Shopify.formatMoney(n.total_price, window.money_format));
      $("#dropdown-cart .summary .price").html(Shopify.formatMoney(n.total_price, window.money_format));
      $("#dropdown-cart .cart-list").html("");
      if (n.item_count > 0) {
        for (var i = 0; i < n.items.length; i++) {
          var s = cart;
          s = s.replace(/\{ID\}/g, n.items[i].id);
          s = s.replace(/\{URL\}/g, n.items[i].url);
          s = s.replace(/\{TITLE\}/g, mt.translateText(n.items[i].title));
          s = s.replace(/\{TITLE\}/g, n.items[i].title);
          s = s.replace(/\{QUANTITY\}/g, n.items[i].quantity);
          s = s.replace(/\{IMAGE\}/g, Shopify.resizeImage(n.items[i].image, "small"));
          s = s.replace(/\{PRICE\}/g, Shopify.formatMoney(n.items[i].price, window.money_format));
          $("#dropdown-cart .cart-list").append(s)
			$(".cart-count").removeClass('empty-cart');

        }
        $("#dropdown-cart .btn-remove").click(function(n) {
          $( ".mini_cart_header .less-than-ten" ).empty();
          $(this).addClass('remove-cart');
          n.preventDefault();
          var cart = $(this).parents(".item").attr("id");
          cart = cart.match(/\d+/g);

          Shopify.removeItem(cart , function(e) {
            mt._headercartitem(e);

          })
          mt.free_shipping();
        });
        if (mt._checkcurrency()) {
          if(typeof Currency != 'undefined')
            Currency.convertAll(window.shop_currency, jQuery('#currencies .currency.selected').data('currency'), "#dropdown-cart span.money", "money_format")
            }

      }else{
      	$(".cart-count").addClass('empty-cart');
      }

      mt.free_shipping();
      mt._checkitemdropcart()
    },
    free_shipping: function(n) {
      //console.log($(".total .price").text());
      var price= $(".total .price").text();
      str = price.replace('.00', '');
      str = str.replace(',', '');

      str = str.replace('USD', '');
      //console.log(str);
      cart_price = str.match(/\d+/g);

      price_pase = parseFloat(cart_price);
   
      //       console.log(window.calculte_free_shipping_number);
      //       console.log(window.calculte_free_shipping_number/100);
      //       console.log(cart_price/window.calculte_free_shipping_number*100)
      //       console.log(Math.floor(cart_price/window.calculte_free_shipping_number*100).toFixed(0));
      //		console.log(parseFloat(cart_price/window.calculte_free_shipping_number*100).toFixed(1));
      if (50 < parseFloat(price_pase/window.calculte_free_shipping_number*100).toFixed(1) < 99 ){
        jQuery('.progressbar').addClass('yellow');
        jQuery('.progressbar').removeClass('green');
      }
      if ( parseFloat(price_pase/window.calculte_free_shipping_number*100).toFixed(1) < 50 ){
        jQuery('.progressbar').removeClass('yellow');
        jQuery('.progressbar').removeClass('green');
      }
      if (parseFloat(price_pase/window.calculte_free_shipping_number*100).toFixed(1) > 99){
        jQuery('.progressbar').removeClass('yellow');
        jQuery('.progressbar').addClass('green');
      }else{

      }

      if(price_pase > window.calculte_free_shipping_number){
        $('.mini_cart_header .progressbar').addClass('full-process');
        if ( $('.mini_cart_header .less-than-ten').length > 0){
          $( ".mini_cart_header .less-than-ten" ).empty();

          $('.full-free-ship').show();
          $('.cart-congrats').hide();

          $('.mini_cart_header .less-than-ten').append("100%");
        }
      }else{

        $('.mini_cart_header .progressbar').removeClass('full-process');
        $('.full-free-ship').hide();
        $('.cart-congrats').show();
        $('.mini_cart_header .less-than-ten').append(Math.floor(price_pase/window.calculte_free_shipping_number*100).toFixed(0) + "%");
        $('.mini_cart_header .less-than-ten').css("width",Math.floor(price_pase/window.calculte_free_shipping_number*100).toFixed(0) + "%");
        if ( $('.mini_cart_header .less-than-ten').length > 0){


          $( ".mini_cart_header .less-than-ten" ).empty();
          $('.mini_cart_header .less-than-ten').append(Math.floor(price_pase/window.calculte_free_shipping_number*100).toFixed(0) + "%");
        }
      }

    },
    _checkcurrency: function() {
      if(typeof Currency != 'undefined')
        return window.show_multiple_currencies && Currency.currentCurrency != shopCurrency
        },

    //endcart

    _quickviewthumbslide: function(e) {
      if (e) {
        e.owlCarousel({
          loop:true,
          margin:1,
          responsiveClass:true,
          navText: ['<i class="cs-font clever-icon-prev"></i>','<i class="cs-font clever-icon-next"></i>'],
          responsive:{
            0:{
              items:3,
              nav:true
            },
            600:{
              items:3,
              nav:true
            },
            1000:{
              items:3,
              nav:true,
              loop:false
            }
          }
        }).css("visibility", "visible")
      }
    },
    convertToSlug: function(e) {
      return e.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    },
    _createvariantquickviewwatch: function(mt, n) {
      if (mt.variants.length > 1) {
        for (var cart = 0; cart < mt.variants.length; cart++) {
          var i = mt.variants[cart];
          var s = '<option value="' + i.id + '">' + i.title + "</option>";
          n.find("form.variants > select").append(s)
        }
        new Shopify.OptionSelectors("product-select-" + mt.id, {
          product: mt,
          onVariantSelected: selectCallbackQuickview
        });
        var o = window.file_url.substring(0, window.file_url.lastIndexOf("?"));
       
        var u = window.loading_url.substring(0, window.loading_url.lastIndexOf("loading.gif"));
        console.log(u);
        var a = "";
        for (var cart = 0; cart < mt.options.length; cart++) {
          var f = false;
          if (/Color|Colour/i.test(mt.options[cart].name)) {
            f = true
          }
          a += '<div class="swatch clearfix swatch-' + cart + ' ' + (f ? "color" : "") + '" data-option-index="' + cart + '">';
          a += '<div class="label-heading">' + mt.options[cart].name + "</div>";
          var l = new Array;
          for (var c = 0; c < mt.variants.length; c++) {
            var i = mt.variants[c];
            var h = i.options[cart];
            var p = this.convertToSlug(h);
            var d = "swatch-" + cart + "-" + p;

            if (l.indexOf(h) < 0) {
              a += '<div data-value="' + h + '" class="swatch-element ' + (f ? "color" : "") + p + (i.available ? " available " : " soldout ") + '">';
              a += '<input id="' + d + '" type="radio" name="option-' + cart + '" value="' + h + '" ' + (c == 0 ? " checked " : "") + (i.available ? "" : " disabled") + " />";
              if (f) {
                if(window.swatch_style1){
                  a += '<label for="' + d + '" style= "background-color: ' + p + '";><img class="crossed-out" src="' + o + 'soldout.png" /></label>'
                }
                if(window.swatch_style2){
                  a += '<label for="' + d + '" style= " background-image: url(' + u + p + '.png)"><img class="crossed-out" src="' + o + 'soldout.png" /></label>'
                }
                if(window.swatch_style3){
                  a += '<label for="' + d + '" style= "background-image: url(' + mt.variants[c].featured_image.src + ')"><img class="crossed-out" src="' + o + 'soldout.png" /></label>'
                }
              } else {
                a += '<label for="' + d + '">' + h + '<img class="crossed-out" src="' + o + 'soldout.png" /></label>'
              }
              a += "</div>";
              if (i.available) {
                jQuery('.product-quickview .swatch[data-option-index="' + cart + '"] .' + p).removeClass("soldout").addClass("available").find(":radio").removeAttr("disabled")
              }
              l.push(h)
            }
          }
          a += "</div>"
        }
        n.find("form.variants > select").after(a);
        n.find(".swatch :radio").change(function() {
          var mt = jQuery(this).closest(".swatch").attr("data-option-index");
          var n = jQuery(this).val();
          jQuery(this).closest("form").find(".single-option-selector").eq(mt).val(n).trigger("change")
        });
        if (mt.available) {
          Shopify.optionsMap = {};
          Shopify.linkOptionSelectors(mt)
        }
      } else {
        n.find("form.variants > select").remove();
        var v = '<input type="hidden" name="id" value="' + mt.variants[0].id + '">';

        n.find("form.variants").append(v)
      }
    },
    _createquickviewvariant: function(mt, n) {
      if (mt.variants.length > 1) {
        jQuery(".selector-wrapper").show();
        for (var cart = 0; cart < mt.variants.length; cart++) {
          var i = mt.variants[cart];
          var s = '<option value="' + i.id + '">' + i.title + "</option>";
          n.find("form.variants > select").append(s)
        }
        new Shopify.OptionSelectors("product-select-" + mt.id, {
          product: mt,
          onVariantSelected: selectCallbackQuickview
        });
        jQuery(".product-quickview .single-option-selector").selectize();
        jQuery(".product-quickview .selectize-input input").attr("disabled", "disabled");
        if (mt.options.length == 1) {
          jQuery(".selector-wrapper:eq(0)").prepend("<label>" + mt.options[0].name + "</label>")
        }
        n.find("form.variants .selector-wrapper label").each(function(n, cart) {
          jQuery(this).html(mt.options[n].name)
        })
      } else {
        n.find("form.variants > select").remove();
        var o = '<input type="hidden" name="id" value="' + mt.variants[0].id + '">';
        n.find("form.variants").append(o)
      }
    },
    _closequickview: function() {
      jQuery(".product-quickview").fadeOut(500)
    },
    translateText: function(str) {
      if (!window.enable_multilang || str.indexOf("|") < 0)
        return str;

      if (window.enable_multilang) {
        var textArr = str.split("|");
        if (translator.isLang2())
          return textArr[1];
        return textArr[0];
      }          
    },
    translateBlock: function(blockSelector) {
      if (window.enable_multilang && translator.isLang2()) {
        translator.doTranslate(blockSelector);
      }
    }

  }

  $(document).ready(function(){
    $('.up-qty').click(function(){
      quantity =$('#quantity').val();
      $('#quantity').val(parseInt(quantity) + 1);
    });
    $('.down-qty').click(function(){
      quantity =$('#quantity').val();
      if(quantity > 1)
        $('#quantity').val(parseInt(quantity) - 1);
    });
  });


})(jQuery);