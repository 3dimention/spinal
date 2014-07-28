/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
	'util/error/types/processor-exception',
	'ioc/processor/bone'], function(Context, ProcessorException, BoneProcessor) {

	/**
	*	Create Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.CreateProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var CreateProcessor = Spinal.namespace('com.spinal.ioc.processor.CreateProcessor', BoneProcessor.inherit({

		/**
		*	Supported Notations
		*	@public
		*	@property notations
		*	@type Array
		**/
		notations: ['module'],

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		initialize: function() {
			return CreateProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Create RegExp used by this processor
		*	@private
		*	@method _regexp
		*	@return RegExp
		**/
		_regexp: function() {
			return new RegExp('\\' + Context.PREFIX + '(' + this.notations.join('|') + ')$', 'i');
		},

		/**
		*	Add the module dependency into the bone factory stack
		*	@private
		*	@chainable
		*	@method _enqueue
		*	@param moduleId {String} module id
		*	@param dependencies {Array} dependency for the module
		*	@param success {Function} callback function to be executed once the module is loaded
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		_enqueue: function(moduleId, dependencies, success) {
			var mBone = this.ctx.query.findBoneById(moduleId);
			if(!mBone) return this;
			Context.BoneFactory.add({
				id: moduleId, class: mBone.$module.class, params: mBone.$module.params,
				dependency: dependencies, success: success
			});
			return this;
		},

		/**
		*	Creates an instance of the module passing the parameters to the constructor function
		*	@public
		*	@method create
		*	@param className {String} current module class name to pass to BoneFactory
		*	@param [params] {Object} module data (includes module id, params reference object and so on)
		*	@return Object
		**/
		create: function(className, data) {
			if(!className || !data) throw new Error('Module Create Error'); // Convert it into a defined exception.
			var bone = this.ctx.query.findBoneById(data.id);
			if(data.dependency) this.injectDependency(bone.$module, data.dependency);
			bone._$created = (bone) ? Context.BoneFactory.create(className, data.params) : null;
			return bone._$created;
		},

		/**
		*	Inject dependency via constructor params into the current module
		*	@public
		*	@method injectDependency
		*	@param module {Object} bone module in which the dependency will be injected
		*	@param dependency {Object} dependency data
		**/
		injectDependency: function(module, dependency) {
			_.each(dependency, function(d) { module.params[d.key] = this.ctx.query.findBoneById(d.id)._$created; }, this);
		},

		/**
		*	Check if there are dependencies (via constructor params) passed as parameter.
		*	@public
		*	@method hasDependencies
		*	@param params {Object} constructor params to evaluate
		*	@return Boolean
		**/
		hasDependencies: function(params) {
			return (_.filter(params, function(v, k) { return this.getDependency(v); }, this).length > 0);
		},

		/**
		*	Handler when a module depends on a bone of '$module' type in order to be instanciated.
		*	@public
		*	@method handleDependency
		*	@param id {Object} current bone id
		*	@param bone {Object} current bone to evaluate
		*	@param [parentBone] {Object} parent bone ref
		*	@return Object
		**/
		handleDependency: function(bone, id, parentBone) {
			var depId = this.getDependency(bone),
				dBone = (depId) ? this.ctx.query.findBoneById(depId) : null;
			var result = CreateProcessor.__super__.handleDependency.apply(this, [dBone, id, parentBone]);
			if(_.isUndefined(result) && dBone && parentBone && _.isObject(dBone)) {
				var dependency = (dBone.$module && !this.ctx.query.isCreated(dBone)) ? { id: depId, key: id } : null;
				this._enqueue(parentBone.id, [dependency], _.bind(this.create, this));
			}
			return result;
		},

		/**
		*	Handles specific notation with the current processor.
		*	@public
		*	@method handleNotation
		*	@param bone {Object} current bone to evaluate
		*	@param id {Object} current bone id
		*	@param [parentBone] {Object} parent bone ref
		*	@return Boolean
		**/
		handleNotation: function(bone, id, parentBone) {
			var result = CreateProcessor.__super__.handleNotation.apply(this, arguments);
			if(result) {
				if(!bone.class) throw new ProcessorException('InvalidModuleDeclaration');
				(bone.params && this.hasDependencies(bone.params)) ?
					CreateProcessor.__super__.execute.call(this, this.handleNotation, bone.params, parentBone.id) :
					this._enqueue(parentBone.id, null, _.bind(this.create, this));
			}
			return result;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@param [bone] {Object} Bone context in which the execution will be narrowed down
		*	@param [id] {Object} Bone Id of the context
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function(bone, id) {
			var result = CreateProcessor.__super__.execute.call(this, this.handleNotation, bone, id);
			Context.BoneFactory.load(_.bind(function() {
				this.ctx.trigger(Context.EVENTS.created, result);
				this.ctx.trigger(Context.EVENTS.processed, { type: CreateProcessor.NAME });
			}, this));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'CreateProcessor'

	}));

	return CreateProcessor;

});
