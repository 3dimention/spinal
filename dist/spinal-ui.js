//	SpinalJS Ui@0.1.0 (c) 2015 Patricio Ferreira <3dimentionar@gmail.com>, 3dimention.com
//	SpinalJS may be freely distributed under the MIT license.
//	For all details and documentation: http://3dimention.github.io/spinal
define("ui/view",["core/spinal","util/string","util/exception/ui/ui","libs/bootstrap"],function(e,t,n){var r=e.namespace("com.spinal.ui.View",Backbone.View.inherit({id:null,events:{},className:"ui-view",method:"append",_parent:null,_tpl:null,constructor:function(e){e||(e={}),Backbone.View.apply(this,arguments),this.id=e.id?e.id:this.$el.attr("id")?this.$el.attr("id"):null,e.autoId&&(this.id=t.uuid()),this.$el.attr("id",this.id)},initialize:function(e){return e||(e={}),this._valid(e),e.el&&this.addClass(this.className),e.cls&&this.addClass(e.cls),e.method&&(this.method=e.method),e.template&&(this._tpl=this._compile(e.template)),e.attrs?this.addAttr(e.attrs):this},_valid:function(e){e||(e={});if(e.id&&!_.isString(e.id))throw new n("InvalidIDType");if(!e.model||e.model instanceof Backbone.Model){if(e.method&&!r.RENDER[e.method])throw new n("UnsupportedRenderMethod",{method:"non-existent-method"});return!0}throw new n("InvalidModelType")},_next:function(e){return this._parent?this._parent.lookup
(e):null},_ensure:function(){if(!this._parent)throw new n("SuccessorNotSpecified");if(this._parent instanceof e.com.spinal.ui.Container){if(this.id&&!this._parent.findById(this.id))throw new n("UIStackViolation",{viewId:"view-error",succesorId:"container-declared-inline"});return this}throw new n("InvalidSuccessorType")},_method:function(e){return e&&e.method&&r.RENDER[e.method]?e.method:this.method},_compile:function(e){return!e||!_.isString(e)&&!_.isFunction(e)?null:_.isString(e)?_.template(e):e},listenTo:function(e,t,n){return arguments.length===2&&this.model&&(n=t,t=e,e=this.model),r.__super__.listenTo.call(this,e,t,n)},data:function(e){return e||(e={}),this.model?this.model.toJSON():this._parent&&this._parent.model?this._parent.model.toJSON():e},template:function(e,t){return _.isObject(e)&&(t=e,e=null),e=e?this._compile(e):this._tpl,e?this.$el.html(e(this.data(t))):this.$el},render:function(e){return e||(e={}),this.beforeRender(e),this._parent._targetEl(this)[this._method.apply(this
,arguments)](this.template(this._tpl)),this.afterRender(e),this},beforeRender:function(e){return this._ensure().detach(arguments)},afterRender:function(e){return e.silent||this.trigger(r.EVENTS.render,this),this.delegateEvents()},update:function(e,t,n){return(!n||!n.silent)&&this.trigger(r.EVENTS.update,this),this},lookup:function(e,t){return!e||!_.isFunction(e)?null:e(this)?this:this._next.apply(this,arguments)},addClass:function(e){return e?(this.$el.addClass(e),this):this},removeClass:function(e){return e?(this.$el.removeClass(e),this):this},addAttr:function(e,t){return this.$el.attr.apply(this.$el,arguments),this},removeAttr:function(e){return this.$el.removeAttr.apply(this.$el,arguments),this},show:function(e){return this.$el.show(),(!e||!e.silent)&&this.trigger(r.EVENTS.show,{view:this}),this},hide:function(e){return this.$el.hide(),(!e||!e.silent)&&this.trigger(r.EVENTS.hide,{view:this}),this},enable:function(e){return this.$el.removeAttr("disabled"),(!e||!e.silent)&&this.trigger
(r.EVENTS.enable,{view:this}),this},disable:function(e){return this.$el.attr("disabled","true"),(!e||!e.silent)&&this.trigger(r.EVENTS.disable,{view:this}),this},detach:function(e){return r.__super__.remove.apply(this,arguments),(!e||!e.silent)&&this.trigger(r.EVENTS.detach,{view:this}),this.undelegateEvents()},toString:function(){return"[object View]"}},{NAME:"View",RENDER:{append:"append",prepend:"prepend",appendTo:"appendTo",prependTo:"prependTo",html:"html"},EVENTS:{click:"com:spinal:ui:view:click",dbclick:"com:spinal:ui:view:dbclick",mousedown:"com:spinal:ui:view:mousedown",mouseup:"com:spinal:ui:view:mouseup",show:"com:spinal:ui:view:show",hide:"com:spinal:ui:view:hide",enable:"com:spinal:ui:view:enable",disable:"com:spinal:ui:view:disable",render:"com:spinal:ui:view:rendere",update:"com:spinal:ui:view:update",detach:"com:spinal:ui:view:detach"}}));return r}),define("ui/container",["core/spinal","ui/view","util/adt/collection","util/exception/ui/ui"],function(e,t,n,r){var i=e.namespace
("com.spinal.ui.Container",t.inherit({className:"ui-container",views:null,constructor:function(){t.apply(this,arguments)},initialize:function(e){return e||(e={}),i.__super__.initialize.apply(this,arguments),this.views=new n([],e.interface?{"interface":e.interface}:{}),e.views&&this.addAll(e.views,{silent:!0}),this},_valid:function(e){e||(e={}),i.__super__._valid.apply(this,arguments);if(!e.collection||e.collection instanceof Backbone.Collection){if(!e.interface||e.interface.prototype instanceof t||!!e.interface.NAME&&e.interface.NAME===t.NAME)return!0;throw new r("InvalidInterfaceType")}throw new r("InvalidModelType")},_next:function(e,t){return!_.isUndefined(t)||t===i.LOOKUP.descendant?this.findDeep(e):i.__super__._next.apply(this,arguments)},_resolveSuccesor:function(){if(!this._parent){var e=this.$el.parent().length>0?this.$el.parent()[0].nodeName.toLowerCase():"body";this._parent=new i({el:e}),this._parent.add(this,{silent:!0})}return this},_targetEl:function(e){return this.$el},render
:function(){return this._resolveSuccesor(),i.__super__.render.apply(this,arguments),this.invoke("render",arguments),this},update:function(e,t,n){return i.__super__.update.apply(this,arguments)},add:function(e,t){t||(t={});var n=e.id?this.findById(e.id):this.findByCID(e.cid);if(!n){var r=this.views.add(e);return r._parent=this,t.renderOnAdd&&r.render(t),t.silent||this.trigger(i.EVENTS.add,{added:r,view:this}),r}return e},addAll:function(e,t){return t||(t={}),_.map(e,function(e){return this.add(e,t)},this)},remove:function(e,t){t||(t={});var n=this.getPos(e);return _.isNull(n)||(this.views.remove(n),e._parent=null,t.detachOnRemove&&e.detach(),t.silent||this.trigger(i.EVENTS.remove,{removed:e,view:this})),this},removeAll:function(e){return e||(e={}),this.views.isEmpty()||this.invoke("detach",arguments),this.views.reset(),e.silent||this.trigger(i.EVENTS.removeAll,{view:this}),this},get:function(e){return this.views.get(e)},getPos:function(e){return this.views.findPosBy(function(t){return t.
cid&&t.cid===e.cid})},find:function(e){if(!e||!_.isFunction(e))return;var t=null;for(var n=0;n<this.views.size();n++)if(t=e(this.views.get(n),n))break;return t},findDeep:function(e,t){if(!e||!_.isFunction(e)||!_.isUndefined(t))return;for(var n=0;n<this.views.size();n++){if(!_.isUndefined(t))break;var r=this.views.get(n);if(e(r)){t=r;break}r.views&&!r.views.isEmpty()&&(t=r.findDeep(e,t))}return t},findByCID:function(e){return e?this.views.find(function(t){return t.cid&&t.cid===e}):null},findById:function(e){return e?this.views.find(function(t){return t.id&&t.id===e}):null},filter:function(e){return this.views.findBy(e)},invoke:function(e){if(this.views.size()===0)return[];var t=Array.prototype.slice.call(arguments,1);return this.views.invoke(e,t)},show:function(){return i.__super__.show.apply(this,arguments),this.invoke("show",arguments),this},hide:function(){return i.__super__.hide.apply(this,arguments),this.invoke("hide",arguments),this},enable:function(){return i.__super__.enable.apply
(this,arguments),this.invoke("enable",arguments),this},disable:function(){return i.__super__.disable.apply(this,arguments),this.invoke("disable",arguments),this},detach:function(){return this.views.isEmpty()||this.invoke("detach",arguments),i.__super__.detach.apply(this,arguments),this},toString:function(){return"[object Container]"}},{NAME:"Container",LOOKUP:{ancestor:"ancestor",descendant:"descendant"},EVENTS:{add:"com:spinal:ui:container:add",remove:"com:spinal:ui:container:remove",removeAll:"com:spinal:ui:container:removeAll"}}));return i}),define("ui/basic/paragraph",["ui/view","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ui.basic.Paragraph",e.inherit({className:"ui-paragrah",tagName:"p",_content:"",initialize:function(e){return e||(e={}),e.content&&(this._content=e.content),n.__super__.initialize.apply(this,arguments),this},render:function(e){return n.__super__.render.apply(this,arguments),this.content(this._content),this},update:function(e,t,r){return _.isString
(t)&&this.text(t),n.__super__.update.apply(this,arguments)},content:function(e){return _.defined(e)?(this.$el.html(this._content=e),this):this._content}},{NAME:"Paragraph"}));return n}),define("ui/basic/link",["ui/basic/paragraph","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ui.basic.Link",e.inherit({className:"ui-link",tagName:"a",_href:"#",initialize:function(e){return e||(e={}),e.href&&(this._href=e.href),n.__super__.initialize.apply(this,arguments),this},render:function(e){return n.__super__.render.apply(this,arguments),this.href(this._href),this},href:function(e){return _.defined(e)?(this.$el.attr("href",this._href=e),this):this._href}},{NAME:"Link"}));return n}),define("ui/basic/header",["ui/basic/paragraph"],function(e){var t=Spinal.namespace("com.spinal.ui.basic.Header",e.inherit({className:"ui-header",tagName:"h",_heading:"1",constructor:function(e){e||(e={}),e.heading&&(this._heading=e.heading),this.tagName=this.tagName+this._heading,t.__super__.constructor.
apply(this,arguments)},initialize:function(e){return e||(e={}),t.__super__.initialize.apply(this,arguments),this}},{NAME:"Header"}));return t}),define("ui/basic/label",["ui/basic/paragraph","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ui.basic.Label",e.inherit({className:"ui-label",tagName:"label",_afor:null,initialize:function(e){return e||(e={}),e.afor&&(this._afor=e.afor),n.__super__.initialize.apply(this,arguments),this},render:function(e){return n.__super__.render.apply(this,arguments),this.afor(this._afor),this},afor:function(e){return _.defined(e)?(this.$el.attr("for",this._afor=e),this):this._afor}},{NAME:"Label"}));return n}),define("ui/basic/span",["ui/basic/paragraph"],function(e){var t=Spinal.namespace("com.spinal.ui.basic.Span",e.inherit({className:"ui-span",tagName:"span"},{NAME:"Span"}));return t}),define("ui/basic/image",["ui/view","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ui.basic.Image",e.inherit({className:"ui-image",tagName:"img"
,_src:null,_alt:"",initialize:function(e){return e||(e={}),e.src&&(this._src=e.src),e.alt&&(this._alt=e.alt),n.__super__.initialize.apply(this,arguments),this},render:function(e){return n.__super__.render.apply(this,arguments),this.src(this._src),this.alt(this._alt),this},update:function(e,t,r){return _.isString(t)&&this.src(t),n.__super__.update.apply(this,arguments)},src:function(e){return _.defined(e)?(this.$el.attr("src",this._src=e),this):this._src},alt:function(e){return _.defined(e)?(this.$el.attr("alt",this._alt=e),this):this._alt}},{NAME:"Image"}));return n}),define("ui/misc/panel",["ui/container","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ui.misc.Panel",e.inherit({className:"ui-panel panel",tagName:"div",_title:"Default Title",_type:null,initialize:function(e){e||(e={}),e.title&&(this._title=e.title),this._type=e.type?e.type:n.TYPES.standard;var t={tagName:"div"};return e.template=Spinal.html("tag",_.extend({cls:"panel-heading"},t))+Spinal.html("tag",_.extend
({cls:"panel-body"},t)),n.__super__.initialize.apply(this,arguments),this},_targetEl:function(){return this.$el.children(".panel-body")},render:function(e){return n.__super__.render.apply(this,arguments),this.title(this._title),this.type(this._type),this},title:function(e){return _.defined(e)?(this.$el.children(".panel-heading").html(this._title=e),this):this._title},type:function(e){return _.defined(e)?(this.$el.removeClass(this._type).addClass(this._type=e),this):this._type}},{NAME:"Panel",TYPES:{standard:"panel-default",primary:"panel-primary",success:"panel-success",info:"panel-info",warning:"panel-warning",danger:"panel-danger"}}));return n}),define("ui/list/list-item",["ui/container"],function(e){var t=Spinal.namespace("com.spinal.ui.list.ListItem",e.inherit({events:{click:"_onClick",mousedown:"_onMouseDown",mouseup:"_onMouseUp"},className:"ui-list-item",tagName:"li",_onClick:function(e){this.trigger(t.EVENTS.click,e,this)},_onMouseDown:function(e){this.trigger(t.EVENTS.mousedown,
e,this)},_onMouseUp:function(e){this.trigger(t.EVENTS.mouseup,e,this)}},{NAME:"ListItem"}));return t}),define("ui/list/list",["ui/container","ui/list/list-item","ui/basic/link","util/string"],function(e,t,n,r){var i=Spinal.namespace("com.spinal.ui.list.List",e.inherit({className:"ui-list",tagName:"ul",_type:n,_transform:null,initialize:function(e){return e||(e={}),e.interface=t,_.extend(this,r.toPrivate(_.pick(e,"type","transform"))),i.__super__.initialize.apply(this,arguments),this._list({silent:!0})},_list:function(e){return this.collection.each(function(t){var n=t.toJSON(),r=_.omit(n,"content","views","el","interface"),i=_.defined(n.views)?n.views:[this.onListItem(_.pick(n,"id","content"))];this.add(_.extend(r,{views:i},e))},this),this},onListItem:function(e){return e||(e={}),_.defined(this._transform)&&(e=this._transform(e)),new this._type(_.isObject(e.content)?e.content:e)}},{NAME:"List"}));return i}),define("ui/misc/dropdown",["ui/container","ui/list/list","ui/basic/link","util/string"
],function(e,t,n,r){var i=Spinal.namespace("com.spinal.ui.misc.Dropdown",e.inherit({className:"ui-dropdown btn-group",tagName:"div",_text:"Default",_type:n,_caret:Spinal.html("tag",{tagName:"span",cls:"caret"}),initialize:function(e){return e||(e={}),e.interface=t,e.template=this._setup(),_.extend(this,r.toPrivate(_.pick(e,"text","type"))),i.__super__.initialize.apply(this,arguments),this._list({silent:!0})},_list:function(e){return this.add({className:"dropdown-menu",type:this._type,transform:this.onItem,collection:this.collection},e),this},_setup:function(){return Spinal.html("tag",{tagName:"button",cls:"btn btn-default dropdown-toggle",attrs:{"data-toggle":"dropdown","aria-expanded":!1}})},render:function(e){return i.__super__.render.apply(this,arguments),this.text(this._text),this},text:function(e){return _.defined(e)?(this.$el.children("button.dropdown-toggle").html((this._text=e)+"&nbsp;&nbsp;"+this._caret),this):this._text},onItem:function(e){return _.extend(e)}},{NAME:"Dropdown"
}));return i}),define("ui/form/controls/button",["ui/view","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ui.form.controls.Button",e.inherit({events:{click:"_onClick"},className:"ui-button btn",tagName:"button",_text:"default",_style:null,initialize:function(e){return e||(e={}),e.text&&(this._text=e.text),this._style=e.style?e.style:n.TYPES.standard,n.__super__.initialize.apply(this,arguments),this},render:function(e){return n.__super__.render.apply(this,arguments),this.text(this._text),this.style(this._style),this},update:function(e,t,r){return _.isString(t)&&this.text(t),n.__super__.update.apply(this,arguments)},text:function(e){return _.defined(e)?(this.$el.html(this._text=e),this):this._text},style:function(e){return _.defined(e)?(this.$el.removeClass(this._style).addClass(this._style=e),this):this._style},_onClick:function(e){this.trigger(n.EVENTS.clicked,this)}},{NAME:"Button",EVENTS:{clicked:"com:spinal:ui:view:form:controls:button:clicked"},TYPES:{standard:"btn-default"
,primary:"btn-primary",success:"btn-success",info:"btn-info",warning:"btn-warning",danger:"btn-danger",link:"btn-link"}}));return n}),define("ui/misc/dialog",["ui/container","ui/basic/header","ui/form/controls/button","util/string"],function(e,t,n,r){var i=Spinal.namespace("com.spinal.ui.misc.Dialog",e.inherit({className:"ui-dialog modal",_title:"Default Title",_keyboard:!0,_backdrop:!0,_closeIcon:!0,initialize:function(e){return e||(e={}),e.template=this._setup(),_.extend(this,r.toPrivate(_.pick(e,"title","keyboard","backdrop","closeIcon"))),i.__super__.initialize.apply(this,arguments),this._header(e.header)._footer(e.footer).addAttr({role:"modal",tabindex:"-1"})},_targetEl:function(e){var t=_.contains(["modal-header","modal-footer"],e.className)?".modal-content":".modal-body";return this.$el.find(t)},_setup:function(){return this._create({cls:"modal-dialog",content:this._create({cls:"modal-content",content:this._create({cls:"modal-body"})})})},_create:function(e,t){return t||(t={}),arguments
.length===1&&(t=e,e="div"),Spinal.html("tag",_.extend({tagName:e},t))},_header:function(t){return this.add(new e(_.extend(this.onHeader(t),{className:"modal-header",method:e.RENDER.prepend,template:this._closeIcon?i.CLOSE:""})),{silent:!0}),this},_footer:function(t){return this.add(new e(_.extend(this.onFooter(t),{className:"modal-footer"})),{silent:!0}),this},render:function(e){return i.__super__.render.apply(this,arguments),this.title(this._title),this},title:function(e){return _.defined(e)?((header=this.getHeader())&&header.content(this._title=e),this):this._title},onHeader:function(e){var n={"interface":t};return n.views=e?[e]:[{heading:4,content:this._title}],n},onFooter:function(e){var t={"interface":n};return t.views=e?e:[{text:"Accept",attrs:{"data-dismiss":"modal"}}],t},getHeader:function(){return this.lookup(function(e){return e.className==="ui-header"},i.LOOKUP.descendant)},show:function(){return this.$el.modal("show"),(!opts||!opts.silent)&&this.trigger(i.EVENTS.show,{view:this
}),this},hide:function(e){return this.$el.modal("hide"),(!e||!e.silent)&&this.trigger(i.EVENTS.hide,{view:this}),this}},{NAME:"Dialog",CLOSE:Spinal.html("tag",{tagName:"button",cls:"close",content:Spinal.html("tag",{tagName:"span",content:"&times;"}),attrs:{"data-dismiss":"modal"}})}));return i}),define("ui/form/controls/input",["ui/view","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ui.form.controls.Input",e.inherit({events:{keyup:"_onKeyup",keydown:"_onKeydown",focus:"_onFocus",blur:"_onBlur"},className:"ui-input form-control",tagName:"input",_value:"",_type:"text",_name:null,_placeholder:null,initialize:function(e){return e||(e={}),this._type&&this.$el.attr("type",this._type),_.extend(this,t.toPrivate(_.pick(e,"name","value","placeholder"))),n.__super__.initialize.apply(this,arguments),this},render:function(e){return n.__super__.render.apply(this,arguments),this.name(this._name),this.placeholder(this._placeholder),this.value(this._value),this},update:function(e,t,r)
{return _.isString(t)&&this.value(t),n.__super__.update.apply(this,arguments)},name:function(e){return _.defined(e)?(this.$el.attr("name",this._name=e),this):this._name},value:function(e){return _.defined(e)?(this.$el.val(this._value=e),this):this._value},placeholder:function(e){return _.defined(e)?(this.$el.attr("placeholder",this._placeholder=e),this):this._placeholder},_onKeyup:function(e){this._value=e.currentTarget.value,this.trigger(n.EVENTS.keyup,e,this)},_onKeydown:function(e){this.trigger(n.EVENTS.keydown,e,this)},_onFocus:function(e){this.trigger(n.EVENTS.focus,e,this)},_onBlur:function(e){this.trigger(n.EVENTS.blur,e,this)}},{NAME:"Input",EVENTS:{keyup:"com:spinal:ui:view:keyup",keydown:"com:spinal:ui:view:keydown",focus:"com:spinal:ui:view:focus",blur:"com:spinal:ui:view:blur"},TYPES:{text:"text",radio:"radio",checkbox:"checkbox",password:"password",hidden:"hidden",number:"number",email:"email",date:"date"}}));return n}),define("ui/misc/autocomplete",["ui/container","ui/form/controls/input"
,"ui/list/list","ui/list/list-item","ui/basic/link","ui/basic/span","util/string"],function(e,t,n,r,i,s,o){var u=Spinal.namespace("com.spinal.ui.misc.Autocomplete",e.inherit({className:"ui-autocomplete btn-group",_type:i,_minChars:3,_results:[],selection:-1,input:null,list:null,initialize:function(e){e||(e={}),_.extend(this,o.toPrivate(_.pick(e,"type","minChars"))),u.__super__.initialize.apply(this,arguments);var t={silent:!0};return this._input(t)._list(t)},_input:function(e){return this.input=this.add(new t({placeholder:"Search"}),e),this},_list:function(e){return this.list=this._spanNoResults(e).add(new n({cls:"dropdown-menu",type:this._type,transform:this.onItem,collection:this.collection}),e),this},_spanNoResults:function(e){var t={views:[this.onEmpty(new s({cls:"text-muted",attrs:{style:"padding: 10px;"}}))]};return this.collection.add(t,e),this},_itemEvents:function(){return this.list.views.each(function(e){e.listenTo(e,r.EVENTS.mousedown,_.bind(this.onSelect,this))},this),this},
_findItemByPos:function(e){return _.defined(this._results[e])?this.list.findById(this._results[e].id):null},_navigate:function(e){var t=this.selection;prev=this._findItemByPos(t),e.which===38&&this.selection>=1&&this.selection--,e.which===40&&this.selection<this._results.length-1&&this.selection++;var n=this._findItemByPos(this.selection);return prev&&prev.removeClass("bg-info"),n&&n.addClass("bg-info"),e.which===13&&this.onSelect(null,n),this},_onOpen:function(e,t){return t.value().length<this._minChars?this._onClose():(this.addClass("open")._search(t.value()),(e.which===38||e.which===40||e.which===13)&&this._results.length>0?this._navigate(e):this.list.invoke("removeClass","bg-info"))},_onClose:function(e,t){return this.removeClass("open")},_search:function(e){var t=new RegExp(o.escapeRegex(e),"i"),n=this.collection.size()-1,r=this._results.length;return this._results=this.collection.filter(function(e,n){var r=this.onSearch(t,e);return v=this.list.get(n)[r?"show":"hide"](),this.onHighlight
(v,r),r},this),this.list.get(n)[this._results.length===0?"show":"hide"](),r!==this._results.length&&(this.selection=-1),this},render:function(){u.__super__.render.apply(this,arguments);var e=[t.EVENTS.keyup,t.EVENTS.focus].join(" ");return this.input.listenTo(this.input,e,_.bind(this._onOpen,this)).listenTo(this.input,t.EVENTS.blur,_.bind(this._onClose,this)),this._itemEvents()},results:function(){return this._results},onSearch:function(e,t){return _.isString(t.get("value"))&&e.test(t.get("value"))},onHighlight:function(e,t){return e},onEmpty:function(e){return e.content("<em>No Results</em>")},onSelect:function(e,t){(m=this.collection.findWhere({id:t.id}))&&this._onClose(null,this.input.value(m.get("value"))),this.trigger(u.EVENTS.selected,e,m)},onItem:function(e){return _.extend({attrs:{style:"cursor: pointer;"}},e)}},{NAME:"UIAutocomplete",EVENTS:{selected:"com:spinal:ui:misc:autcomplete:selected"}}));return u}),define("ui/misc/affix",["ui/container","ui/basic/header","ui/list/list","util/string"
],function(e,t,n,r){var i=Spinal.namespace("com.spinal.ui.misc.Affix",e.inherit({className:"ui-affix",tagName:"nav",_config:null,_list:null,_title:null,initialize:function(e){return e||(e={}),_.extend(this,r.toPrivate(_.pick(e,"list","config","title"))),i.__super__.initialize.apply(this,arguments),this.title().add(this._list),this.$el.affix(this._config),this},title:function(){return _.defined(this._title)&&this.add(new t({content:this._title,heading:"4"})),this}},{NAME:"Affix"}));return i}),define("ui/table/table-element",["ui/container"],function(e){var t=Spinal.namespace("com.spinal.ui.table.TableElement",e.inherit({className:"ui-table-",tagName:"",_t:"",constructor:function(e){e||(e={}),e.el||(this._t=e.t?e.t:t.TYPES.row,this.tagName=this._t),this.className=e.el?"":this.className+this._t,t.__super__.constructor.apply(this,arguments)},initialize:function(e){return e||(e={}),t.__super__.initialize.apply(this,arguments),this}},{NAME:"TableElement",TYPES:{head:"th",row:"td",column:"tr"}
}));return t}),define("ui/table/table",["ui/container","ui/table/table-element","util/string"],function(e,t,n){var r=Spinal.namespace("com.spinal.ui.table.Table",e.inherit({className:"ui-table table",tagName:"table",header:null,footer:null,_thead:null,_tbody:null,_tfoot:null,initialize:function(e){return e||(e={}),e.interface=t,_.extend(this,n.toPrivate(_.pick(e,"thead","tbody","tfoot"))),r.__super__.initialize.apply(this,arguments),this._head()._body()._foot()},_create:function(e){return Spinal.html("tag",{tagName:e,cls:"ui-table-"+e})},_head:function(){if(!this._thead||this._thead.length===0)return"";var e=this.add({t:r.SECTIONS.head,"interface":t},{silent:!0});return this._content(this._thead,e,t.TYPES.head,"_col")},_body:function(){if(!this._tbody||this._tbody.length===0)return"";var e=this.add({t:r.SECTIONS.body,"interface":t},{silent:!0});return this._content(this._tbody,e,t.TYPES.row,"_col")},_foot:function(){if(!this._tfoot||this._tfoot.length===0)return"";var e=this.add({t:r.SECTIONS
.foot,"interface":t},{silent:!0});return this._content(this._tfoot,e,t.TYPES.row,"_col")},_content:function(e,t,n,r){return _.each(e,_.bind(this[r],this,n,t,{silent:!0})),this},_col:function(e,n,r,i){var s=_.omit(i,"rows","el","t"),o=this._create(t.TYPES.column),u=n.add(_.extend({el:$(o),"interface":t},this.onColumn(s)),r);this._content(i.rows,u,e,"_row")},_row:function(e,n,r,i){var s=this._create(e);n.add(_.extend({el:$(s),"interface":t},this.onRow(i)),r)},onColumn:function(e){return e},onRow:function(e){return{template:e}}},{NAME:"Table",SECTIONS:{head:"thead",body:"tbody",foot:"tfoot"}}));return r}),define("ui/form/mapper/form-mapper",["util/factories/factory-mapper"],function(e){var t=Spinal.namespace("com.spinal.ui.form.mapper.FormMapper",e.inherit({defaults:function(){return this.push({path:"ui/form/controls/fieldset"}).push({path:"ui/basic/label"}),this},string:function(e){return{path:"ui/form/controls/input",params:{autoId:!0,name:e.key,value:e.value}}},number:function(e){return{
path:"ui/form/controls/input",params:{autoId:!0,type:"text",name:e.key,value:e.value}}},"boolean":function(e){return{path:"ui/form/controls/checkbox",params:{autoId:!0,name:key,value:value}}},object:function(e){return{path:"ui/form/controls/"+e.value.type.toLowerCase(),params:_.omit(e.value,"type")}}},{NAME:"FormMapper"}));return t}),define("ui/form/validator/validator",["util/adt/collection"],function(e){var t=Spinal.namespace("com.spinal.ui.form.validator.Validator",e.inherit({model:null,failures:null,initialize:function(e,n){return n||(n={}),n.interface=null,t.__super__.initialize.apply(this,[e,n])},_valid:function(e){return t.__super__._valid.apply(this,arguments)&&_.defined(e.name)&&_.defined(e.type)&&_.defined(t.RULE[e.type])},getResult:function(){return{success:this.failures.length===0,failures:this.failures}},setModel:function(e){return this.model=_.defined(e)&&_.isArray(e)?e:[],this.failures=[],this.trigger(t.EVENTS.clear,this)},getFieldByName:function(e){return _.find(this.model
,function(t){return t.name===e})},isValid:function(e){var t=this.getFieldByName(e.name);if(!_.defined(t))return null;var n=this[e.type]?this[e.type](t):null;return _.defined(n)?this[n?"onValid":"onInvalid"](e):null},onValid:function(e){return this.trigger(t.EVENTS.valid,e),null},onInvalid:function(e){return this.trigger(t.EVENTS.invalid,e),e},validate:function(e){return this.failures=_.compact(this.map(this.isValid,this)),this.done(e)},done:function(e){var n=this.getResult();return this.trigger(t.EVENTS.validate,this),_.defined(e)&&_.isFunction(e)&&e(n),n.success},required:function(e){return _.defined(e.value)&&e.value!==""},email:function(e){var t=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;return t.test(e.value)},currency:function(e){var t=/^(?!0\.00)[1-9]\d{0,2}(,\d{3})*(\.\d\d)?$/;return t.test(e.value)},onlyLetters:function(e){var t=/^[a-zA-Z]+$/;return t.test(e.value)},onlyNumbers:function(e){var t=/^[0-9]+$/;return t.test(e.value)},onlyAlphanumeric
:function(e){var t=/^[0-9a-zA-Z]+$/;return t.test(e.value)}},{NAME:"Validator",EVENTS:{validate:"com:spinal:ui:form:validator:validate",valid:"com:spinal:ui:form:validator:rule:valid",invalid:"com:spinal:ui:form:validator:rule:invalid",clear:"com:spinal:ui:form:validator:clear"},RULE:{required:"required",email:"email",currency:"currency",onlyLetters:"onlyLetters",onlyNumbers:"onlyNumbers",onlyAlphanumeric:"onlyAlphanumeric"}}));return t}),define("ui/form/form",["ui/container","ui/form/mapper/form-mapper","ui/form/validator/validator","util/exception/ui/ui","util/string"],function(e,t,n,r,i){var s=Spinal.namespace("com.spinal.ui.form.Form",e.inherit({events:{submit:"submit"},className:"ui-form",tagName:"form",_action:"#",_options:{_method:"GET",_enctype:"application/x-www-form-urlencoded",_acceptCharset:null,_autocomplete:"on",_novalidate:!1,_target:"_self"},_name:null,_validator:null,initialize:function(e){return e||(e={}),s.__super__.initialize.apply(this,arguments),_.extend(this,i.toPrivate
(_.pick(e,"action","name","mapper","options","validator"))),this.mapper()},_valid:function(e){if(!e.mapper||e.mapper instanceof t){if(!e.validator||e.validator instanceof n)return s.__super__._valid.apply(this,arguments);throw new r("InvalidValidatorType")}throw new r("InvalidMapperType")},resolve:function(){return this.model?this.model.toJSON():this.collection?this.collection.toJSON():null},validator:function(){return this._validator?(this.listenTo(this._validator,n.EVENTS.valid,this.onValid),this.listenTo(this._validator,n.EVENTS.invalid,this.onInvalid),this):this},mapper:function(){return _.defined(this._mapper)?(this._mapper.source(this.resolve(),_.bind(this.create,this)).load(_.bind(this.update,this)),this):this},create:function(e,t){return e||(e={}),this.wrap(e.options).add(this._mapper.create(t,_.omit(e,"options")))},wrap:function(e){e||(e={});var t=e.fieldset?this.fieldset(this,e.fieldset):this;return e.label&&this.label(t,e.label),t},fieldset:function(e,t){return e.add(this._mapper
.create("ui/form/controls/fieldset",t))},label:function(e,t){return e.add(this._mapper.create("ui/basic/label",t))},render:function(e){return s.__super__.render.apply(this,arguments),this.name(this._name),this.action(this._action),this.validator()},update:function(e,t,n){return s.__super__.update.apply(this,arguments),this.invoke("render",n),this},name:function(e){return _.defined(e)?(this.$el.attr("name",this._name=e),this):this._name},action:function(e){return _.defined(e)?(this.$el.attr("action",this._action=e),this):this._action},validate:function(){return _.defined(this._validator)?this._validator.setModel(this.$el.serializeArray()).validate():!0},submit:function(e){return this.validate()||(e.preventDefault(),e.stopPropagation()),this.trigger(s.EVENTS.submit,this)},onValid:function(t){var n=this.find(function(n){return _.defined(n.lookup(function(e){return e.$el.attr("name")===t.name},e.LOOKUP.descendant))?n:null},this);return n&&n.removeClass("has-error"),t},onInvalid:function(t){
var n=this.find(function(n){return _.defined(n.lookup(function(e){return e.$el.attr("name")===t.name},e.LOOKUP.descendant))?n:null},this);return n&&n.addClass("has-error"),t}},{NAME:"Form",EVENTS:{submit:"com:spinal:ui:form:submit"}}));return s}),define("ui/form/controls/fieldset",["ui/container"],function(e){var t=Spinal.namespace("com.spinal.ui.form.controls.Fieldset",e.inherit({className:"ui-fieldset",tagName:"fieldset"},{NAME:"Fieldset"}));return t}),define("ui/form/controls/checkbox",["ui/form/controls/input","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ui.form.controls.Checkbox",e.inherit({events:{click:"_onClick"},className:"ui-checkbox",_type:e.TYPES.checkbox,_value:!1,initialize:function(e){return e||(e={}),delete e.placeholder,n.__super__.initialize.apply(this,arguments),this},render:function(e){return n.__super__.render.apply(this,arguments),this.value(this._value),this},update:function(e,t,r){return _.isBoolean(t)&&this.value(t),n.__super__.update.apply(this
,arguments)},value:function(e){return _.defined(e)?(this.$el.prop("checked",this._value=e),this):this._value},_onClick:function(e){this.value($(e.currentTarget).prop("checked")),this.trigger(n.EVENTS.click,{view:this})}},{NAME:"Checkbox"}));return n}),define("ui/form/controls/radio",["ui/form/controls/input","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ui.form.controls.Radio",e.inherit({events:{click:"_onClick"},className:"ui-radio",_type:e.TYPES.radio,_value:!1,initialize:function(e){return e||(e={}),delete e.placeholder,n.__super__.initialize.apply(this,arguments),this},render:function(e){return n.__super__.render.apply(this,arguments),this.value(this._value),this},update:function(e,t,r){return _.isBoolean(t)&&this.value(t),n.__super__.update.apply(this,arguments)},value:function(e){return _.defined(e)?(this.$el.prop("checked",this._value=e),this):this._value},_onClick:function(e){this.value($(e.currentTarget).prop("checked")),this.trigger(n.EVENTS.click,{view:this}
)}},{NAME:"Radio"}));return n}),define("ui/form/controls/password",["ui/form/controls/input"],function(e){var t=Spinal.namespace("com.spinal.ui.form.controls.Password",e.inherit({className:"ui-password form-control",_type:e.TYPES.password,initialize:function(e){return t.__super__.initialize.apply(this,arguments),this}},{NAME:"Password"}));return t}),define("ui/form/controls/hidden",["ui/form/controls/input"],function(e){var t=Spinal.namespace("com.spinal.ui.form.controls.Hidden",e.inherit({className:"ui-hidden",_type:e.TYPES.hidden},{NAME:"UIHidden"}));return t}),define("ui/form/controls/textarea",["ui/form/controls/input"],function(e){var t=Spinal.namespace("com.spinal.ui.form.controls.Textarea",e.inherit({className:"ui-textarea",tagName:"textarea",initialize:function(e){return delete this._type,t.__super__.initialize.apply(this,arguments),this}},{NAME:"Textarea"}));return t}),define("ui/form/controls/option",["ui/view","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ui.form.controls.Option"
,e.inherit({className:"ui-option",tagName:"option",_value:"",_text:null,initialize:function(e){return e||(e={}),e.value&&(this._value=e.value),e.text&&(this._text=e.text),n.__super__.initialize.apply(this,arguments),this},render:function(e){return n.__super__.render.apply(this,arguments),this.value(this._value),this.text(this._text),this},update:function(e,t,r){return _.isString(t)&&this.text(t),n.__super__.update.apply(this,arguments)},text:function(e){return _.defined(e)?(this.$el.html(this._text=e),this):this._text},value:function(e){return _.defined(e)?(this.$el.val(this._value=e),this):this._value}},{NAME:"Option"}));return n}),define("ui/form/controls/select",["ui/container","ui/form/controls/option","util/string"],function(e,t,n){var r=Spinal.namespace("com.spinal.ui.form.controls.Select",e.inherit({className:"ui-select",tagName:"select",_name:null,initialize:function(e){return e||(e={}),e.interface=t,e.options&&e.options.length>0&&(e.views=e.options,delete e.options),r.__super__
.initialize.apply(this,arguments),this},render:function(e){return r.__super__.render.apply(this,arguments),this.name(this._name),this},update:function(e,t){return r.__super__.update.apply(this,arguments)},name:function(e){return _.defined(e)?(this.$el.attr("name",this._name=e),this):this._name}},{NAME:"Select",EVENTS:{changed:"com:spinal:ui:view:form:controls:select:changed"}}));return r}),define("spinal-ui",["ui/view","ui/container","ui/basic/paragraph","ui/basic/link","ui/basic/header","ui/basic/label","ui/basic/span","ui/basic/image","ui/misc/panel","ui/misc/dropdown","ui/misc/dialog","ui/misc/autocomplete","ui/misc/affix","ui/list/list","ui/list/list-item","ui/table/table","ui/table/table-element","ui/form/form","ui/form/mapper/form-mapper","ui/form/validator/validator","ui/form/controls/fieldset","ui/form/controls/button","ui/form/controls/input","ui/form/controls/checkbox","ui/form/controls/radio","ui/form/controls/password","ui/form/controls/hidden","ui/form/controls/textarea","ui/form/controls/select"
,"ui/form/controls/option"],function(){});