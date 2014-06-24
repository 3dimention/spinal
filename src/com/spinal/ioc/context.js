/**
*	@module com/spinal/ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/string',
		'ioc/bone-factory',
		'util/adt/collection'], function(Spinal, StringUtils, BoneFactory, Collection) {

	/**
	*	IOC Context Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.Context
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.ioc.BoneFactory
	*	@requires com.spinal.util.adt.Collection
	*
	*	Life cycle phases of a Bone (Component) inside a context:
	*
	*	1) $Create (Context will register the constructor function as a Factory and instanciate)
	*		a) $Module -> AMD module path that points to the module
	*		b) $Params -> Arguments to pass to the constructor function
	*	2) $Ready -> Bone was fully created and ready to use.
	*	3) $Destroy -> Bone was destroyed inside the context allowing to execute code before (after)
	*	a component die.
	*
	*	Processor's Composition (Order of execution)
	*
	*	1) IoCProcessor -> Builds bones structure
	*	2) BoneProcessor -> Solves Bones references across other bone declarations and module requires (String parsing logic).
	*	3) CreateProcessor -> Instanciate Modules
	*	4) ReadyProcessor -> Calls operations on modules already instanciated by the context.
	*	5) DestroyProcessor -> Create delayed behaviors when modules are destroyed (Behavioral control).
	*		Destroy Processor might be not necessary; AOP can offer a better solution to that (subject to be deleted).
	**/
	var Context = Spinal.namespace('com.spinal.ioc.Context', Spinal.SpinalClass.inherit({

		/**
		*	Identifier
		*	@public
		*	@property id
		*	@type String
		**/
		id: StringUtils.uuid(),

		/**
		*	Bones
		*	@public
		*	@property bones
		*	@type com.spinal.util.adt.Collection
		**/
		bones: null,

		/**
		*	Bone Factory instance
		*	@public
		*	@property boneFactory
		*	@type com.spinal.ioc.BoneFactory
		**/
		boneFactory: null,

		/**
		*	Processors List used by the context
		*	@public
		*	@property processors
		*	@type Array
		**/
		processors: [
			'ioc/processor/create',
			'ioc/processor/ready',
			'ioc/processor/destroy'
		],

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param [opts] {Object} Initial Options
		*	@return {com.spinal.ioc.Context}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			this.bones = new Collection();
			this.boneFactory = new BoneFactory();
			return Context.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves a Bone from the current context.
		*	@public
		*	@method getBone
		*	@param id {String} Bone Id
		*	@return Object
		**/
		getBone: function(id) {
			if(!id) return null;
			return this.bones.find(function(bone) { return (bone.id === id); });
		},

		/**
		*	Retrieves the bone's type by id in the current context.
		*	@public
		*	@method getBoneType
		*	@param id {String} Bone Id
		*	@return Object
		**/
		getBoneType: function(id) {
			var bone = this.getBone(id);
			return (bone) ? bone.toString() : null;
		},

		/**
		*	Bone Factory invoke method wrapper
		*	@public
		*	@method invoke
		*	@param methodName {String} Bone factory method
		*	@param [callback] {Function} Optional Callback
		*	@return Object
		**/
		invoke: function(methodName, callback) {
			if(!methodName) return null;
			var args = Array.prototype.slice.apply(arguments, 1);
			return (this.boneFactory[methodName]) ? this.boneFactory[methodName](args) : null;
		},

		/**
		*	Context Wiring
		*	@public
		*	@chainable
		*	@method wire
		*	@param spec {Object} context specification to be wired
		*	@param callback {Function} callback function to be called after autowiring.
		*	@return {com.spinal.ioc.Context}
		**/
		wire: function(spec, callback) {
			if(!spec) { callback(this); return this; }
			if(!_.isObject(spec)) throw new ContextException('InvalidSpecFormat');
			this.boneFactory.register(this.processors, _.bind(this._onProcessorsLoaded, this, spec, callback));
			return this;
		},

		/**
		*	Context Parser
		*	@private
		*	@method _parse
		*	@param spec {Object} context spec to be wired
		*	@param [callback] {Function} Optional Callback
		*	@return {com.spinal.ioc.Context}
		**/
		_parse: function(spec, callback) {
			if(callback && _.isFunction(callback)) callback(this);
			this.trigger(Context.EVENTS.initialized, this);
			return this;
		},

		/**
		*	Processors loaded callback
		*	@private
		*	@method _onProcessorsLoaded
		*	@param processors {Array} Array of Processor Modules
		*	@param [callback] {Function} Optional Callback
		**/
		_onProcessorsLoaded: function(spec, callback, processors) {
			_.each(processors function(processor) {
				this[processor.NAME] = this.invoke('create', processor.NAME);
				// Continue Here...
			}, this);
			this.execute(spec, callback);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Context',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event initialized
			**/
			initialized: 'com:spinal:ioc:context:initialized'
		},

		/**
		*	Static IoC Initializer
		*	@static
		*	@method Initialize
		*	@param spec {Object} Default spec
		*	@param callback {Function} callback pass to the wire
		*	@return com.spinal.ioc.Context
		**/
		Initialize: function(spec, callback) {
			return (arguments.length === 1 && _.isFunction(spec)) ?
				new Context().wire(null, spec) :
				new Context().wire(spec, callback);
		}

	}));

	return Context;

});
