//	SpinalJS Util@0.1.0 (c) 2015 Patricio Ferreira <3dimentionar@gmail.com>, 3dimention.com
//	SpinalJS may be freely distributed under the MIT license.
//	For all details and documentation: http://3dimention.github.io/spinal
define("util/exception/exception",["core/spinal"],function(e){var t=e.namespace("com.spinal.util.exception.SpinalException",function(e){return this.initialize.apply(this,arguments),this});return e.extend(t.prototype,new Error,{initialize:function(e,t){return this.name=this.constructor.NAME?this.constructor.NAME:"SpinalException",this.type=_.isUndefined(this.constructor.TYPES[e])?"Generic":e,this.message=this.getMessage(this.type,t),this},getMessage:function(e,n){return t.getMessage.apply(this,arguments)}}),t.NAME="SpinalException",t.TYPES={Generic:_.template("Generic Exception"),StaticClass:_.template("Class cannot be instanciated. All methods and variable members are static.")},t.getMessage=function(e,n){var r=this instanceof t?this.constructor:this;return e&&r.TYPES[e]?r.TYPES[e](_.isUndefined(n)?{}:n):"Unknown Exception Message"},t.inherit=e._inherit,t}),define("util/string",["core/spinal","util/exception/exception"],function(e,t){var n=e.namespace("com.spinal.util.StringUtil",e.SpinalClass
.inherit({initialize:function(){throw new t("StaticClass")}},{NAME:"StringUtil",uuid:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=Math.random()*16|0,n=e==="x"?t:t&3|8;return n.toString(16)})},createQueryString:function(e,t,n){var r=[],i,s;return _.each(e,function(e,t){if(_.isArray(e))for(i=0,s=e.length;i<s;i++)r.push(t+"="+encodeURIComponent(decodeURIComponent(e[i])));else r.push(t+"="+encodeURIComponent(decodeURIComponent(e)))},this),(t||_.isEmpty(e)?"":"?")+r.join(n?n:"&")},strToJSON:function(e){if(!e||!_.isString(e)||e==="")return{};var t={},n=t,r=e.split(".");for(var i=0;i<r.length;i++)t[r[i]]={},t=t[r[i]],i===r.length-1&&delete t;return n},escapeRegex:function(e){return _.isString(e)?e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"):""},toPrivate:function(e){var t=_.clone(e);return _.each(e,function(e,n){t["_"+n]=e,delete t[n]}),t}}));return n}),define("util/object",["core/spinal","util/exception/exception"],function(e,t){var n=e.namespace("com.spinal.util.ObjectUtil"
,e.SpinalClass.inherit({initialize:function(){throw new t("StaticClass")}},{NAME:"ObjectUtil",isRealObject:function(e){return _.defined(e)&&!_.isArray(e)&&!_.isString(e)&&!_.isNumber(e)&&!_.isBoolean(e)&&!_.isFunction(e)&&!_.isRegExp(e)&&!_.isDate(e)&&!_.isArguments(e)},isBackbone:function(e){return e instanceof Backbone.Model||e instanceof Backbone.Collection||e instanceof Backbone.View||e instanceof Backbone.Router},search:function(e,t){if(!e||!t||e==="")return null;if(_.isEmpty(t))return t;var n=e.split("."),r=t;for(var i=0;i<n.length;i++){if(!r[n[i]]){r="";break}r=r[n[i]]}return r},objToArr:function(e){return _.reduce(e,function(e,t,n){var r={};return r[n]=t,e.push(r),e},[])}}));return n}),define("util/exception/util/factory",["core/spinal","util/exception/exception"],function(e,t){var n=e.namespace("com.spinal.util.exception.util.FactoryException",t.inherit({initialize:function(){return n.__super__.initialize.apply(this,arguments)}},{NAME:"FactoryException",TYPES:{UnregisteredFactory
:_.template("Factory <%= path %> not found. Unable to use factory method to instanciate class.")}}));return n}),define("util/adt/iterator",["core/spinal"],function(e){var t=e.namespace("com.spinal.util.adt.Iterator",e.SpinalClass.inherit({_cur:0,initialize:function(e){return e||(e=[]),this.collection=e,t.__super__.initialize.apply(this,arguments)},set:function(e){if(!_.isArray(e))throw new Error(this.toString()+" requires an array in order to be instanciate it.");return this.collection=e.slice(0),this.rewind()},hasNext:function(){return this._cur<=this.collection.length-1},next:function(){return this._cur<=this.collection.length-1?this.collection[this._cur++]:null},rewind:function(){return this._cur=0,this},remove:function(){if(this.collection.length>0){var e=this.collection.splice(this._cur,1)[0];this.trigger(t.EVENTS.removed,{removed:e,iterator:this})}return e},isEmpty:function(){return this.size()===0},size:function(){return this.collection.length}},{NAME:"Iterator",EVENTS:{removed:"com:spinal:util:adt:iterator:removed"
}}));return t}),define("util/adt/collection",["core/spinal","util/adt/iterator"],function(e,t){var n=e.namespace("com.spinal.util.adt.Collection",e.SpinalClass.inherit({collection:null,_interface:null,initialize:function(e,t){return t||(t={}),this.collection=[],t.interface&&(this._interface=t.interface),e?this.set(e,t):this.collection=[],n.__super__.initialize.apply(this,arguments)},_valid:function(e){return e?!0:!1},set:function(e){return!this._valid(e)||!_.isArray(e)?!1:(this.reset({silent:!0}),_.isNull(this._interface)?this.collection=e.slice(0):this.collection=_.compact(_.map(e,function(e){if(e)return new this._interface(e)},this)),!0)},get:function(e){return e<this.size()?this.collection[e]:null},add:function(e,t){return t||(t={}),this._valid(e)?(_.isNull(this._interface)?this.collection.push(e):(e=new this._interface(e),this.collection.push(e)),t.silent||this.trigger(n.EVENTS.added,{added:e,collection:this}),e):null},addAll:function(e,t){return t||(t={}),!this._valid(e)||!_.isArray
(e)?!1:(e=_.compact(_.map(e,function(e){if(!_.isUndefined(e))return _.isNull(this._interface)?e:new this._interface(e)},this)),this.collection=this.collection.concat(e),t.silent||this.trigger(n.EVENTS.addedAll,{addedAll:e,collection:this}),!0)},invoke:function(e){var t=_.flatten(Array.prototype.slice.call(arguments,1));return t.unshift(this.collection,e),_.invoke.apply(this,t)},each:function(e){var t=Array.prototype.slice.call(arguments);return t.unshift(this.collection),_.each.apply(this,t)},filter:function(e){var t=Array.prototype.slice.call(arguments);return t.unshift(this.collection),_.filter.apply(this,t)},map:function(e){var t=Array.prototype.slice.call(arguments);return t.unshift(this.collection),_.map.apply(this,t)},findWhere:function(e){var t=Array.prototype.slice.call(arguments);return t.unshift(this.collection),_.findWhere.apply(this,t)},containsBy:function(e,t){if(!t||!e||!_.isFunction(e))return!1;var n=!1,r=this._interface&&this._interface.prototype.toJSON?this.invoke("toJSON"
):this.collection;for(var i=0;i<r.length;i++)if(e(t,r[i])){n=!0;break}return n},contains:function(e){if(!this._valid(e)||this.isEmpty())return!1;var t=!1,n=this._interface&&this._interface.prototype.toJSON?this.invoke("toJSON"):this.collection;for(var r=0;r<n.length;r++)if(_.isEqual(n[r],e)){t=!0;break}return t},containsAll:function(e){return e?_.every(_.map(e,function(e){return this.contains(e)},this)):!1},iterator:function(){return new t(_.clone(this.collection))},remove:function(e,t){t||(t={});if(!_.isUndefined(e)&&_.isNumber(e)&&e>=0&&e<this.size()){var r=this.collection.splice(e,1);return t.silent||this.trigger(n.EVENTS.removed,{removed:r[0],collection:this}),r[0]}return null},removeBy:function(e,t){t||(t={});var n=this.size();for(var r=0,i=[];r<n;r++)this.collection[r]&&e(this.collection[r])&&(i.push(this.remove(r,t)),r--,n--);return i},removeAll:function(e,t){t||(t={});if(!this._valid(e)||!_.isArray(e))return[];var r=this.size(),i=[];for(var s=0;s<r;s++)_.filter(e,_.matches(this.
collection[s])).length>0&&(i.push(this.remove(s,{silent:!0})),s>0&&s--,r--);return!t.silent&&i.length>0&&this.trigger(n.EVENTS.removedAll,{removed:i,collection:this}),i},find:function(e){if(!e||!_.isFunction(e))return null;var t=Array.prototype.slice.call(arguments);return t.unshift(this.collection),_.find.apply(this,t)},findBy:function(e){for(var t=0,n=[];t<this.size();t++)e(this.collection[t],t)&&n.push(this.collection[t]);return n},findPosBy:function(e){for(var t=0,n=-1;t<this.size();t++)if(e(this.collection[t],t)){n=t;break}return n},reset:function(e){return e||(e={}),this.collection=[],e.silent||this.trigger(n.EVENTS.reset,{collection:this}),this},isEmpty:function(){return this.size()===0},size:function(){return this.collection.length},sort:function(e){return!_.isUndefined(e)&&_.isFunction(e)?this.collection.sort(e):this.collection.sort(),this},swap:function(e){if(!_.isUndefined(e)&&_.isFunction(e))for(var t=0;t<this.collection.length;t++){var n=e(this.collection[t],t);if(!_.isNull
(n)&&n>-1){var r=this.collection[t];this.collection[t]=this.collection[n],this.collection[n]=r}}return this}},{NAME:"Collection",EVENTS:{added:"com:spinal:util:adt:collection:added",removed:"com:spinal:util:adt:collection:removed",addedAll:"com:spinal:util:adt:collection:addedAll",removedAll:"com:spinal:util:adt:collection:removedAll",reset:"com:spinal:util:adt:collection:reset"}}));return n}),define("util/factories/factory",["core/spinal","util/exception/util/factory","util/adt/collection"],function(e,t,n){var r=e.namespace("com.spinal.util.factories.Factory",e.SpinalClass.inherit({factories:null,initialize:function(){return this.factories=new n,r.__super__.initialize.apply(this,arguments)},_construct:function(e,t){function n(){return e.apply(this,t)}return _.isFunction(e)?(n.prototype=e.prototype,new n):e},getFactory:function(e){return this.factories.find(_.bind(function(t){return t.path===e},this))},isRegistered:function(e){return _.defined(this.getFactory(e))},register:function(e,t)
{return!e||!t?null:(this.getFactory(e)||this.factories.add({path:e,factory:t,options:Array.prototype.slice.call(arguments,2)}),t)},unregister:function(e){return e?this.getFactory(e)?this.factories.removeBy(_.bind(function(t){return t.path===e},this))[0]:null:null},create:function(e){var n=this.getFactory(e);if(!n)throw new t("UnregisteredFactory",{path:e});var r=Array.prototype.slice.call(arguments,1);return r=r&&r.length>0?r:n.options,this._construct(n.factory,r)}},{NAME:"Factory"}));return r}),define("util/adt/stack",["core/spinal","util/adt/collection"],function(e,t){var n=e.namespace("com.spinal.util.adt.Stack",t.inherit({initialize:function(e,t){return n.__super__.initialize.apply(this,arguments)},push:function(e){return this._valid(e)?(_.isNull(this._interface)?this.collection.unshift(e):this.collection.unshift(new this._interface(e)),!0):!1},peek:function(){return this.size()>0?this.collection[0]:null},pop:function(){return this.size()>0?this.remove(0):null},search:function(e){var t=-1
;for(var n=0;n<this.size();n++)if(_.isEqual(this.collection[n],e)){t=n;break}return t}},{NAME:"Stack"}));return n}),define("util/factories/async-factory",["core/spinal","util/factories/factory","util/adt/stack","util/string"],function(e,t,n,r){var i=e.namespace("com.spinal.util.factories.AsyncFactory",t.inherit({resources:null,initialize:function(e){return e||(e={}),this.resources=new n([],e),i.__super__.initialize.apply(this,arguments)},valid:function(e){return!_.defined(e)||!e.path?!1:!0},reset:function(e){return e||(e={}),this.resources.reset(e),this},set:function(e){return!e||!_.isArray(e)||!_.every(this.invoke("valid",e))?this:(this.resources.set(e),this)},findByPath:function(e){return this.resources.find(_.bind(function(t){return e&&t.path===e},this))},findPosBy:function(e){return this.resources.findPosBy(e)},push:function(e){return this.valid(e)?(this.resources.push(e),this):this},remove:function(e,t){return this.resources.remove(e,t)},exists:function(e){return _.defined(this.findByPath
(e))},swap:function(e){return this.resources.swap(e),this},load:function(e,t){return t||(t={}),this.resources.size()<=0?(e&&_.isFunction(e)&&e([]),this):(t.silent||this.trigger(i.EVENTS.prepared,this.resources.collection),this._execute(e,t))},onLoad:function(e,t){var n=this._handle(Array.prototype.slice.call(arguments,2),t);return e&&_.isFunction(e)&&e(n),t.silent||this.trigger(i.EVENTS.loaded,n),this},onError:function(e){return this.trigger(i.EVENTS.failed,e)},_handle:function(e,t){return _.map(e,function(e){var n=this.resources.pop(),r=i.__super__.register.call(this,n.path,e,n.options);return!t.silent&&n.callback&&_.isFunction(n.callback)&&n.callback(n.path,e),r},this)},_require:function(e,t,n){return require(e,_.bind(this.onLoad,this,t,n),_.bind(this.onError,this)),this},_execute:function(e,t){return this._require(_.pluck(this.resources.collection,"path"),e,t)}},{NAME:"AsyncFactory",EVENTS:{loaded:"com:spinal:util:factories:async:loaded",failed:"com:spinal:util:factories:async:failed"
,prepared:"com:spinal:util:factories:async:prepared"}}));return i}),define("util/factories/factory-mapper",["util/factories/async-factory","util/object"],function(e,t){var n=Spinal.namespace("com.spinal.util.factories.FactoryMapper",e.inherit({initialize:function(e){return n.__super__.initialize.apply(this,arguments)},isValid:function(e,t){return _.defined(t)&&t!==""&&_.defined(e)},source:function(e,t){return this.set(_.compact(_.flatten(this.retrieve.apply(this,arguments)))).defaults(),this},retrieve:function(e,t){return _.map(e,function(e,n){if(!this.isValid.apply(this,arguments))return null;var r=this.byKey({key:n,value:e},t);return this.attachCallback(this.byType(r,t),t)},this)},attachCallback:function(e,t){return!_.defined(e)||!_.defined(e.path)?null:!_.defined(t)||!_.isFunction(t)?e:_.extend(e,{callback:_.partial(t,e.params)})},byKey:function(e,t){return this[e.key]&&_.isFunction(this[e.key])?this[e.key].apply(this,arguments):e},byType:function(e){if(!_.defined(e)||_.defined(e.path
))return e;var t=typeof e.value;return _.isObject(e.value)&&(t="object"),_.isArray(e.value)&&(t="array"),this[t].apply(this,arguments)},defaults:function(){return this},string:function(e){return{}},number:function(e){return{}},"boolean":function(e){return{}},object:function(e){var t=_.toArray(arguments).slice(1);return t.unshift(e.value),this.retrieve.apply(this,t)},array:function(e){var t=_.toArray(arguments).slice(1);return t.unshift(e.value),this.retrieve.apply(this,t)}},{NAME:"FactoryMapper"}));return n}),define("util/exception/ui/ui",["core/spinal","util/exception/exception"],function(e,t){var n=e.namespace("com.spinal.util.exception.ui.UIException",t.inherit({initialize:function(){return n.__super__.initialize.apply(this,arguments)}},{NAME:"UIException",TYPES:{InvalidIDType:_.template("'id' parameter must be a String in the constructor."),SuccessorNotSpecified:_.template("'successor' parameter was not speficied in the constructor."),InvalidSuccessorType:_.template("'successor' must be an instance of com.spinal.ui.Container."
),UIStackViolation:_.template("UI Stack Violation found: view '<%= viewId %>' can not be found inside the successor specified '<%= succesorId %>'."),InvalidModelType:_.template("'model' must be an instance of Backbone.Model."),UnsupportedRenderMethod:_.template("unsupported render method -> '<%= method %>'."),InvalidInterfaceType:_.template("Unsupported Interface Type Or Interface could not be resolved."),InvalidMapperType:_.template("Mapper must be an instance or inherit from com.spinal.ui.form.mapper.FormMapper"),InvalidValidatorType:_.template("Validator must be an instance of inherit from com.spinal.ui.form.validator.Validator")}}));return n}),define("util/exception/ioc/context",["core/spinal","util/exception/exception"],function(e,t){var n=e.namespace("com.spinal.util.exception.ioc.ContextException",t.inherit({initialize:function(){return n.__super__.initialize.apply(this,arguments)}},{NAME:"ContextException",TYPES:{UndefinedContext:_.template("Context Not Defined"),FactoryNotDeclared
:_.template("Factory is required to be able to instanciate <%= clazz %>"),EngineNotDeclared:_.template("Engine not declared")}}));return n}),define("util/exception/ioc/dependency",["core/spinal","util/exception/exception"],function(e,t){var n=e.namespace("com.spinal.util.exception.ioc.DependencyException",t.inherit({initialize:function(){return n.__super__.initialize.apply(this,arguments)}},{NAME:"DependencyException",TYPES:{TargetRequired:_.template("Dependency Target is not defined"),PropertyRequired:_.template("Dependency Target Property is not defined"),UndefinedTargetProperty:_.template("Dependency Target property doesn't exists in Dependency Target"),UndefinedBoneReference:_.template("Dependency Bone Reference is not defined")}}));return n}),define("util/exception/ioc/plugin",["core/spinal","util/exception/exception"],function(e,t){var n=e.namespace("com.spinal.util.exception.ioc.PluginException",t.inherit({initialize:function(){return n.__super__.initialize.apply(this,arguments)}
},{NAME:"PluginException",TYPES:{ConfigNotSpecified:_.template("Config was not defined")}}));return n}),define("util/exception/ioc/processor",["core/spinal","util/exception/exception"],function(e,t){var n=e.namespace("com.spinal.util.exception.ioc.ProcessorException",t.inherit({initialize:function(){return n.__super__.initialize.apply(this,arguments)}},{NAME:"ProcessorException",TYPES:{EngineRequired:_.template("Processor requires an instance of Engine in order to work.")}}));return n}),define("util/exception/ioc/spec",["core/spinal","util/exception/exception"],function(e,t){var n=e.namespace("com.spinal.util.exception.ioc.SpecException",t.inherit({initialize:function(){return n.__super__.initialize.apply(this,arguments)}},{NAME:"SpecException",TYPES:{SpecNotDefined:_.template("Spec not defined"),InvalidSpecFormat:_.template("Spec format is invalid."),RequiredSpecId:_.template("Spec $id parameter not found.")}}));return n}),define("util/adt/queue",["core/spinal","util/adt/collection"],function(
e,t){var n=e.namespace("com.spinal.util.adt.Queue",t.inherit({capacity:0,initialize:function(e,t){return n.__super__.initialize.apply(this,arguments)},_valid:function(e){return this.size()>=this.capacity?!1:n.__super__._valid.apply(this,arguments)},set:function(e,t){t||(t={});if(_.isUndefined(t.capacity))throw new Error("Queue requires a 'capacity' property in order to be instanciate it.");if(e.length>t.capacity)throw new Error("Queue element's collection passed overflows the current capacity ["+t.capacity+"].");return this.capacity=t.capacity,n.__super__.set.apply(this,arguments),this},offer:function(e){return this._valid(e)?(_.isNull(this._interface)?this.collection.push(e):this.collection.push(new this._interface(e)),!0):!1},peek:function(){return this.size()>0?this.collection[0]:null},poll:function(){return this.size()>0?this.remove(0):null}},{NAME:"Queue"}));return n}),define("spinal-util",["util/string","util/object","util/factories/factory","util/factories/async-factory","util/factories/factory-mapper"
,"util/exception/exception","util/exception/util/factory","util/exception/ui/ui","util/exception/ioc/context","util/exception/ioc/dependency","util/exception/ioc/plugin","util/exception/ioc/processor","util/exception/ioc/spec","util/adt/collection","util/adt/iterator","util/adt/queue","util/adt/stack"],function(){});