/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/dependency',
	'util/adt/collection',
	'util/object'], function(Dependency, Collection, ObjectUtil) {

	/**
	*	Class Annotation
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Annotation
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.helpers.Dependency
	*	@requires com.spinal.util.adt.Collection
	*	@requires com.spinal.util.ObjectUtil
	**/
	var Annotation = Spinal.namespace('com.spinal.ioc.engine.annotation.Annotation', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} annotation attributes
		*	@return com.spinal.ioc.engine.annotation.Annotation
		**/
		initialize: function(attrs) {
			this.valid(attrs);
			_.extend(this, { _id: _.keys(attrs)[0], _value: _.values(attrs)[0] });
			this.dependencies = new Collection(null, { interface: Dependency });
			return Annotation.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves annotation id
		*	@public
		*	@method getId
		*	@return Object
		**/
		getId: function() {
			return this._id;
		},

		/**
		*	Retrieves annotation value
		*	@public
		*	@method getValue
		*	@return Object
		**/
		getValue: function() {
			return this._value;
		},

		/**
		*	Retrieves dependencies
		*	@public
		*	@method getDependencies
		*	@return com.spinal.util.adt.Collection
		**/
		getDependencies: function() {
			return this.dependencies;
		},

		/**
		*	Validates annotation
		*	@public
		*	@method valid
		*	@throws Error
		*	@param [attrs] {Object} annotation attributes
		**/
		valid: function(attrs) {
			if(!_.defined(attrs)) throw new Error('Annotation cannot be undefined');
			if(!_.isObject(attrs)) throw new Error('Annotation type must be an object');
		},

		/**
		*	Default Dependency create strategy
		*	@public
		*	@method create
		*	@param expr {String} expression to be evaluated
		*	@param key {String} context property key used to determine where to inject expression
		*	@param context {Object} bone reference
		*	@return Object
		**/
		create: function(expr, key, context) {
			if(!Annotation.isExpressionValid(expr) || !context) return null;
			return this;
		},

		/**
		*	Dependency gathering on this annotation
		*	This method uses recursion.
		*	@public
		*	@method retrieve
		*	@param [ctx] {Object} context found on nested structure
		*	@return Array
		**/
		retrieve: function(ctx) {
			ctx = (ctx) ? ctx : this.getValue();
			return _.compact(_.flatten(_.map(ctx, function(value, key, target) {
				return ((ObjectUtil.isRealObject(value) || _.isArray(value)) && !ObjectUtil.isBackbone(value)) ?
					this.retrieve(value) : this.create.apply(this, arguments);
			}, this)));
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Annotation',

		/**
		*	@static
		*	@property PREFIX
		*	@type String
		**/
		PREFIX: '$',

		/**
		*	Returns true if expression matches a annotation nomenclature
		*	@static
		*	@method isExpressionValid
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isExpressionValid: function(expr) {
			return (_.defined(expr) && _.isString(expr) && expr.indexOf(Annotation.PREFIX) === 0);
		}

	}));

	return Annotation;

});
